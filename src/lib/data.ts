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
  rating: 4.9,
  reviewCount: 648,
  studentsTaught: "7,000+",
  instructorCount: "12+",
  combinedExperience: "200+ yrs",
  classesPerWeek: "24+",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Troy+Martial+Arts+1881+South+Blvd+W+Troy+MI+48098",
  mission:
    "To teach the highest-quality martial arts classes, empower students with valuable skills for daily life, and contribute to a safe and peaceful community.",
  values: ["Self-Confidence", "Respect", "Courtesy", "Integrity"],
  trial: {
    headline: "4-Week Trial",
    sub: "Unlimited classes + free full uniform",
    perks: [
      "Unlimited classes for 4 full weeks",
      "Free full uniform (dobok) included",
      "No long-term commitment to start",
      "Drop in on any class that fits your week",
    ],
  },
} as const;

// ----- Programs -----

export interface Program {
  id: string;
  name: string;
  ages: string;
  emoji: string;
  tagline: string;
  blurb: string;
  highlights: string[];
}

export const PROGRAMS: Program[] = [
  {
    id: "kids-5-10",
    name: "Little Champions",
    ages: "Ages 5–10",
    emoji: "🥋",
    tagline: "Confidence & focus that carries into school",
    blurb:
      "High-energy classes that channel your child's energy into focus, discipline, and self-confidence. Parents tell us their kids listen better, sleep better, and stand taller within weeks.",
    highlights: [
      "4 belt-level class tracks so every child is challenged at their level",
      "Discipline & respect built into every class",
      "Fun, fast-paced drills — kids leave happy and exhausted",
    ],
  },
  {
    id: "teens-11-15",
    name: "Tweens & Teens",
    ages: "Ages 11–15",
    emoji: "⚡",
    tagline: "Strength, self-defense & real friendships",
    blurb:
      "Serious skill-building for a serious age. Teens develop practical self-defense, athletic conditioning, and the quiet confidence that comes from earning every belt.",
    highlights: [
      "Olympic-style sparring and cardio-focused sessions",
      "Leadership pathways — top students assist younger classes",
      "A positive peer group that keeps them coming back",
    ],
  },
  {
    id: "adults",
    name: "Adults",
    ages: "Ages 16+",
    emoji: "💪",
    tagline: "The workout you'll actually stick with",
    blurb:
      "Whether you're brand new, returning after 20 years, or chasing your black belt — adult classes deliver a full-body workout with a skill you keep forever. Unlimited classes, flexible times.",
    highlights: [
      "Beginner-friendly — many adults start with zero experience",
      "Stress relief, flexibility, and real self-defense",
      "Train the same nights as your kids",
    ],
  },
  {
    id: "family",
    name: "Family Classes",
    ages: "Ages 5 & up, together",
    emoji: "👨‍👩‍👧‍👦",
    tagline: "One schedule. One goal. Together.",
    blurb:
      "Train side-by-side with your kids in dedicated family classes. It's quality time, shared goals, and the only activity where the whole family earns belts together.",
    highlights: [
      "Parents and kids on the mat at the same time",
      "Shared milestones — test for belts as a family",
      "The most popular way our families train",
    ],
  },
  {
    id: "competition",
    name: "Competition Team",
    ages: "By invitation",
    emoji: "🏆",
    tagline: "Olympic-style Taekwondo at the next level",
    blurb:
      "For students ready to compete, our Kukkiwon-certified curriculum and coaching staff prepare athletes for regional and national Olympic-style tournaments.",
    highlights: [
      "Kukkiwon-certified, Olympic-based curriculum",
      "Tournament coaching and sparring strategy",
      "Team culture that celebrates every athlete",
    ],
  },
  {
    id: "summer-camp",
    name: "Summer Camp",
    ages: "Seasonal · Ages 5–15",
    emoji: "☀️",
    tagline: "The camp kids beg to come back to",
    blurb:
      "Full days of martial arts, games, and activities during summer break. A parent favorite — structured, active, and screen-free.",
    highlights: [
      "Martial arts training every day",
      "Games, activities & our famous annual picnic",
      "Trusted by Troy families for years",
    ],
  },
];

// ----- Weekly schedule (2024–25 official grid) -----

export type AgeGroup = "Ages 5–10" | "Ages 11–15" | "Adults" | "Family (5+)";
export type Level = "Beginner" | "Intermediate" | "Advanced" | "Black Belt";

export interface ScheduleBlock {
  days: string[]; // e.g. ["Mon", "Wed"]
  slot: string; // display, e.g. "4:30–5:00 PM"
  note?: "Sparring" | "Cardio";
}

export interface LevelSchedule {
  id: string;
  group: AgeGroup;
  level: Level;
  belts: string;
  blocks: ScheduleBlock[];
}

export const LEVEL_COLORS: Record<Level, string> = {
  Beginner: "bg-amber-100 text-amber-900 border-amber-300",
  Intermediate: "bg-green-100 text-green-900 border-green-300",
  Advanced: "bg-blue-100 text-blue-900 border-blue-300",
  "Black Belt": "bg-slate-800 text-white border-slate-600",
};

export const SCHEDULE: LevelSchedule[] = [
  // Ages 5–10
  {
    id: "c1",
    group: "Ages 5–10",
    level: "Beginner",
    belts: "White & Yellow belts",
    blocks: [
      { days: ["Mon", "Wed"], slot: "4:30–5:00 PM" },
      { days: ["Tue", "Thu"], slot: "5:10–5:50 PM" },
      { days: ["Sat"], slot: "9:50–10:30 AM" },
    ],
  },
  {
    id: "c2",
    group: "Ages 5–10",
    level: "Intermediate",
    belts: "Sr. Yellow, Green & Sr. Green",
    blocks: [
      { days: ["Mon", "Wed"], slot: "5:10–5:50 PM" },
      { days: ["Tue", "Thu"], slot: "4:30–5:00 PM" },
      { days: ["Sat"], slot: "10:40–11:20 AM" },
    ],
  },
  {
    id: "c3",
    group: "Ages 5–10",
    level: "Advanced",
    belts: "Blue, Sr. Blue & Red",
    blocks: [
      { days: ["Mon", "Wed"], slot: "6:00–6:40 PM" },
      { days: ["Tue", "Thu"], slot: "7:40–8:20 PM" },
      { days: ["Fri"], slot: "5:10–5:50 PM" },
      { days: ["Sat"], slot: "9:00–9:40 AM" },
    ],
  },
  {
    id: "c4",
    group: "Ages 5–10",
    level: "Black Belt",
    belts: "Sr. Red, Bodan & Black Belt",
    blocks: [
      { days: ["Mon", "Wed"], slot: "6:50–7:30 PM", note: "Sparring" },
      { days: ["Tue", "Thu"], slot: "6:50–7:30 PM" },
      { days: ["Fri"], slot: "6:00–6:40 PM", note: "Sparring" },
      { days: ["Sat"], slot: "9:00–9:40 AM" },
    ],
  },
  // Ages 11–15
  {
    id: "c5",
    group: "Ages 11–15",
    level: "Beginner",
    belts: "White & Yellow belts",
    blocks: [
      { days: ["Mon", "Wed"], slot: "6:00–6:40 PM", note: "Sparring" },
      { days: ["Tue", "Thu"], slot: "5:10–5:50 PM" },
      { days: ["Fri"], slot: "6:00–6:40 PM", note: "Sparring" },
      { days: ["Sat"], slot: "9:50–10:30 AM" },
    ],
  },
  {
    id: "c6",
    group: "Ages 11–15",
    level: "Intermediate",
    belts: "Sr. Yellow, Green & Sr. Green",
    blocks: [
      { days: ["Mon", "Wed"], slot: "7:40–8:20 PM", note: "Cardio" },
      { days: ["Tue", "Thu"], slot: "4:30–5:00 PM" },
      { days: ["Fri"], slot: "6:50–7:30 PM", note: "Sparring" },
      { days: ["Sat"], slot: "10:40–11:20 AM" },
    ],
  },
  {
    id: "c7",
    group: "Ages 11–15",
    level: "Advanced",
    belts: "Blue, Sr. Blue & Red",
    blocks: [
      { days: ["Mon", "Wed"], slot: "6:00–6:40 PM" },
      { days: ["Tue", "Thu"], slot: "7:40–8:20 PM" },
      { days: ["Fri"], slot: "5:10–5:50 PM" },
      { days: ["Sat"], slot: "9:00–9:40 AM" },
    ],
  },
  {
    id: "c8",
    group: "Ages 11–15",
    level: "Black Belt",
    belts: "Sr. Red, Bodan & Black Belt",
    blocks: [
      { days: ["Mon", "Wed"], slot: "6:50–7:30 PM", note: "Sparring" },
      { days: ["Tue", "Thu"], slot: "6:50–7:30 PM" },
      { days: ["Fri"], slot: "6:00–6:40 PM", note: "Sparring" },
      { days: ["Sat"], slot: "9:00–9:40 AM" },
    ],
  },
  // Adults
  {
    id: "c9",
    group: "Adults",
    level: "Beginner",
    belts: "White & Yellow belts",
    blocks: [
      { days: ["Mon", "Tue", "Wed", "Thu"], slot: "5:10–5:50 PM" },
      { days: ["Fri"], slot: "6:00–6:40 PM", note: "Sparring" },
      { days: ["Sat"], slot: "9:50–10:30 AM" },
    ],
  },
  {
    id: "c10",
    group: "Adults",
    level: "Intermediate",
    belts: "Sr. Yellow, Green & Sr. Green",
    blocks: [
      { days: ["Mon", "Tue", "Wed", "Thu"], slot: "6:00–6:40 PM" },
      { days: ["Fri"], slot: "6:50–7:30 PM", note: "Sparring" },
      { days: ["Sat"], slot: "10:40–11:20 AM" },
    ],
  },
  {
    id: "c11",
    group: "Adults",
    level: "Advanced",
    belts: "Blue, Sr. Blue & Red",
    blocks: [
      { days: ["Mon", "Wed"], slot: "7:40–8:20 PM", note: "Cardio" },
      { days: ["Tue", "Thu"], slot: "7:40–8:20 PM" },
      { days: ["Fri"], slot: "5:10–5:50 PM" },
      { days: ["Sat"], slot: "9:00–9:40 AM" },
    ],
  },
  {
    id: "c12",
    group: "Adults",
    level: "Black Belt",
    belts: "Sr. Red, Bodan & Black Belt",
    blocks: [
      { days: ["Mon", "Wed"], slot: "6:50–7:30 PM", note: "Sparring" },
      { days: ["Tue", "Thu"], slot: "6:50–7:30 PM" },
      { days: ["Fri"], slot: "6:00–6:40 PM", note: "Sparring" },
      { days: ["Sat"], slot: "9:00–9:40 AM" },
    ],
  },
  // Family (5+)
  {
    id: "c13",
    group: "Family (5+)",
    level: "Beginner",
    belts: "White & Yellow belts",
    blocks: [
      { days: ["Mon", "Wed"], slot: "5:10–5:50 PM" },
      { days: ["Tue", "Thu"], slot: "4:30–5:00 PM" },
      { days: ["Fri"], slot: "6:00–6:40 PM", note: "Sparring" },
      { days: ["Sat"], slot: "9:50–10:30 AM" },
    ],
  },
  {
    id: "c14",
    group: "Family (5+)",
    level: "Intermediate",
    belts: "Sr. Yellow, Green & Sr. Green",
    blocks: [
      { days: ["Mon", "Wed"], slot: "6:00–6:40 PM" },
      { days: ["Tue", "Thu"], slot: "5:10–5:50 PM" },
      { days: ["Fri"], slot: "6:50–7:30 PM", note: "Sparring" },
      { days: ["Sat"], slot: "10:40–11:20 AM" },
    ],
  },
  {
    id: "c15",
    group: "Family (5+)",
    level: "Advanced",
    belts: "Blue, Sr. Blue & Red",
    blocks: [
      { days: ["Mon", "Wed"], slot: "6:00–6:40 PM" },
      { days: ["Tue", "Thu"], slot: "7:40–8:20 PM" },
      { days: ["Fri"], slot: "5:10–5:50 PM" },
      { days: ["Sat"], slot: "9:00–9:40 AM" },
    ],
  },
  {
    id: "c16",
    group: "Family (5+)",
    level: "Black Belt",
    belts: "Sr. Red, Bodan & Black Belt",
    blocks: [
      { days: ["Mon", "Wed"], slot: "7:40–8:20 PM", note: "Cardio" },
      { days: ["Tue", "Thu"], slot: "6:50–7:30 PM" },
      { days: ["Fri"], slot: "6:00–6:40 PM", note: "Sparring" },
      { days: ["Sat"], slot: "9:00–9:40 AM" },
    ],
  },
];

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

export const NAV_LINKS = [
  { href: "/programs", label: "Programs" },
  { href: "/schedule", label: "Schedule" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
