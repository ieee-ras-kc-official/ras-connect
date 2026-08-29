import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const workspace = process.cwd();
const sourceRoot = join(workspace, "stitch_ras_day_showcase");
const outputRoot = join(workspace, "public", "images", "stitch");

const sourceFiles = [
  "home_ras_day/code.html",
  "chapters_ras_day/code.html",
  "chapter_detail_ras_day/code.html",
  "event_detail_ras_day/code.html",
  "archive_ras_day/code.html",
];

const extensionFor = (contentType: string | null) => {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("avif")) return "avif";
  return "jpg";
};

await mkdir(outputRoot, { recursive: true });

const manifest: Record<string, Array<{ file: string; source: string }>> = {};

for (const relativeFile of sourceFiles) {
  const html = await readFile(join(sourceRoot, relativeFile), "utf8");
  const urls = Array.from(
    new Set(
      html.match(
        /https:\/\/lh3\.googleusercontent\.com\/aida-public\/[A-Za-z0-9_-]+/g,
      ) ?? [],
    ),
  );
  const page = basename(relativeFile.replace("/code.html", ""));
  manifest[page] = [];

  for (const [index, url] of urls.entries()) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download ${url}: ${response.status}`);
    }

    const extension = extensionFor(response.headers.get("content-type"));
    const file = `${page}-${String(index + 1).padStart(2, "0")}.${extension}`;
    const bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(join(outputRoot, file), bytes);
    manifest[page].push({ file: `/images/stitch/${file}`, source: url });
  }
}

await writeFile(
  join(outputRoot, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(
  `Downloaded ${Object.values(manifest).flat().length} Stitch assets to ${outputRoot}`,
);
