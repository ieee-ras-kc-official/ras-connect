export type Chapter = {
  slug: string;
  name: string;
  college: string;
  location: string;
  description: string;
  image: string | null;
  imageAlt: string;
  featured?: boolean;
};

export type EventDate = {
  iso: string;
  label: string;
  year: number;
};

export type RasEvent = {
  slug: string;
  chapterSlug: string;
  name: string;
  image: string | null;
  imageAlt: string;
  location: string;
  date?: EventDate;
  description: string[];
  gallery: Array<{ src: string; alt: string }>;
  archived: boolean;
  featured?: boolean;
};

// UI-only mock content. Replace these records when approved production data is available.
export const chapters: Chapter[] = [
  {
    slug: "model-engineering-college",
    name: "Robotics Society MEC",
    college: "Government Model Engineering College",
    location: "Kochi, Kerala",
    description:
      "A student community exploring robotics through practical builds, peer-led workshops, and collaborative demonstrations.",
    image: "/card1.jpeg",
    imageAlt: "Students presenting robotics projects in a college courtyard",
    featured: true,
  },
  {
    slug: "tkm-college-of-engineering",
    name: "RAS SBC TKMCE",
    college: "TKM College of Engineering",
    location: "Kollam, Kerala",
    description:
      "A hands-on chapter bringing students together around autonomous systems, electronics, and industrial automation.",
    image: "/card1.jpeg",
    imageAlt: "Students assembling robots together in a bright engineering lab",
    featured: true,
  },
  {
    slug: "cusat",
    name: "IEEE RAS CUSAT",
    college: "Cochin University of Science and Technology",
    location: "Kochi, Kerala",
    description:
      "A campus group connecting robotics theory with focused workshops, technical discussions, and project showcases.",
    image: "/card1.jpeg",
    imageAlt: "Students attending a technical presentation in a large auditorium",
    featured: true,
  },
  {
    slug: "gec-barton-hill",
    name: "RAS GECB",
    college: "Government Engineering College Barton Hill",
    location: "Thiruvananthapuram, Kerala",
    description:
      "A collaborative robotics community focused on building, testing, and sharing applied automation projects.",
    image: "/card1.jpeg",
    imageAlt: "Students working with a robotic arm in an engineering laboratory",
    featured: true,
  },
  {
    slug: "college-of-engineering-trivandrum",
    name: "IEEE RAS CET",
    college: "College of Engineering Trivandrum",
    location: "Thiruvananthapuram, Kerala",
    description:
      "A chapter where students learn through robotics workshops, autonomous-system projects, and conversations with practitioners.",
    image: "/card1.jpeg",
    imageAlt: "Students collaborating around a robot prototype",
    featured: true,
  },
  {
    slug: "nss-college-of-engineering",
    name: "IEEE RAS NSSCE",
    college: "NSS College of Engineering",
    location: "Palakkad, Kerala",
    description:
      "A growing student chapter preparing its first set of robotics and automation activities for the showcase.",
    image: "/card1.jpeg",
    imageAlt: "Students discussing robotics code and building prototypes",
    featured: true,
  },
];

export const events: RasEvent[] = [
  {
    slug: "robotics-primer-line-follower",
    chapterSlug: "college-of-engineering-trivandrum",
    name: "Robotics Primer: Build a Line Follower",
    image: "/card1.jpeg",
    imageAlt: "A student assembling electronics at a robotics workbench",
    location: "Robotics Lab, College of Engineering Trivandrum",
    date: { iso: "2024-11-08", label: "November 8, 2024", year: 2024 },
    description: [
      "A practical introduction to the sensors, control logic, and electronics behind a line-following robot.",
      "Students work in small teams to assemble, test, and refine a compact mobile platform.",
    ],
    gallery: [],
    archived: false,
    featured: true,
  },
  {
    slug: "autonomous-drone-navigation-workshop",
    chapterSlug: "college-of-engineering-trivandrum",
    name: "Autonomous Drone Navigation Workshop",
    image: "/card1.jpeg",
    imageAlt: "A drone demonstration during a technical workshop",
    location: "Main Seminar Hall, College of Engineering Trivandrum",
    date: { iso: "2024-12-02", label: "December 2, 2024", year: 2024 },
    description: [
      "A guided session on sensing, flight control, and the planning methods used in autonomous aerial systems.",
      "The workshop combines a technical walkthrough with a live indoor demonstration.",
    ],
    gallery: [],
    archived: false,
    featured: true,
  },
  {
    slug: "industry-connect-automation-kerala",
    chapterSlug: "college-of-engineering-trivandrum",
    name: "Industry Connect: Automation in Kerala",
    image: "/card1.jpeg",
    imageAlt: "A panel discussion about robotics and industrial automation",
    location: "College of Engineering Trivandrum",
    date: { iso: "2024-12-12", label: "December 12, 2024", year: 2024 },
    description: [
      "A focused discussion connecting students with practitioners working across robotics and industrial automation.",
      "The conversation covers engineering roles, project constraints, and how teams move from prototypes to deployed systems.",
    ],
    gallery: [],
    archived: false,
  },
  {
    slug: "robotics-workshop-2024",
    chapterSlug: "tkm-college-of-engineering",
    name: "Robotics Workshop 2024",
    image: "/card1.jpeg",
    imageAlt: "Students building small mobile robots during a workshop",
    location: "Main Auditorium, TKM College of Engineering, Kollam",
    date: { iso: "2024-10-15", label: "October 15, 2024", year: 2024 },
    description: [
      "An intensive workshop introducing the fundamentals of robotics design and programming through a complete hands-on build.",
      "Participants assemble line-following robots, connect sensors, and test their control logic with support from student mentors.",
    ],
    gallery: [
      {
        src: "/card1.jpeg",
        alt: "Hands connecting electronics on a small robotic chassis",
      },
      {
        src: "/card1.jpeg",
        alt: "A mobile rover following a marked path in a laboratory",
      },
      {
        src: "/card1.jpeg",
        alt: "Students reviewing robotics code together on a laptop",
      },
      {
        src: "/card1.jpeg",
        alt: "A technical presentation in a college auditorium",
      },
    ],
    archived: false,
    featured: true,
  },
  {
    slug: "drone-navigation-systems",
    chapterSlug: "tkm-college-of-engineering",
    name: "Drone Navigation Systems",
    image: "/card1.jpeg",
    imageAlt: "A drone being tested in a robotics laboratory",
    location: "TKM College of Engineering, Kollam",
    date: { iso: "2024-11-12", label: "November 12, 2024", year: 2024 },
    description: [
      "A seminar exploring perception, path planning, and feedback control for autonomous aerial vehicles.",
    ],
    gallery: [],
    archived: false,
  },
  {
    slug: "industrial-automation-talk",
    chapterSlug: "tkm-college-of-engineering",
    name: "Industrial Automation Talk",
    image: "/card1.jpeg",
    imageAlt: "An industrial robotic arm operating in a clean laboratory",
    location: "TKM College of Engineering, Kollam",
    description: [
      "A technical conversation about robotic manipulators, production systems, and the engineering decisions behind reliable automation.",
    ],
    gallery: [],
    archived: false,
  },
  {
    slug: "campus-robotics-expo",
    chapterSlug: "model-engineering-college",
    name: "Campus Robotics Expo",
    image: "/card1.jpeg",
    imageAlt: "Student robotics projects displayed across a college courtyard",
    location: "Government Model Engineering College, Kochi",
    date: { iso: "2024-09-21", label: "September 21, 2024", year: 2024 },
    description: [
      "An open showcase where student teams demonstrate mobile robots, embedded systems, and ongoing automation projects.",
    ],
    gallery: [],
    archived: false,
    featured: true,
  },
  {
    slug: "vision-guided-rover-lab",
    chapterSlug: "model-engineering-college",
    name: "Vision-Guided Rover Lab",
    image: "/card1.jpeg",
    imageAlt: "A compact rover navigating a line inside a lab",
    location: "Government Model Engineering College, Kochi",
    date: { iso: "2024-10-04", label: "October 4, 2024", year: 2024 },
    description: [
      "A lab session on visual sensing and motion control for small autonomous ground vehicles.",
    ],
    gallery: [],
    archived: false,
  },
  {
    slug: "robot-operating-systems-bootcamp",
    chapterSlug: "cusat",
    name: "Robot Operating Systems Bootcamp",
    image: "/card1.jpeg",
    imageAlt: "Electronics and a mobile robot being assembled on a workbench",
    location: "CUSAT, Kochi",
    date: { iso: "2024-10-26", label: "October 26, 2024", year: 2024 },
    description: [
      "A beginner-friendly bootcamp introducing robot software structure, sensor topics, and simple motion commands.",
    ],
    gallery: [],
    archived: false,
  },
  {
    slug: "human-robot-interaction-seminar",
    chapterSlug: "gec-barton-hill",
    name: "Human-Robot Interaction Seminar",
    image: "/card1.jpeg",
    imageAlt: "A robotic arm handling a small electronic component",
    location: "Government Engineering College Barton Hill",
    date: { iso: "2024-11-18", label: "November 18, 2024", year: 2024 },
    description: [
      "A seminar on designing robotic systems that communicate clearly, operate safely, and support human decision-making.",
    ],
    gallery: [],
    archived: false,
  },
  {
    slug: "robotics-workshop-2023",
    chapterSlug: "college-of-engineering-trivandrum",
    name: "Robotics Workshop 2023",
    image: "/card1.jpeg",
    imageAlt: "Students taking part in a robotics workshop",
    location: "College of Engineering Trivandrum",
    date: { iso: "2023-08-19", label: "August 19, 2023", year: 2023 },
    description: [
      "A foundational robotics workshop covering electronic prototyping, sensor integration, and practical testing.",
    ],
    gallery: [],
    archived: true,
  },
  {
    slug: "annual-ras-symposium",
    chapterSlug: "college-of-engineering-trivandrum",
    name: "Annual RAS Symposium",
    image: "/card1.jpeg",
    imageAlt: "A technical speaker addressing students in an auditorium",
    location: "College of Engineering Trivandrum",
    date: { iso: "2023-09-23", label: "September 23, 2023", year: 2023 },
    description: [
      "A student-focused symposium featuring talks and discussions across robotics, control, and automation.",
    ],
    gallery: [],
    archived: true,
  },
  {
    slug: "project-exhibition-2023",
    chapterSlug: "model-engineering-college",
    name: "Project Exhibition",
    image: "/card1.jpeg",
    imageAlt: "A robotic hand prototype being adjusted on a lab bench",
    location: "Government Model Engineering College, Kochi",
    date: { iso: "2023-10-07", label: "October 7, 2023", year: 2023 },
    description: [
      "A public display of student-built robotics and embedded-system projects from across the campus community.",
    ],
    gallery: [],
    archived: true,
  },
  {
    slug: "embedded-systems-sprint",
    chapterSlug: "tkm-college-of-engineering",
    name: "Embedded Systems Sprint",
    image: "/card1.jpeg",
    imageAlt: "A compact robot and electronics on a workshop table",
    location: "TKM College of Engineering, Kollam",
    date: { iso: "2022-11-05", label: "November 5, 2022", year: 2022 },
    description: [
      "A compact build sprint centered on microcontrollers, sensors, and dependable hardware integration.",
    ],
    gallery: [],
    archived: true,
  },
  {
    slug: "automation-open-house",
    chapterSlug: "cusat",
    name: "Automation Open House",
    image: "/card1.jpeg",
    imageAlt: "A robotics panel discussion in front of a student audience",
    location: "CUSAT, Kochi",
    date: { iso: "2022-09-17", label: "September 17, 2022", year: 2022 },
    description: [
      "An open program introducing students to automation projects, research directions, and ways to join chapter activities.",
    ],
    gallery: [],
    archived: true,
  },
  {
    slug: "robot-vision-challenge",
    chapterSlug: "gec-barton-hill",
    name: "Robot Vision Challenge",
    image: "/card1.jpeg",
    imageAlt: "Students discussing a complex robot prototype",
    location: "Government Engineering College Barton Hill",
    date: { iso: "2021-12-04", label: "December 4, 2021", year: 2021 },
    description: [
      "A team challenge focused on detecting visual markers and using them to guide a mobile robot through a course.",
    ],
    gallery: [],
    archived: true,
  },
];

export const getChapter = (slug: string) =>
  chapters.find((chapter) => chapter.slug === slug);

export const getEvent = (slug: string) =>
  events.find((event) => event.slug === slug);

export const getChapterEvents = (chapterSlug: string, archived: boolean) =>
  events.filter(
    (event) =>
      event.chapterSlug === chapterSlug && event.archived === archived,
  );

export const getEventChapter = (event: RasEvent) =>
  getChapter(event.chapterSlug);
