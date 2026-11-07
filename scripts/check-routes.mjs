import nextEnv from "@next/env";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
nextEnv.loadEnvConfig(process.cwd());
const port = process.env.SMOKE_PORT || "3100";
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", port], { stdio: ["ignore", "pipe", "pipe"] });
let logs = "";
server.stdout.on("data", chunk => { logs += chunk; });
server.stderr.on("data", chunk => { logs += chunk; });
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch(`${base}/login/`)).ok) { ready = true; break; } } catch {}
    if (server.exitCode !== null) break;
    await new Promise(resolve => setTimeout(resolve,100));
  }
  assert(ready, `Native Next server did not start: ${logs}`);
  const checkPage = async (path, status = 200) => {
    const res = await fetch(base+path);
    assert.equal(res.status,status,`${path}: unexpected HTTP status`);
    const csp=res.headers.get("content-security-policy") || "";
    assert(csp.includes("https://api.cloudinary.com")); assert(!csp.includes("unsafe-eval"));
    const nonce=csp.match(/'nonce-([^']+)'/)?.[1]; assert(nonce, `${path}: missing nonce`);
    assert.equal(res.headers.get("x-content-type-options"),"nosniff");
    const html=await res.text();
    for (const [,attrs,body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (body || /\bsrc=/.test(attrs)) assert(attrs.includes(`nonce="${nonce}"`),`${path}: script missing request nonce`);
    }
    return {html,nonce};
  };
  const home=await checkPage("/"); assert(home.html.includes("Explore All Events"));
  assert.notEqual((await checkPage("/")).nonce, home.nonce,"CSP nonce reused across requests");
  const site = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  for (const route of ["events","chapters","archive"]) assert((await checkPage(`/${route}/`)).html.includes(`rel="canonical" href="${site}/${route}/"`));
  for (const route of ["login","admin/dashboard"]) assert((await checkPage(`/${route}/`)).html.includes("noindex"));
  await checkPage("/does-not-exist/",404);
  for (const collection of ["events","chapters"]) {
    await checkPage(`/${collection}/does-not-exist/`,404);
    const records = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${collection}`)).json();
    if (records[0]) {
      const page=await checkPage(`/${collection}/${encodeURIComponent(records[0].slug)}/`);
      assert(page.html.includes(`<title>${records[0].name} | RAS Connect IEEE</title>`));
      assert(page.html.includes(records[0].name));
    }
  }
  const sitemap=await fetch(`${base}/sitemap.xml`);assert.equal(sitemap.status,200);assert((await sitemap.text()).includes(`${site}/events/`));
  console.log("Native Vercel/Next routes, live metadata, HTTP 404s and per-request script nonces validated");
} finally {
  server.kill("SIGTERM");
  if (server.exitCode === null) await once(server,"exit");
}
