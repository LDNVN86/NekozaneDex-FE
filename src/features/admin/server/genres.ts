import "server-only";
import { serverFetch } from "@/shared/lib/api";
import { ok, err, type Result } from "@/shared/lib/result";
import type { Genre, SingleResponse } from "../interface";

export async function getAllGenres(): Promise<Result<Genre[]>> {
  try {
    const data = await serverFetch<SingleResponse<Genre[]>>("/genres");
    return ok(data.data);
  } catch (error) {
    return err(
      error instanceof Error ? error.message : "Không thể lấy thể loại"
    );
  }
}
