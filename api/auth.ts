import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: { message: "Method not allowed" } });
    return;
  }

  try {
    const body = (req.body ?? {}) as { username?: string; password?: string };
    const username = body.username ?? "";
    const password = body.password ?? "";

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      res.status(500).json({
        error: {
          message: "Admin credentials are not configured on the server.",
        },
      });
      return;
    }

    if (username === adminUsername && password === adminPassword) {
      res.status(200).json({ ok: true });
      return;
    }

    res.status(401).json({
      error: {
        message: "Invalid username or password.",
      },
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message:
          error instanceof Error ? error.message : "Failed to process authentication request.",
      },
    });
  }
}

