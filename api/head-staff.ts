import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";
import crypto from "crypto";

type HeadStaffMember = {
  id: string;
  name: string;
  position: string;
  description: string;
  imageUrl?: string;
};

type HeadStaffRequestBody = Partial<Omit<HeadStaffMember, "id">> & {
  id?: string;
};

const DATA_FILE = process.env.HEAD_STAFF_DATA_FILE?.trim()
  ? path.resolve(process.env.HEAD_STAFF_DATA_FILE.trim())
  : path.join(process.cwd(), "data", "head-staff.json");

function readData(): HeadStaffMember[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((entry) => {
        if (typeof entry !== "object" || entry === null) return null;
        const record = entry as Record<string, unknown>;
        return {
          id: typeof record.id === "string" ? record.id : "",
          name: typeof record.name === "string" ? record.name : "",
          position: typeof record.position === "string" ? record.position : "",
          description:
            typeof record.description === "string" ? record.description : "",
          imageUrl: typeof record.imageUrl === "string" ? record.imageUrl : "",
        } as HeadStaffMember;
      })
      .filter((member): member is HeadStaffMember =>
        Boolean(member && member.id && member.name && member.position),
      );
  } catch {
    return [];
  }
}

function writeData(records: HeadStaffMember[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), "utf8");
}

function parseJsonBody(body: unknown): HeadStaffRequestBody {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as HeadStaffRequestBody;
    } catch {
      return {};
    }
  }
  if (typeof body === "object") {
    return body as HeadStaffRequestBody;
  }
  return {};
}

function normalizeMember(
  payload: HeadStaffRequestBody,
): HeadStaffMember | null {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const position =
    typeof payload.position === "string" ? payload.position.trim() : "";
  const description =
    typeof payload.description === "string" ? payload.description.trim() : "";
  const imageUrl =
    typeof payload.imageUrl === "string" ? payload.imageUrl.trim() : "";

  if (!name || !position) {
    return null;
  }

  return {
    id:
      typeof payload.id === "string" && payload.id.trim()
        ? payload.id.trim()
        : crypto.randomBytes(8).toString("hex"),
    name,
    position,
    description,
    imageUrl,
  };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method?.toUpperCase();
  const url = new URL(req.url ?? "", "http://localhost");
  const pathParts = url.pathname.split("/").filter(Boolean);
  const itemId = pathParts.length > 2 ? pathParts[2] : undefined;

  if (method === "GET" && !itemId) {
    const staff = readData();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ staff });
    return;
  }

  if (method === "POST" && !itemId) {
    const payload = parseJsonBody(req.body);
    const member = normalizeMember(payload);
    if (!member) {
      res.setHeader("Content-Type", "application/json");
      res
        .status(400)
        .json({ error: { message: "Name and position are required." } });
      return;
    }
    const staff = readData();
    staff.unshift(member);
    writeData(staff);
    res.setHeader("Content-Type", "application/json");
    res.status(201).json(member);
    return;
  }

  if (itemId && method === "PUT") {
    const payload = parseJsonBody(req.body);
    const member = normalizeMember({ ...payload, id: itemId });
    if (!member) {
      res.setHeader("Content-Type", "application/json");
      res
        .status(400)
        .json({ error: { message: "Name and position are required." } });
      return;
    }
    const staff = readData();
    const index = staff.findIndex((item) => item.id === itemId);
    if (index === -1) {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json({ error: { message: "Staff member not found." } });
      return;
    }
    staff[index] = member;
    writeData(staff);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(member);
    return;
  }

  if (itemId && method === "DELETE") {
    const staff = readData();
    const next = staff.filter((item) => item.id !== itemId);
    writeData(next);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ ok: true });
    return;
  }

  res.setHeader("Allow", "GET, POST, PUT, DELETE");
  res.setHeader("Content-Type", "application/json");
  res.status(405).json({ error: { message: "Method not allowed." } });
}
