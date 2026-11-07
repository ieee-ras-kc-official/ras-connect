import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd());
import assert from "node:assert/strict";
const base = process.env.NEXT_PUBLIC_API_URL;
if (!base) throw new Error("NEXT_PUBLIC_API_URL must identify the content source");
const fetchList = async path => { const res = await fetch(`${base}${path}`); assert(res.ok, `${path}: HTTP ${res.status}`); const value = await res.json(); assert(Array.isArray(value), `${path} must return an array`); return value; };
const [chapters, events] = await Promise.all([fetchList("/api/chapters"), fetchList("/api/events")]);
for (const rows of [chapters,events]) { assert.equal(new Set(rows.map(r=>r.slug)).size, rows.length, "Duplicate slugs"); for (const row of rows) assert.match(row.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/); }
const slugs = new Set(chapters.map(chapter=>chapter.slug));
for (const event of events) { assert.equal(event.status,"verified"); assert(slugs.has(event.chapterSlug), `Missing chapter for ${event.slug}`); assert.match(event.date,/^\d{4}-\d{2}-\d{2}(T.*)?$/); assert(!Number.isNaN(Date.parse(event.date)), `Invalid date: ${event.slug}`); }
console.log(`Validated ${chapters.length} chapters and ${events.length} published events`);
