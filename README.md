# Fairyland Secondary School — Website

A modern, responsive school website built with React, TypeScript, and Material UI. Deployed on Vercel with Cloudinary-powered gallery management.

---

## Tech Stack

- **React 19** + **TypeScript 6**
- **Vite 8** (build tool)
- **Material UI v9** (component library)
- **React Router v7** (client-side routing)
- **Cloudinary** (image hosting & gallery)
- **Vercel** (hosting + serverless API)
- **Google Forms** (contact & admission form submissions)

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, stats, academic overview, CTA |
| `/about_us` | About — mission, timeline, schedule visit |
| `/academics` | Academics — curriculum, vision, results |
| `/gallery` | Gallery — Cloudinary-powered photo gallery |
| `/contact` | Contact — form, map, contact info |
| `/apply_now` | Admission — application form |

---

## Project Structure

```
├── api/
│   └── images.ts              # Vercel serverless function — Cloudinary proxy
├── src/
│   ├── app/
│   │   ├── App.tsx            # Route definitions
│   │   └── main.tsx           # App entry point
│   ├── components/
│   │   ├── icons/             # Custom SVG icons (TikTok, etc.)
│   │   ├── layout/            # Header, Footer
│   │   └── ui/                # Reusable components (Hero, Counter, StatCard, StatGrid, ProgramCard)
│   ├── constants/
│   │   ├── navigationLinks.ts # Nav link definitions
│   │   └── siteContact.ts     # School contact info (single source of truth)
│   ├── pages/
│   │   ├── About/
│   │   ├── Academics/
│   │   ├── Admission/
│   │   ├── Contact/
│   │   ├── Gallery/
│   │   └── Home/
│   ├── services/
│   │   └── Cloudinary.ts      # Cloudinary fetch, upload, delete helpers
│   └── styles/
│       └── global.css
├── public/
│   └── images/                # Static site images
├── vercel.json                # Vercel rewrite rules
└── vite.config.ts             # Vite config + local Cloudinary dev proxy
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Cloudinary](https://cloudinary.com) account
- A Vercel account (for deployment)

### Installation

```bash
git clone <repo-url>
cd fis
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Frontend (safe to expose)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Server-only (never VITE_ prefix)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_strong_password
```

> **Note:** `VITE_` prefixed variables are exposed to the frontend. Never put `CLOUDINARY_API_SECRET` in a `VITE_` variable.

### Development

```bash
npm run dev
```

Vite includes a local middleware that proxies `/api/images` requests to Cloudinary, so the gallery works in development without needing Vercel CLI.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com).
2. Copy your **cloud name**, **API key**, and **API secret** into the `.env` file (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
3. Images are organized into folders:

| Label | Folder |
|---|---|
| School | `School` |
| Events | `School/Events` |
| Sports | `School/Sports` |
| Students | `School/Students` |
| Tour | `School/Tour` |

---



## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add all environment variables from `.env` to Vercel's project settings.
4. Deploy. Vercel automatically serves the `api/images.ts` function as a serverless endpoint.

The `vercel.json` config routes all API calls to the serverless function and all other paths to `index.html` for client-side routing:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)",     "destination": "/index.html" }
  ]
}
```

---

## Contact & Forms

Contact and admission forms submit to **Google Forms** via a `no-cors` fetch. No backend is required. To update the form endpoints, edit the form action URLs and entry field IDs in:

- `src/pages/Contact/components/Form.tsx`
- `src/pages/Admission/components/AdmissionFormCard.tsx`

School contact details (address, phone, email, social links, map URLs) are centralized in:

```
src/constants/siteContact.ts
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## License

Private project for Fairyland Secondary School. All rights reserved.

---

> **Developer note:** A separate `ADMIN.md` file contains gallery management instructions for the school admin. Keep it out of any public repository — add it to `.gitignore` or share it privately.