import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export async function processImage(filename: string, width: number, height: number): Promise<string> {
  const inputPath = path.join(__dirname, '../../../uploads', filename);
  const outputPath = path.join(__dirname, '../../../processed', `${width}x${height}-${filename}`);

  if (!fs.existsSync(inputPath)) {
    throw new Error('Image does not exist');
  }

  if (fs.existsSync(outputPath)) {
    return outputPath;
  }

  await sharp(inputPath).resize(width, height).toFile(outputPath);

  return outputPath;
}
