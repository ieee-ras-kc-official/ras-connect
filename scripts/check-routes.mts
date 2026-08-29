const origin = process.env.RAS_DAY_ORIGIN ?? "http://localhost:3000";

const routes = [
  { path: "/", status: 200, content: "RAS Connect" },
  { path: "/chapters", status: 200, content: "Student Branch Chapters" },
  { path: "/chapters?q=TKM", status: 200, content: "Student Branch Chapters" },
  {
    path: "/chapters/tkm-college-of-engineering",
    status: 200,
    content: "TKM College of Engineering",
  },
  {
    path: "/events/robotics-primer-line-follower",
    status: 200,
    content: "Robotics Primer",
  },
  { path: "/archive", status: 200, content: "Event archive" },
  {
    path: "/archive?year=all&chapter=tkm-college-of-engineering&q=robotics",
    status: 200,
    content: "Event archive",
  },
  { path: "/chapters/not-a-real-chapter", status: 404, content: "Page not found" },
  { path: "/events/not-a-real-event", status: 404, content: "Page not found" },
] as const;

for (const route of routes) {
  const response = await fetch(`${origin}${route.path}`);
  const body = await response.text();

  if (response.status !== route.status) {
    throw new Error(
      `${route.path}: expected HTTP ${route.status}, received ${response.status}`,
    );
  }

  if (!body.includes(route.content)) {
    throw new Error(`${route.path}: response did not include "${route.content}"`);
  }

  console.log(`PASS ${response.status} ${route.path}`);
}
