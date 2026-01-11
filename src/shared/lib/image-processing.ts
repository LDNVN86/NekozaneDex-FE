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

/**
 * Process image buffer with Sharp
 * - Resize to max dimensions
 * - Convert to WebP
 * - Optimize quality
 */
export async function processImage(
  buffer: Buffer,
  options: ImageProcessingOptions = DEFAULT_OPTIONS
): Promise<{ buffer: Buffer; info: sharp.OutputInfo }> {
  const { maxWidth, maxHeight, quality, format } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let pipeline = sharp(buffer).rotate(); // Auto-rotate based on EXIF

  // Resize if needed (maintaining aspect ratio)
  if (maxWidth || maxHeight) {
    pipeline = pipeline.resize(maxWidth, maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Convert to target format
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

/**
 * Process avatar image with optimized settings
 * - 200x200 max
 * - WebP format
 * - Higher quality for small images
 */
export async function processAvatar(
  buffer: Buffer
): Promise<{ buffer: Buffer; info: sharp.OutputInfo }> {
  return processImage(buffer, AVATAR_OPTIONS);
}

/**
 * Process chapter image with standard settings
 * - 1200px max width
 * - WebP format
 */
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

/**
 * Get new filename with correct extension
 */
export function getProcessedFilename(
  originalFilename: string,
  format: "webp" | "jpeg" | "png" = "webp"
): string {
  const baseName = originalFilename.replace(/\.[^/.]+$/, "");
  return `${baseName}.${format}`;
}
