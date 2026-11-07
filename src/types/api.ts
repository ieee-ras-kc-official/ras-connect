export type Chapter = {
  _id: string; slug: string; name: string; college: string; location: string;
  description: string; logo: string; cluster: number | null; updatedAt?: string;
};
export type RasEvent = {
  _id: string; slug: string; chapterSlug: string; name: string; image: string;
  imageAlt: string; location: string; date: string; description: string[];
  featured: boolean; status: "pending" | "verified" | "rejected";
  rejectionReason: string; registrationLink: string; updatedAt?: string;
};
export type SubAdmin = { _id: string; username: string; chapterSlug: string; mustChangePassword: boolean };
export type Cluster = { number: number; lead: string; subcom: string; hub: string };
