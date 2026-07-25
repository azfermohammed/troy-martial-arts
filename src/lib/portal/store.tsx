"use client";

// Demo-mode data layer for the Troy Martial Arts staff portal.
// Persists to localStorage so the demo feels real across refreshes.
// Swap the persistence layer for a real backend (e.g. Supabase) without
// touching the page components — they only talk to usePortal().

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { AgeGroup } from "@/lib/data";

// ----- Roles & permissions -----

export type Role = "student" | "assistant" | "instructor" | "master" | "admin";

export interface PortalUser {
  id: string;
  name: string;
  role: Role;
  title: string;
  isHeadMaster?: boolean; // only meaningful for role "master"
  studentId?: string; // links student/assistant accounts to a Student record
}

/** Staff roles that appear on the schedule as class leads. */
export const LEAD_ROLES: Role[] = ["instructor", "master"];
/** Roles that can pick classes they help with. */
export const HELPER_ROLES: Role[] = ["assistant", "instructor", "master"];
/** Roles that can use messaging (assistants/instructors ↔ masters). */
export const MESSAGING_ROLES: Role[] = ["assistant", "instructor", "master"];

export function canMessage(from: Role, to: Role): boolean {
  if (from === "assistant" || from === "instructor") return to === "master";
  if (from === "master") return to === "assistant" || to === "instructor";
  return false;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  belt: string;
  group: AgeGroup;
  phone: string;
  email: string;
  joinDate: string; // YYYY-MM-DD
  status: "Active" | "Inactive";
  isAssistant?: boolean;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  description: string;
  dueDate: string; // YYYY-MM-DD
  status: "Paid" | "Pending" | "Overdue";
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classLabel: string;
  date: string; // YYYY-MM-DD
  present: boolean;
}

export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  text: string;
  ts: string; // ISO datetime
}

/** Per-class staffing: leads assigned by the head master; helpers self-selected. */
export interface ClassStaffing {
  leads: string[]; // PortalUser ids (instructors/masters)
  helpers: string[]; // PortalUser ids (assistants/instructors/masters)
}

export interface PortalData {
  students: Student[];
  payments: Payment[];
  attendance: AttendanceRecord[];
  messages: Message[];
  staffing: Record<string, ClassStaffing>; // key: class id from lib/data SCHEDULE
}

export const PORTAL_BELTS = [
  "White",
  "Yellow",
  "Sr. Yellow",
  "Green",
  "Sr. Green",
  "Blue",
  "Sr. Blue",
  "Red",
  "Sr. Red",
  "Bodan",
  "Black 1st Dan",
  "Black 2nd Dan",
  "Black 3rd Dan",
] as const;

// ----- Demo accounts (one per role, plus a second master to demo assignment) -----

export const DEMO_USERS: PortalUser[] = [
  { id: "u-trudeau", name: "Master Trudeau", role: "master", isHeadMaster: true, title: "Head Master · Owner" },
  { id: "u-park", name: "Master Park", role: "master", title: "Master" },
  { id: "u-kim", name: "Instructor Kim", role: "instructor", title: "Instructor" },
  { id: "u-emma", name: "Emma Wilson", role: "assistant", title: "Assistant · Sr. Green", studentId: "s3" },
  { id: "u-sarah", name: "Sarah Johnson", role: "student", title: "Student · Blue Belt", studentId: "s1" },
  { id: "u-desk", name: "Front Desk", role: "admin", title: "Admin · Front Desk" },
];

export function userById(id: string): PortalUser | undefined {
  return DEMO_USERS.find((u) => u.id === id);
}

// ----- Seed data (synthetic demo records) -----

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);
const daysAhead = (n: number) =>
  new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
const hoursAgoISO = (n: number) =>
  new Date(Date.now() - n * 3_600_000).toISOString();

const SEED: PortalData = {
  students: [
    { id: "s1", name: "Sarah Johnson", age: 12, belt: "Blue", group: "Ages 11–15", phone: "(555) 123-4567", email: "sarah.j@email.com", joinDate: "2023-01-15", status: "Active" },
    { id: "s2", name: "Mike Chen", age: 8, belt: "White", group: "Ages 5–10", phone: "(555) 234-5678", email: "mike.chen@email.com", joinDate: daysAgo(40), status: "Active" },
    { id: "s3", name: "Emma Wilson", age: 15, belt: "Sr. Green", group: "Ages 11–15", phone: "(555) 345-6789", email: "emma.w@email.com", joinDate: "2023-06-10", status: "Active", isAssistant: true },
    { id: "s4", name: "James Rodriguez", age: 34, belt: "Black 1st Dan", group: "Adults", phone: "(555) 456-7890", email: "james.r@email.com", joinDate: "2020-03-05", status: "Active" },
    { id: "s5", name: "Lisa Anderson", age: 29, belt: "Sr. Blue", group: "Adults", phone: "(555) 567-8901", email: "lisa.a@email.com", joinDate: "2022-09-12", status: "Active" },
    { id: "s6", name: "David Kim", age: 9, belt: "Yellow", group: "Ages 5–10", phone: "(555) 678-9012", email: "david.k@email.com", joinDate: "2024-08-03", status: "Active" },
    { id: "s7", name: "Rachel Martinez", age: 11, belt: "Sr. Yellow", group: "Ages 11–15", phone: "(555) 789-0123", email: "rachel.m@email.com", joinDate: "2024-05-18", status: "Active" },
    { id: "s8", name: "Tom Bradley", age: 41, belt: "Red", group: "Adults", phone: "(555) 890-1234", email: "tom.b@email.com", joinDate: "2021-11-22", status: "Active" },
    { id: "s9", name: "Priya Patel", age: 7, belt: "Green", group: "Ages 5–10", phone: "(555) 901-2345", email: "priya.p@email.com", joinDate: "2024-02-14", status: "Active" },
    { id: "s10", name: "Noah Williams", age: 6, belt: "White", group: "Ages 5–10", phone: "(555) 012-3456", email: "noah.w@email.com", joinDate: daysAgo(12), status: "Active" },
    { id: "s11", name: "Grace Liu", age: 13, belt: "Red", group: "Ages 11–15", phone: "(555) 135-2468", email: "grace.l@email.com", joinDate: "2022-04-30", status: "Active" },
    { id: "s12", name: "Arturo Hernandez", age: 38, belt: "Yellow", group: "Family (5+)", phone: "(555) 246-1357", email: "arturo.h@email.com", joinDate: "2025-01-20", status: "Active" },
    { id: "s13", name: "Sofia Hernandez", age: 10, belt: "Yellow", group: "Family (5+)", phone: "(555) 246-1357", email: "arturo.h@email.com", joinDate: "2025-01-20", status: "Active" },
    { id: "s14", name: "Ken Nakamura", age: 52, belt: "Bodan", group: "Adults", phone: "(555) 369-2580", email: "ken.n@email.com", joinDate: "2019-10-08", status: "Inactive", isAssistant: true },
  ],
  payments: [
    { id: "p1", studentId: "s1", amount: 150, description: "July Tuition", dueDate: daysAgo(9), status: "Paid" },
    { id: "p2", studentId: "s2", amount: 150, description: "July Tuition", dueDate: daysAgo(9), status: "Paid" },
    { id: "p3", studentId: "s3", amount: 150, description: "July Tuition", dueDate: daysAgo(9), status: "Paid" },
    { id: "p4", studentId: "s4", amount: 160, description: "July Tuition", dueDate: daysAgo(9), status: "Paid" },
    { id: "p5", studentId: "s5", amount: 160, description: "July Tuition", dueDate: daysAgo(9), status: "Pending" },
    { id: "p6", studentId: "s6", amount: 150, description: "July Tuition", dueDate: daysAgo(9), status: "Paid" },
    { id: "p7", studentId: "s7", amount: 150, description: "July Tuition", dueDate: daysAgo(21), status: "Overdue" },
    { id: "p8", studentId: "s8", amount: 160, description: "July Tuition", dueDate: daysAgo(9), status: "Paid" },
    { id: "p9", studentId: "s9", amount: 150, description: "July Tuition", dueDate: daysAgo(9), status: "Paid" },
    { id: "p10", studentId: "s10", amount: 99, description: "Trial Enrollment", dueDate: daysAgo(12), status: "Paid" },
    { id: "p11", studentId: "s11", amount: 150, description: "July Tuition", dueDate: daysAgo(30), status: "Overdue" },
    { id: "p12", studentId: "s12", amount: 250, description: "July Family Tuition", dueDate: daysAgo(9), status: "Paid" },
    { id: "p13", studentId: "s1", amount: 65, description: "Sparring Gear", dueDate: daysAhead(5), status: "Pending" },
    { id: "p14", studentId: "s4", amount: 85, description: "Tournament Registration", dueDate: daysAhead(10), status: "Pending" },
  ],
  attendance: [
    { id: "a1", studentId: "s1", classLabel: "Advanced · Ages 11–15", date: daysAgo(1), present: true },
    { id: "a2", studentId: "s11", classLabel: "Advanced · Ages 11–15", date: daysAgo(1), present: true },
    { id: "a3", studentId: "s7", classLabel: "Intermediate · Ages 11–15", date: daysAgo(1), present: false },
    { id: "a4", studentId: "s2", classLabel: "Beginner · Ages 5–10", date: daysAgo(1), present: true },
    { id: "a5", studentId: "s10", classLabel: "Beginner · Ages 5–10", date: daysAgo(1), present: true },
    { id: "a6", studentId: "s6", classLabel: "Beginner · Ages 5–10", date: daysAgo(2), present: true },
    { id: "a7", studentId: "s9", classLabel: "Intermediate · Ages 5–10", date: daysAgo(2), present: true },
    { id: "a8", studentId: "s4", classLabel: "Black Belt · Adults", date: daysAgo(2), present: true },
    { id: "a9", studentId: "s8", classLabel: "Advanced · Adults", date: daysAgo(3), present: true },
    { id: "a10", studentId: "s5", classLabel: "Advanced · Adults", date: daysAgo(3), present: false },
    { id: "a11", studentId: "s12", classLabel: "Beginner · Family (5+)", date: daysAgo(4), present: true },
    { id: "a12", studentId: "s13", classLabel: "Beginner · Family (5+)", date: daysAgo(4), present: true },
    { id: "a13", studentId: "s3", classLabel: "Intermediate · Ages 11–15", date: daysAgo(5), present: true },
    { id: "a14", studentId: "s1", classLabel: "Advanced · Ages 11–15", date: daysAgo(6), present: true },
  ],
  messages: [
    { id: "m1", fromId: "u-emma", fromName: "Emma Wilson", toId: "u-trudeau", toName: "Master Trudeau", text: "Master Trudeau, can I assist the Saturday beginner class this week?", ts: hoursAgoISO(26) },
    { id: "m2", fromId: "u-trudeau", fromName: "Master Trudeau", toId: "u-emma", toName: "Emma Wilson", text: "Absolutely — see you at 9:50 AM. Bring your sparring gear for the demo.", ts: hoursAgoISO(24) },
    { id: "m3", fromId: "u-kim", fromName: "Instructor Kim", toId: "u-trudeau", toName: "Master Trudeau", text: "The 11–15 intermediate group is ready for testing prep. Can we schedule belt testing for early August?", ts: hoursAgoISO(5) },
    { id: "m4", fromId: "u-kim", fromName: "Instructor Kim", toId: "u-park", toName: "Master Park", text: "Master Park, could you cover my Tuesday adult beginner class next week?", ts: hoursAgoISO(3) },
  ],
  staffing: {
    c1: { leads: ["u-kim"], helpers: ["u-emma"] },
    c2: { leads: ["u-kim"], helpers: [] },
    c3: { leads: ["u-park"], helpers: [] },
    c4: { leads: ["u-trudeau"], helpers: [] },
    c7: { leads: ["u-park"], helpers: ["u-emma"] },
    c9: { leads: ["u-trudeau"], helpers: [] },
    c10: { leads: ["u-kim"], helpers: [] },
    c12: { leads: ["u-trudeau"], helpers: [] },
  },
};

// ----- Context -----

const DATA_KEY = "tma-portal-v2";
const AUTH_KEY = "tma-portal-user-v2";

interface PortalCtx {
  ready: boolean;
  user: PortalUser | null;
  data: PortalData;
  login: (u: PortalUser) => void;
  logout: () => void;
  resetDemo: () => void;
  addStudent: (s: Omit<Student, "id">) => void;
  updateStudent: (id: string, patch: Partial<Omit<Student, "id">>) => void;
  deleteStudent: (id: string) => void;
  addPayment: (p: Omit<Payment, "id">) => void;
  markPaid: (id: string) => void;
  recordAttendance: (records: Omit<AttendanceRecord, "id">[]) => void;
  sendMessage: (toId: string, text: string) => void;
  setClassLeads: (classId: string, leadIds: string[]) => void;
  toggleHelper: (classId: string, userId: string) => void;
}

const Ctx = createContext<PortalCtx | null>(null);

/**
 * Reads persisted state during render. Returns null on the server and whenever
 * storage is empty, unavailable, or holds something that isn't the shape we
 * expect — callers fall back to the seed.
 */
function readStored<T>(key: string, isValid: (v: unknown) => boolean): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? (parsed as T) : null;
  } catch {
    // corrupted or blocked storage — fall back to seed
    return null;
  }
}

const isPortalData = (v: unknown): boolean => {
  const d = v as PortalData | null;
  return Boolean(
    d?.students && d?.payments && d?.attendance && d?.messages && d?.staffing
  );
};

const isPortalUser = (v: unknown): boolean => {
  const u = v as PortalUser | null;
  return typeof u?.id === "string" && typeof u?.role === "string";
};

// `ready` is false for the server render and the hydration pass, then flips to
// true once React is running on the client. Deriving it from
// useSyncExternalStore rather than a setState-in-effect keeps the prerendered
// markup and the first client render identical (this is a static export) while
// avoiding the cascading render that react-hooks/set-state-in-effect warns about.
const subscribeToNothing = () => () => {};
const getHydratedSnapshot = () => true;
const getServerSnapshot = () => false;

export function PortalProvider({ children }: { children: ReactNode }) {
  const ready = useSyncExternalStore(
    subscribeToNothing,
    getHydratedSnapshot,
    getServerSnapshot
  );
  // Read straight from storage during initialization. Safe against hydration
  // mismatches because nothing downstream renders `user`/`data` until `ready`.
  const [user, setUser] = useState<PortalUser | null>(() =>
    readStored<PortalUser>(AUTH_KEY, isPortalUser)
  );
  const [data, setData] = useState<PortalData>(
    () => readStored<PortalData>(DATA_KEY, isPortalData) ?? SEED
  );

  // Persist on change
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch {
      // storage unavailable — demo continues in memory
    }
  }, [data, ready]);

  const login = useCallback((u: PortalUser) => {
    setUser(u);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    } catch {}
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
  }, []);

  const resetDemo = useCallback(() => {
    setData(SEED);
  }, []);

  const addStudent = useCallback((s: Omit<Student, "id">) => {
    setData((d) => ({
      ...d,
      students: [...d.students, { ...s, id: crypto.randomUUID() }],
    }));
  }, []);

  const updateStudent = useCallback(
    (id: string, patch: Partial<Omit<Student, "id">>) => {
      setData((d) => ({
        ...d,
        students: d.students.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      }));
    },
    []
  );

  const deleteStudent = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      students: d.students.filter((s) => s.id !== id),
      payments: d.payments.filter((p) => p.studentId !== id),
      attendance: d.attendance.filter((a) => a.studentId !== id),
    }));
  }, []);

  const addPayment = useCallback((p: Omit<Payment, "id">) => {
    setData((d) => ({
      ...d,
      payments: [...d.payments, { ...p, id: crypto.randomUUID() }],
    }));
  }, []);

  const markPaid = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      payments: d.payments.map((p) =>
        p.id === id ? { ...p, status: "Paid" as const } : p
      ),
    }));
  }, []);

  const recordAttendance = useCallback(
    (records: Omit<AttendanceRecord, "id">[]) => {
      setData((d) => ({
        ...d,
        attendance: [
          ...d.attendance,
          ...records.map((r) => ({ ...r, id: crypto.randomUUID() })),
        ],
      }));
    },
    []
  );

  // Builds the message in the handler body, so the id and timestamp are minted
  // exactly once per click. Doing this inside a setState updater made the
  // updater impure — StrictMode double-invoked it and sent the message twice.
  const sendMessage = useCallback(
    (toId: string, text: string) => {
      if (!user) return;
      const to = userById(toId);
      if (!to || !canMessage(user.role, to.role)) return;
      const msg: Message = {
        id: crypto.randomUUID(),
        fromId: user.id,
        fromName: user.name,
        toId: to.id,
        toName: to.name,
        text,
        ts: new Date().toISOString(),
      };
      setData((d) => ({ ...d, messages: [...d.messages, msg] }));
    },
    [user]
  );

  const setClassLeads = useCallback((classId: string, leadIds: string[]) => {
    setData((d) => ({
      ...d,
      staffing: {
        ...d.staffing,
        [classId]: {
          leads: leadIds,
          helpers: d.staffing[classId]?.helpers ?? [],
        },
      },
    }));
  }, []);

  const toggleHelper = useCallback((classId: string, userId: string) => {
    setData((d) => {
      const entry = d.staffing[classId] ?? { leads: [], helpers: [] };
      const helpers = entry.helpers.includes(userId)
        ? entry.helpers.filter((h) => h !== userId)
        : [...entry.helpers, userId];
      return {
        ...d,
        staffing: { ...d.staffing, [classId]: { ...entry, helpers } },
      };
    });
  }, []);

  return (
    <Ctx.Provider
      value={{
        ready,
        user,
        data,
        login,
        logout,
        resetDemo,
        addStudent,
        updateStudent,
        deleteStudent,
        addPayment,
        markPaid,
        recordAttendance,
        sendMessage,
        setClassLeads,
        toggleHelper,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function usePortal(): PortalCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePortal must be used inside PortalProvider");
  return ctx;
}
