import type { ReactNode } from "react";
import { createElement } from "react";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export type AdminSection = {
  key: string;
  label: string;
  path: string;
  icon: ReactNode;
  subtitle: string;
};

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    key: "noticeboard",
    label: "Notice Board",
    path: "/admin/noticeboard",
    icon: createElement(CampaignOutlinedIcon, { fontSize: "small" }),
    subtitle: "Update, edit, and manage school-wide announcements.",
  },
  {
    key: "gallerymanagement",
    label: "Gallery Management",
    path: "/admin/gallerymanagement",
    icon: createElement(PhotoLibraryOutlinedIcon, { fontSize: "small" }),
    subtitle:
      "Organize and curate the digital memories of Fairyland International School.",
  },
  {
    key: "settings",
    label: "Admin Settings",
    path: "/admin/settings",
    icon: createElement(SettingsOutlinedIcon, { fontSize: "small" }),
    subtitle:
      "Manage admin access and view deployment authentication settings.",
  },
];

export const DEFAULT_ADMIN_SECTION_KEY = "noticeboard";

export function findAdminSection(pathname: string): AdminSection {
  const key = pathname.split("/")[2] || DEFAULT_ADMIN_SECTION_KEY;
  return (
    ADMIN_SECTIONS.find((section) => section.key === key) ?? ADMIN_SECTIONS[0]
  );
}
