// Central business content for Troy Martial Arts — marketing site + portal.
// All facts sourced from troymartialarts.net and the school's public Google reviews.

export const BIZ = {
  name: "Troy Martial Arts",
  legalName: "Troy Martial Arts Inc.",
  founded: 1980,
  yearsOpen: new Date().getFullYear() - 1980,
  address: "1881 South Blvd W, Troy, MI 48098",
  addressNote: "Rite-Aid Plaza · corner of Crooks Rd & South Blvd",
  phone: "(248) 828-4360",
  phoneHref: "tel:+12488284360",
  email: "info@troymartialarts.net",
  // Absolute base for sitemap, canonical URLs and JSON-LD. Override per
  // deploy with NEXT_PUBLIC_SITE_URL when a custom domain is attached.
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://azfermohammed.github.io/troy-martial-arts",
  rating: 4.9,
  // The school states "500+ five-star reviews" on troymartialarts.net.
  reviewCount: "500+",
  studentsTaught: "7,000+",
  instructorCount: "12+",
  combinedExperience: "200+ yrs",
  classesPerWeek: "24+",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Troy+Martial+Arts+1881+South+Blvd+W+Troy+MI+48098",
  hours: "Monday–Sunday, 8:00am – 10:00pm",
  daysPerWeek: "6 days a week",
  serviceArea:
    "On the corner border of five towns — Troy, Rochester Hills, Auburn Hills, Rochester and Bloomfield.",
  tagline: "Try us out for 4 weeks, and see for yourself all these great advantages!",
  motto: "We can make a difference!",
  mission:
    "To teach the highest-quality martial arts classes, empower students with valuable skills for daily life, and contribute to a safe and peaceful community.",
  values: ["Self-Confidence", "Respect", "Courtesy", "Integrity"],
  // The five tenets of Taekwondo, as the school states them.
  tenets: [
    "Courtesy",
    "Integrity",
    "Perseverance",
    "Self-Control",
    "Indomitable Spirit",
  ],
  whyChooseUs: [
    "Certified Kukkiwon Taekwondo school",
    "Spacious, clean and safe facilities",
    "Positive learning environment",
    "Flexible class times",
    "Special events throughout the year",
    "Personal attention for every student",
  ],
  trial: {
    headline: "4-Week Trial",
    price: 29,
    priceLabel: "$29",
    sub: "4 weeks of unlimited classes + a free full uniform",
    perks: [
      "Unlimited classes for 4 full weeks",
      "Free full uniform (dobok) included",
      "Start any day — your 4 weeks begin at your first class",
      "Drop in on any class that fits your week",
    ],
    // Terms as stated by the school on its special-offer page.
    terms: [
      "Your 4 weeks don't start until you take your first class.",
      "Start the same day you register, next month, or next year — there's no expiration on the day you start.",
      "No fixed session dates: classes run continuously, six days a week.",
    ],
  },
} as const;

// ----- Programs -----

export interface Program {
  id: string;
  name: string;
  ages: string;
  image: string;
  classesPerWeek?: string;
  tagline: string;
  blurb: string;
  highlights: string[];
}

// Program copy follows the school's own descriptions on troymartialarts.net.
export const PROGRAMS: Program[] = [
  {
    id: "kids-5-10",
    name: "Kids",
    ages: "Ages 5–10",
    image: "/img/class-1.jpg",
    classesPerWeek: "26 classes per week",
    tagline: "Courtesy, patience, and constructive repetition",
    blurb:
      "A customized curriculum that aligns with their physical abilities, emphasizing courtesy, patience, and the value of constructive repetition.",
    highlights: [
      "26 classes per week to fit around school and family",
      "Four belt-level tracks so every child trains at their level",
      "Unlimited classes — come as often as you like",
    ],
  },
  {
    id: "teens-11-15",
    name: "Kids",
    ages: "Ages 11–15",
    image: "/img/class-2.jpg",
    classesPerWeek: "25 classes per week",
    tagline: "Focus, self-control, respect and self-confidence",
    blurb:
      "Classes that help cultivate valuable skills that can last a lifetime: focus, self-control, respect for self and others, and self-confidence.",
    highlights: [
      "25 classes per week, six days a week",
      "Olympic-style sparring and conditioning",
      "Kukkiwon-certified curriculum and ranking",
    ],
  },
  {
    id: "adults",
    name: "Adults",
    ages: "Ages 16+",
    image: "/img/class-3.jpg",
    classesPerWeek: "24 classes per week",
    tagline: "Self-defense, fitness, and a healthy outlet",
    blurb:
      "For those looking to enhance their self-defense abilities while providing a healthy outlet to let off steam and get in shape.",
    highlights: [
      "24 classes per week — train on your schedule",
      "Beginners and returning black belts both welcome",
      "Train the same evenings as your kids",
    ],
  },
  {
    id: "family",
    name: "Family Classes",
    ages: "Ages 5 & up, together",
    image: "/img/family.jpg",
    classesPerWeek: "24 classes per week",
    tagline: "Flexible scheduling for the whole family",
    blurb:
      "Family classes offer flexible scheduling options, accommodating diverse preferences so the whole family can train together.",
    highlights: [
      "24 classes per week for families",
      "Parents and kids on the mat at the same time",
      "Test and earn belts together",
    ],
  },
  {
    id: "competition",
    name: "Competition Teams",
    ages: "By invitation",
    image: "/img/class-5.jpg",
    tagline: "Olympic-style Taekwondo at the next level",
    blurb:
      "For students ready to compete, our Kukkiwon-certified curriculum and Team USA certified coaching staff prepare athletes for state and national Olympic-style tournaments.",
    highlights: [
      "Coached by multi-time Michigan state champions",
      "Team USA Certified Associate Coaches",
      "Kukkiwon and USAT recognised ranking",
    ],
  },
  {
    id: "summer-camp",
    name: "Summer Camp",
    ages: "Seasonal · Ages 5–15",
    image: "/img/class-4.jpg",
    tagline: "Structured, active days through the summer break",
    blurb:
      "Full days of martial arts, games, and activities during summer break — structured, active, and screen-free.",
    highlights: [
      "Martial arts training every day",
      "Games, activities and special events",
      "Runs through the summer school break",
    ],
  },
];

// ----- Instructors (from the school's staff page) -----

export interface Instructor {
  name: string;
  rank: string;
  role?: string;
  credentials: string[];
}

/**
 * All twelve instructors as listed on troymartialarts.net/staff.
 * Every instructor is a Team USA Certified Associate Coach, a Team USA
 * Certified Safesport Instructor, Red Cross certified in First Aid/AED/CPR/BBP,
 * and has passed a national background check — so those four shared
 * credentials live in SHARED_CREDENTIALS rather than repeating twelve times.
 */
export const SHARED_CREDENTIALS = [
  "Team USA Certified Associate Coach",
  "Team USA Certified Safesport Instructor",
  "Red Cross Certified First Aid, AED/CPR/BBP",
  "National Background Check",
];

export const INSTRUCTORS: Instructor[] = [
  {
    name: "Master Tammy Trudeau",
    rank: "5th Dan Black Belt (Kukkiwon, USAT)",
    role: "Owner",
    credentials: ["Combative Techniques Certified, Troy Police"],
  },
  {
    name: "Master Mark Jeffery",
    rank: "5th Dan Black Belt (Kukkiwon, USAT)",
    credentials: [
      "B.S. & M.S. Electrical Engineering, MIT",
      "Retired Engineer, General Motors",
    ],
  },
  {
    name: "Master Mark Evans",
    rank: "4th Dan Black Belt (Kukkiwon, USAT)",
    credentials: [
      "B.S. Mechanical Engineering, Carnegie Mellon",
      "M.S. Mechanical Engineering, Univ. of Dayton",
      "Senior Engineer, Ford Motor Company",
      "2nd Degree Black Belt, Tang Soo Do",
    ],
  },
  {
    name: "Master David Lalain",
    rank: "4th Dan Black Belt (Kukkiwon, USAT)",
    credentials: [
      "B.S. Chemistry, Michigan State University",
      "Vice President, AIAG",
    ],
  },
  {
    name: "Mariska Goswami",
    rank: "4th Dan Black Belt (Kukkiwon, USAT)",
    credentials: [
      "Student, University of Pittsburgh",
      "2-Time Taekwondo State Champion",
    ],
  },
  {
    name: "Edgar Terrazas Jaquez",
    rank: "3rd Dan Black Belt (Kukkiwon, USAT)",
    credentials: [
      "B.S. Computer Science, Oakland University",
      "2-Time Taekwondo State Champion, Michigan",
    ],
  },
  {
    name: "Coach Sadegh Arab",
    rank: "2nd Dan Black Belt (Kukkiwon, USAT)",
    credentials: [
      "B.S. Neuroscience, University of Michigan",
      "Doctor of Podiatric Medicine, Kent State Univ.",
      "Surgeon, Advanced Foot Ankle and Wound Care",
      "Past President, Univ. of Michigan Taekwondo Club",
    ],
  },
  {
    name: "Kristin Hockman",
    rank: "2nd Dan Black Belt (Kukkiwon, USAT)",
    credentials: [
      "B.S. Biochemistry & M.S. Molecular Biology, University of Michigan",
      "M.Ed. Elementary Teaching, Grand Canyon Univ.",
      "5th Grade Teacher, Hazel Park Schools",
      "2-Time Taekwondo State Champion, Michigan",
    ],
  },
  {
    name: "Raymond El-Khoury",
    rank: "2nd Dan Black Belt (Kukkiwon, USAT)",
    credentials: [
      "B.S. Electrical Engineering, Lawrence Tech",
      "Sales Professional, Aptiv",
    ],
  },
  {
    name: "Nathan Shaeff",
    rank: "2nd Dan Black Belt (Kukkiwon, USAT)",
    credentials: [
      "B.S. Mechanical Engineering, Kettering University",
      "Design & Release Engineer, Ford Motor Co.",
    ],
  },
  {
    name: "Lonnie Adams",
    rank: "1st Dan Black Belt (Kukkiwon, USAT)",
    credentials: [
      "Grievance/Appeals Coordinator, Blue Cross Blue Shield",
      "4-Time Taekwondo State Champion, Michigan",
    ],
  },
  {
    name: "Mark Trudeau",
    rank: "Instructor",
    credentials: [
      "B.S. Mathematics & B.S. Computer Science, Michigan Tech",
      "M.S. Statistics, Michigan State University",
      "Master Six Sigma Black Belt, Motorola University",
      "Retired Quality Director, Eastman Kodak",
      "Certified National Youth Sports Coach (NYSCA)",
    ],
  },
];

// ----- Weekly class schedule -----
// Source: docs/2024-25-weekly-schedule.pdf.
//
// The printed sheet repeats every class four times — once per age band
// (5-10, 11-15, Adult, Family) — even though the same belts share the mat.
// That duplication is what makes the sheet hard to read, so it is collapsed
// here: a class is a single day + time, and it lists the belts welcome in
// it. Per the school, the 11-15 and Adult columns are the accurate ones, so
// this is the union of those two. No class runs longer than 40 minutes.

export type Level = "Beginner" | "Intermediate" | "Advanced" | "Black Belt";
export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
export type ClassFocus = "Sparring" | "Cardio";

// Kept for student records — a child is still "Ages 5–10" even though the
// class they attend is chosen by belt, not age.
export type AgeGroup = "Ages 5–10" | "Ages 11–15" | "Adults" | "Family (5+)";

export const WEEKDAYS: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** The belts that train at each level, exactly as the schedule groups them. */
export const LEVEL_BELTS: Record<Level, string[]> = {
  Beginner: ["White", "Yellow"],
  Intermediate: ["Sr. Yellow", "Green", "Sr. Green"],
  Advanced: ["Blue", "Sr. Blue", "Red"],
  "Black Belt": [
    "Sr. Red",
    "Bodan",
    "Black 1st Dan",
    "Black 2nd Dan",
    "Black 3rd Dan",
  ],
};

export const LEVEL_COLORS: Record<Level, string> = {
  Beginner: "bg-amber-100 text-amber-900 border-amber-300",
  Intermediate: "bg-green-100 text-green-900 border-green-300",
  Advanced: "bg-blue-100 text-blue-900 border-blue-300",
  "Black Belt": "bg-slate-800 text-white border-slate-600",
};

export interface ClassSession {
  id: string;
  day: Weekday;
  /** Minutes past midnight — orders the calendar grid. */
  start: number;
  slot: string;
  /** Levels sharing this class; expand via LEVEL_BELTS for actual belts. */
  levels: Level[];
  focus?: ClassFocus;
}

export const CLASS_SESSIONS: ClassSession[] = [
  // Monday
  { id: "mon-1710", day: "Mon", start: 1030, slot: "5:10–5:50 PM", levels: ["Beginner", "Intermediate"] },
  { id: "mon-1800", day: "Mon", start: 1080, slot: "6:00–6:40 PM", levels: ["Advanced"] },
  { id: "mon-1850", day: "Mon", start: 1130, slot: "6:50–7:30 PM", levels: ["Black Belt"], focus: "Sparring" },
  { id: "mon-1940", day: "Mon", start: 1180, slot: "7:40–8:20 PM", levels: ["Beginner", "Intermediate", "Advanced", "Black Belt"], focus: "Cardio" },

  // Tuesday
  { id: "tue-1630", day: "Tue", start: 990, slot: "4:30–5:00 PM", levels: ["Intermediate"] },
  { id: "tue-1710", day: "Tue", start: 1030, slot: "5:10–5:50 PM", levels: ["Beginner"] },
  { id: "tue-1800", day: "Tue", start: 1080, slot: "6:00–6:40 PM", levels: ["Black Belt"], focus: "Sparring" },
  { id: "tue-1850", day: "Tue", start: 1130, slot: "6:50–7:30 PM", levels: ["Black Belt"] },
  { id: "tue-1940", day: "Tue", start: 1180, slot: "7:40–8:20 PM", levels: ["Beginner", "Intermediate", "Advanced"] },

  // Wednesday
  // Confirmed by the school. Appears in the 5-10 column of the printed sheet
  // rather than 11-15/Adult, so it was missed when those two were merged.
  { id: "wed-1630", day: "Wed", start: 990, slot: "4:30–5:00 PM", levels: ["Beginner"] },
  { id: "wed-1710", day: "Wed", start: 1030, slot: "5:10–5:50 PM", levels: ["Advanced"] },
  { id: "wed-1800", day: "Wed", start: 1080, slot: "6:00–6:40 PM", levels: ["Beginner", "Intermediate", "Advanced"], focus: "Sparring" },
  { id: "wed-1850", day: "Wed", start: 1130, slot: "6:50–7:30 PM", levels: ["Beginner", "Intermediate"] },
  { id: "wed-1940", day: "Wed", start: 1180, slot: "7:40–8:20 PM", levels: ["Black Belt"] },

  // Thursday
  { id: "thu-1630", day: "Thu", start: 990, slot: "4:30–5:00 PM", levels: ["Intermediate"] },
  { id: "thu-1710", day: "Thu", start: 1030, slot: "5:10–5:50 PM", levels: ["Advanced", "Black Belt"] },
  { id: "thu-1800", day: "Thu", start: 1080, slot: "6:00–6:40 PM", levels: ["Beginner"] },
  { id: "thu-1850", day: "Thu", start: 1130, slot: "6:50–7:30 PM", levels: ["Beginner", "Intermediate", "Advanced"], focus: "Sparring" },
  { id: "thu-1940", day: "Thu", start: 1180, slot: "7:40–8:20 PM", levels: ["Beginner", "Intermediate", "Advanced", "Black Belt"] },

  // Friday
  { id: "fri-1630", day: "Fri", start: 990, slot: "4:30–5:00 PM", levels: ["Advanced", "Black Belt"] },
  { id: "fri-1710", day: "Fri", start: 1030, slot: "5:10–5:50 PM", levels: ["Beginner"] },
  { id: "fri-1800", day: "Fri", start: 1080, slot: "6:00–6:40 PM", levels: ["Intermediate"] },

  // Saturday
  { id: "sat-0900", day: "Sat", start: 540, slot: "9:00–9:40 AM", levels: ["Advanced", "Black Belt"] },
  { id: "sat-0950", day: "Sat", start: 590, slot: "9:50–10:30 AM", levels: ["Beginner"] },
  { id: "sat-1040", day: "Sat", start: 640, slot: "10:40–11:20 AM", levels: ["Intermediate"] },
];

/** Every distinct time slot, ordered — the calendar's row axis. */
export const TIME_SLOTS: { start: number; slot: string }[] = Array.from(
  new Map(CLASS_SESSIONS.map((s) => [s.start, { start: s.start, slot: s.slot }])).values()
).sort((a, b) => a.start - b.start);

/** Which level a belt trains at. */
export function beltToLevel(belt: string): Level {
  for (const [level, belts] of Object.entries(LEVEL_BELTS) as [Level, string[]][]) {
    if (belts.includes(belt)) return level;
  }
  return "Beginner";
}

/** The actual belt names welcome in a class. */
export function beltsInSession(session: ClassSession): string[] {
  return session.levels.flatMap((l) => LEVEL_BELTS[l]);
}

/** Every class a given belt can attend. */
export function sessionsForBelt(belt: string): ClassSession[] {
  const level = beltToLevel(belt);
  return CLASS_SESSIONS.filter((s) => s.levels.includes(level));
}

/** Short label for a class, e.g. "Beginner & Intermediate" or "All belts". */
export function sessionLabel(session: ClassSession): string {
  if (session.levels.length === 4) return "All belts";
  return session.levels.join(" & ");
}

export const AGE_GROUPS: AgeGroup[] = [
  "Ages 5–10",
  "Ages 11–15",
  "Adults",
  "Family (5+)",
];

// ----- Belt journey -----

export const BELT_RANKS = [
  { name: "White", color: "#f8fafc", text: "#101f38" },
  { name: "Yellow", color: "#fcd34d", text: "#7c5800" },
  { name: "Sr. Yellow", color: "#fbbf24", text: "#7c5800" },
  { name: "Green", color: "#4ade80", text: "#14532d" },
  { name: "Sr. Green", color: "#22c55e", text: "#ffffff" },
  { name: "Blue", color: "#60a5fa", text: "#1e3a8a" },
  { name: "Sr. Blue", color: "#3b82f6", text: "#ffffff" },
  { name: "Red", color: "#f87171", text: "#7f1d1d" },
  { name: "Sr. Red", color: "#ef4444", text: "#ffffff" },
  { name: "Bodan", color: "#b91c1c", text: "#ffffff" },
  { name: "Black Belt", color: "#101f38", text: "#ffffff" },
] as const;

// ----- Curated Google reviews (public, verbatim where possible, lightly trimmed) -----

export interface Review {
  name: string;
  context: string;
  text: string;
}

export const REVIEWS: Review[] = [
  {
    name: "Google Reviewer",
    context: "Parent of 3 boys",
    text: "Have 3 boys that love it here. It's so easy to get classes — they offer them daily on a drop-in basis. So fun and everyone is so nice! My kids have never slept better since starting.",
  },
  {
    name: "Marcy Quail",
    context: "Parent of a 5-year-old",
    text: "My 5-year-old has only been at it for about a month and we have already seen significant improvement in her strength, ability, and confidence! The many options for classes makes it extremely convenient.",
  },
  {
    name: "Carlos A. Pavón",
    context: "Adult student",
    text: "As an adult returning to Taekwondo after 20 years, I'm really enjoying my experience. The environment is friendly and welcoming, making it easy to get back into training. The unlimited classes are a great feature.",
  },
  {
    name: "Shashi Reddy",
    context: "Parent",
    text: "The progress we've seen in our little one is truly impressive. Not only has his physical strength and coordination improved, but his confidence and discipline have grown significantly as well.",
  },
  {
    name: "Tiffany Mack",
    context: "Parent",
    text: "Master Trudeau is an amazing teacher. It is incredibly obvious she loves teaching. Her enthusiasm is contagious and my son always leaves class happy & exhausted.",
  },
  {
    name: "Margie Patel",
    context: "Parent",
    text: "My son loves this place! Unlike other places, Troy Martial Arts is actually Olympic-based curriculum. The classes are very structured, disciplined and fun at the same time.",
  },
  {
    name: "Elizabeth Smith",
    context: "First-class parent",
    text: "Our daughter had her first class this evening and had a blast. Master Trudeau got down on her level to help her through her first class and she left with a great sense of accomplishment and confidence.",
  },
  {
    name: "Patrick Smith",
    context: "Black belt parent",
    text: "My son earned his Black Belt at Troy Martial Arts, and I earned a wonderful friendship along the way. Family oriented, safe and professionally run. A great experience we truly value.",
  },
  {
    name: "Andrea Manns",
    context: "Parent",
    text: "Troy Martial Arts is a top tier experience. Master Trudeau is an excellent instructor who takes this art form seriously — students learn discipline, courtesy, integrity, self-control, and perseverance.",
  },
  {
    name: "Arturo Hernandez",
    context: "Family student",
    text: "Amazing place for my family to exercise and learn self defense. Master Trudeau is always positive, with discipline, and encourages my kids and wife to keep working mind and body.",
  },
  {
    name: "Rakesh Raipure",
    context: "Parent of 2",
    text: "I have enrolled both kids here. Amazing staff, and they have a flexible schedule so you can attend classes at your convenience. I would surely recommend this place for martial arts training.",
  },
  {
    name: "Xing Liu",
    context: "Parent of 2",
    text: "Both my son and daughter have a great experience practicing Taekwondo here. The coaches are great. My kids had a lot of fun — plus the annual picnic was awesome!",
  },
];

// ----- FAQ (answers as given on troymartialarts.net/faq) -----

export interface Faq {
  q: string;
  a: string;
  /** Grouping for the page, not from the source site. */
  topic: "Classes" | "Belts & testing" | "Sparring" | "Events" | "Parents";
}

export const FAQS: Faq[] = [
  {
    topic: "Classes",
    q: "How many classes can we take weekly?",
    a: "Students can take an unlimited number of classes weekly, and there are classes every day except Sunday. We recommend only taking 2 regular classes per week — 99% of the school does 2 classes per week.",
  },
  {
    topic: "Belts & testing",
    q: "How often do we have belt promotions?",
    a: "Color belt promotions are once per month, usually the second Saturday of the month. The 10-step advancement process is in the General Rules on the back of the hardcopy schedule and in the Troy Martial Arts app.",
  },
  {
    topic: "Belts & testing",
    q: "If we register for the belt promotion and miss it, what happens?",
    a: "Students who miss the promotion can either receive their new belt in their next class, or wait until the following month to attend the promotion.",
  },
  {
    topic: "Sparring",
    q: "How does sparring class work?",
    a: "Students can start sparring any time they choose, though most start after earning their Yellow or Sr. Yellow belt. It is not mandatory until Black Belt classes. Students may attend one sparring class per week, and need certified equipment — $189 for female students, $199 for male students.",
  },
  {
    topic: "Events",
    q: "How do the tournaments work?",
    a: "We host two tournaments a year, usually in March and September, for Troy Martial Arts students only. They run across two Saturdays split by age group, with Poomsae (forms) and sparring. Every student receives either a 1st or 2nd place trophy for the Poomsae competition. Registration is $75, with family discounts available. We also compete at the Michigan State Championships and national tournaments.",
  },
  {
    topic: "Parents",
    q: "Can I watch class from home?",
    a: "Yes — three cameras run during classes so parents can watch remotely. Instructions for setting up the WYZE cameras on your phone are posted in the office.",
  },
];

// ----- School history (from troymartialarts.net/history) -----

export const HISTORY: { year: string; title: string; body: string }[] = [
  {
    year: "1980",
    title: "Kil's Martial Arts opens",
    body: "A martial arts revolution unfolded in Troy, Michigan with the establishment of Kil's Martial Arts by the Kil family, a dedicated family of Taekwondo practitioners.",
  },
  {
    year: "2003",
    title: "Master Tammy Trudeau takes over",
    body: "The school was purchased by Master Tammy Trudeau and renamed Troy Martial Arts. She brought extensive Taekwondo training and sought to share its benefits with her community.",
  },
  {
    year: "Today",
    title: "The largest single school in Michigan",
    body: "Now the largest single school in Michigan, both in square feet and in students. The main Taekwondo curriculum has grown into a full self-defense curriculum drawing on Karate, Kung Fu, Krav Maga, Judo and Jiu Jitsu.",
  },
];

export const NAV_LINKS = [
  { href: "/programs", label: "Programs" },
  { href: "/schedule", label: "Schedule" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;
