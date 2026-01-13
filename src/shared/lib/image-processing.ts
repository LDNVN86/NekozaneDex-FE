import sharp from "sharp";

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "webp" | "jpeg" | "png";
}

const DEFAULT_OPTIONS: ImageProcessingOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 80,
  format: "webp",
};

const AVATAR_OPTIONS: ImageProcessingOptions = {
  maxWidth: 200,
  maxHeight: 200,
  quality: 85,
  format: "webp",
};

export async function processImage(
  buffer: Buffer,
  options: ImageProcessingOptions = DEFAULT_OPTIONS
): Promise<{ buffer: Buffer; info: sharp.OutputInfo }> {
  const { maxWidth, maxHeight, quality, format } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let pipeline = sharp(buffer).rotate();

  if (maxWidth || maxHeight) {
    pipeline = pipeline.resize(maxWidth, maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  switch (format) {
    case "webp":
      pipeline = pipeline.webp({ quality });
      break;
    case "jpeg":
      pipeline = pipeline.jpeg({ quality });
      break;
    case "png":
      pipeline = pipeline.png({ quality });
      break;
  }

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

  return { buffer: data, info };
}
export async function processAvatar(
  buffer: Buffer
): Promise<{ buffer: Buffer; info: sharp.OutputInfo }> {
  return processImage(buffer, AVATAR_OPTIONS);
}

export async function processChapterImage(
  buffer: Buffer
): Promise<{ buffer: Buffer; info: sharp.OutputInfo }> {
  return processImage(buffer, {
    maxWidth: 1200,
    maxHeight: 2000,
    quality: 80,
    format: "webp",
  });
}

export function getProcessedFilename(
  originalFilename: string,
  format: "webp" | "jpeg" | "png" = "webp"
): string {
  const baseName = originalFilename.replace(/\.[^/.]+$/, "");
  return `${baseName}.${format}`;
}
