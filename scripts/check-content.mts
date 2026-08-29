import { access } from "node:fs/promises";
import { join } from "node:path";
import { chapters, events } from "../src/data/mock-data.ts";

const assert: (condition: unknown, message: string) => asserts condition = (
  condition,
  message,
) => {
  if (!condition) throw new Error(message);
};

assert(new Set(chapters.map(({ slug }) => slug)).size === chapters.length, "Chapter slugs must be unique");
assert(new Set(events.map(({ slug }) => slug)).size === events.length, "Event slugs must be unique");

const chapterSlugs = new Set(chapters.map(({ slug }) => slug));
for (const event of events) {
  assert(chapterSlugs.has(event.chapterSlug), `${event.slug} references an unknown chapter`);
}

const imagePaths = new Set(
  [
    ...chapters.map(({ image }) => image),
    ...events.flatMap(({ image, gallery }) => [
      image,
      ...gallery.map(({ src }) => src),
    ]),
  ].filter((path): path is string => Boolean(path)),
);

for (const imagePath of imagePaths) {
  assert(imagePath.startsWith("/images/"), `${imagePath} is not a local public asset`);
  await access(join(process.cwd(), "public", imagePath));
}

const archiveYears = new Set(
  events
    .filter(({ archived }) => archived)
    .map(({ date }) => date?.year)
    .filter((year): year is number => typeof year === "number"),
);

assert(events.some(({ date }) => !date), "Mock data must exercise an event without a date");
assert(events.some(({ gallery }) => gallery.length === 0), "Mock data must exercise an event without a gallery");
assert(chapters.some(({ image }) => !image), "Mock data must exercise a missing image");
assert(archiveYears.size > 1, "Mock data must include archived events across multiple years");
assert(
  chapters.some(
    ({ slug }) => !events.some(({ chapterSlug, archived }) => chapterSlug === slug && !archived),
  ),
  "Mock data must exercise a chapter without current events",
);

console.log(
  `PASS ${chapters.length} chapters, ${events.length} events, ${imagePaths.size} local image references`,
);
