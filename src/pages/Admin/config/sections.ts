import type { ReactNode } from "react";
import { createElement } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
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
    key: "overview",
    label: "Overview",
    path: "/admin/overview",
    icon: createElement(DashboardOutlinedIcon, { fontSize: "small" }),
    subtitle: "Track school-wide operational highlights from one place.",
  },
  {
    key: "studentmanagement",
    label: "Student Management",
    path: "/admin/studentmanagement",
    icon: createElement(SchoolOutlinedIcon, { fontSize: "small" }),
    subtitle: "Manage records, enrollment data, and student lifecycle updates.",
  },
  {
    key: "facultymanagement",
    label: "Faculty Management",
    path: "/admin/facultymanagement",
    icon: createElement(GroupsOutlinedIcon, { fontSize: "small" }),
    subtitle: "Oversee teaching staff, assignments, and faculty operations.",
  },
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
    subtitle: "Organize and curate the digital memories of Fairyland Secondary.",
  },
  {
    key: "systemsettings",
    label: "System Settings",
    path: "/admin/systemsettings",
    icon: createElement(SettingsOutlinedIcon, { fontSize: "small" }),
    subtitle: "Configure portal behavior, preferences, and access controls.",
  },
];

export const DEFAULT_ADMIN_SECTION_KEY = "overview";

export function findAdminSection(pathname: string): AdminSection {
  const key = pathname.split("/")[2] || DEFAULT_ADMIN_SECTION_KEY;
  return (
    ADMIN_SECTIONS.find((section) => section.key === key) ?? ADMIN_SECTIONS[0]
  );
}
