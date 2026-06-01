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
  cloudinaryId?: string;
  title: string;
  description?: string;
  category: NoticeCategory;
  status: NoticeStatus;
  postedAt: string;
  imageUrl?: string;
  resourceType?: string;
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

const ACTIVITY_LIMIT = 25;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysAgo(days: number): string {
  return new Date(Date.now() - days * MS_PER_DAY).toISOString();
}

const SEED_ACTIVITY: NoticeActivity[] = [
  {
    id: "act-1",
    type: "updated",
    title: "Updated Timetable",
    detail: "Admin edited Exam Notice",
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

const ACTIVITY_STORAGE_KEY = "fis-notice-activity";

export function loadActivity(): NoticeActivity[] {
  if (typeof window === "undefined") return SEED_ACTIVITY;

  try {
    const stored = window.localStorage.getItem(ACTIVITY_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as NoticeActivity[]) : SEED_ACTIVITY;
  } catch {
    return SEED_ACTIVITY;
  }
}

export function saveActivity(activity: NoticeActivity[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity));
  } catch {
    // ignore storage failures
  }
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
  if (Number.isNaN(date.getTime())) return " ";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatRelativeTime(iso: string): string {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return " ";
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
