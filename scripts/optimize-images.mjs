import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const assetsDir = path.join(process.cwd(), "assets");
const targets = [
  { name: "hero1", width: 1280, avifQuality: 56, webpQuality: 76, jpegQuality: 78 },
  { name: "abuja-community", width: 1280, avifQuality: 50, webpQuality: 72, jpegQuality: 74 },
  { name: "abuja-enterprise", width: 1280, avifQuality: 50, webpQuality: 72, jpegQuality: 74 },
  { name: "abuja-security", width: 1280, avifQuality: 50, webpQuality: 72, jpegQuality: 74 },
  { name: "abuja-skills", width: 1280, avifQuality: 50, webpQuality: 72, jpegQuality: 74 },
];

const formatBytes = (bytes) => `${Math.round(bytes / 1024)} KB`;

for (const target of targets) {
  const input = path.join(assetsDir, `${target.name}.png`);
  const image = sharp(input).resize({
    width: target.width,
    withoutEnlargement: true,
  });

  const outputs = [
    {
      file: path.join(assetsDir, `${target.name}.avif`),
      stream: image.clone().avif({ quality: target.avifQuality, effort: 6 }),
    },
    {
      file: path.join(assetsDir, `${target.name}.webp`),
      stream: image.clone().webp({ quality: target.webpQuality, effort: 6 }),
    },
    {
      file: path.join(assetsDir, `${target.name}.jpg`),
      stream: image.clone().jpeg({ quality: target.jpegQuality, mozjpeg: true }),
    },
  ];

  for (const output of outputs) {
    await output.stream.toFile(output.file);
  }

  const original = await fs.stat(input);
  const optimized = await Promise.all(outputs.map((output) => fs.stat(output.file)));
  console.log(
    `${target.name}: ${formatBytes(original.size)} -> ${optimized
      .map((file) => formatBytes(file.size))
      .join(" / ")}`
  );
}
