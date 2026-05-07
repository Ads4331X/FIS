export const NOTICE_CATEGORIES = [
  "Event",
  "Sports",
  "Maintenance",
  "Academic",
  "General",
] as const;

export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number];

export const NOTICE_STATUSES = ["published", "draft"] as const;

export type NoticeStatus = (typeof NOTICE_STATUSES)[number];

export type Notice = {
  id: string;
  title: string;
  description: string;
  category: NoticeCategory;
  status: NoticeStatus;
  postedAt: string;
  imageUrl?: string;
};

export type NoticeActivityType =
  | "created"
  | "updated"
  | "published"
  | "removed";

export type NoticeActivity = {
  id: string;
  type: NoticeActivityType;
  title: string;
  detail: string;
  timestamp: string;
};

const NOTICES_STORAGE_KEY = "fis_admin_notices_v1";
const ACTIVITY_STORAGE_KEY = "fis_admin_notice_activity_v1";
const ACTIVITY_LIMIT = 25;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysAgo(days: number): string {
  return new Date(Date.now() - days * MS_PER_DAY).toISOString();
}

const SEED_NOTICES: Notice[] = [
  {
    id: "ntc-gala-2024",
    title: "Fairyland Gala Night 2024",
    description:
      "Join us for an evening of celebration, performance, and community spirit. All parents and alumni are invited to witness our students' creative showcases and annual highlights.",
    category: "Event",
    status: "published",
    postedAt: daysAgo(2),
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1280&q=80",
  },
  {
    id: "ntc-science-fair-2024",
    title: "Annual Science Fair 2024",
    description: "Exhibition details and registration link.",
    category: "Event",
    status: "published",
    postedAt: daysAgo(13),
  },
  {
    id: "ntc-football",
    title: "Inter-School Football Championship",
    description: "Schedule for the upcoming finals in the city stadium.",
    category: "Sports",
    status: "published",
    postedAt: daysAgo(15),
  },
  {
    id: "ntc-library-closure",
    title: "Library Maintenance Closure",
    description: "Temporary closure for system upgrades.",
    category: "Maintenance",
    status: "draft",
    postedAt: daysAgo(12),
  },
  {
    id: "ntc-final-exams",
    title: "Semester Final Exams Timetable",
    description: "Download the PDF for all grade levels.",
    category: "Academic",
    status: "published",
    postedAt: daysAgo(17),
  },
];

const SEED_ACTIVITY: NoticeActivity[] = [
  {
    id: "act-1",
    type: "updated",
    title: "Updated Timetable",
    detail: "Admin John edited Exam Notice",
    timestamp: daysAgo(0),
  },
  {
    id: "act-2",
    type: "published",
    title: "Notice Published",
    detail: "Science Fair announcement is live",
    timestamp: daysAgo(0),
  },
  {
    id: "act-3",
    type: "removed",
    title: "Draft Removed",
    detail: "Old maintenance draft was deleted",
    timestamp: daysAgo(1),
  },
];

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadNotices(): Notice[] {
  if (!isBrowser()) return SEED_NOTICES;
  const stored = window.localStorage.getItem(NOTICES_STORAGE_KEY);
  if (stored === null) {
    window.localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(SEED_NOTICES));
    return SEED_NOTICES;
  }
  return safeParse<Notice[]>(stored, SEED_NOTICES);
}

export function saveNotices(notices: Notice[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
}

export function loadActivity(): NoticeActivity[] {
  if (!isBrowser()) return SEED_ACTIVITY;
  const stored = window.localStorage.getItem(ACTIVITY_STORAGE_KEY);
  if (stored === null) {
    window.localStorage.setItem(
      ACTIVITY_STORAGE_KEY,
      JSON.stringify(SEED_ACTIVITY),
    );
    return SEED_ACTIVITY;
  }
  return safeParse<NoticeActivity[]>(stored, SEED_ACTIVITY);
}

export function saveActivity(activity: NoticeActivity[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity));
}

export function appendActivity(
  current: NoticeActivity[],
  entry: Omit<NoticeActivity, "id" | "timestamp"> & { timestamp?: string },
): NoticeActivity[] {
  const next: NoticeActivity = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: entry.timestamp ?? new Date().toISOString(),
    type: entry.type,
    title: entry.title,
    detail: entry.detail,
  };
  return [next, ...current].slice(0, ACTIVITY_LIMIT);
}

export function generateNoticeId(): string {
  return `ntc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatNoticeDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatRelativeTime(iso: string): string {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return "—";
  const diffMs = Date.now() - target;
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? "" : "s"} ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  return formatNoticeDate(iso);
}
