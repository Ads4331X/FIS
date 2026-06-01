import type { HeadStaffMember } from "../types/headStaff.types";

const API_PATH = "/api/head-staff";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || "Unable to load head staff data.");
  }

  return response.json();
}

export async function fetchHeadStaff(): Promise<HeadStaffMember[]> {
  const response = await fetch(API_PATH, { method: "GET" });
  return parseResponse<{ staff: HeadStaffMember[] }>(response).then(
    (data) => data.staff,
  );
}

export async function createHeadStaff(
  payload: Omit<HeadStaffMember, "id">,
): Promise<HeadStaffMember> {
  const response = await fetch(API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<HeadStaffMember>(response);
}

export async function updateHeadStaff(
  payload: HeadStaffMember,
): Promise<HeadStaffMember> {
  const response = await fetch(
    `${API_PATH}/${encodeURIComponent(payload.id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  return parseResponse<HeadStaffMember>(response);
}

export async function deleteHeadStaff(id: string): Promise<void> {
  const response = await fetch(`${API_PATH}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  await parseResponse<Record<string, unknown>>(response);
}
