"use client";

import { useEffect, useRef, useState } from "react";
import { Centrifuge, Subscription } from "centrifuge";

interface UseCentrifugoOptions {
  channel: string;
  onMessage: (data: any) => void;
  enabled?: boolean;
}

const isDev = process.env.NODE_ENV === "development";

export function useCentrifugo({
  channel,
  onMessage,
  enabled = true,
}: UseCentrifugoOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const centrifugeRef = useRef<Centrifuge | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);
  const onMessageRef = useRef(onMessage);

  // Keep callback ref updated
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!enabled) return;

    const connect = async () => {
      try {
        // Fetch token from backend
        const res = await fetch("/api/proxy/realtime/token", {
          credentials: "include",
        });

        if (!res.ok) {
          // Silent fail - realtime not available
          if (isDev)
            console.log("[Centrifugo] Token not available, realtime disabled");
          return;
        }

        const data = await res.json();
        const token = data.data?.token;

        if (!token) {
          if (isDev) console.log("[Centrifugo] No token, realtime disabled");
          return;
        }

        const wsUrl =
          process.env.NEXT_PUBLIC_CENTRIFUGO_URL ||
          "ws://localhost:8000/connection/websocket";

        const centrifuge = new Centrifuge(wsUrl, { token });

        centrifuge.on("connected", () => {
          if (isDev) console.log("[Centrifugo] Connected");
          setIsConnected(true);
        });

        centrifuge.on("disconnected", () => {
          if (isDev) console.log("[Centrifugo] Disconnected");
          setIsConnected(false);
        });

        centrifuge.on("error", () => {
          // Silent fail - Centrifugo server not available
          setIsConnected(false);
        });

        const sub = centrifuge.newSubscription(channel);

        sub.on("publication", (ctx) => {
          if (isDev) console.log("[Centrifugo] Message:", ctx.data);
          onMessageRef.current(ctx.data);
        });

        sub.on("error", () => {
          // Silent fail
        });

        sub.subscribe();
        centrifuge.connect();

        centrifugeRef.current = centrifuge;
        subscriptionRef.current = sub;
      } catch {
        // Silent fail - realtime not critical
        if (isDev)
          console.log("[Centrifugo] Connection failed, realtime disabled");
      }
    };

    connect();

    return () => {
      subscriptionRef.current?.unsubscribe();
      centrifugeRef.current?.disconnect();
    };
  }, [channel, enabled]);

  return { isConnected };
}
