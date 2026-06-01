export type NavigationLink = {
  label: string;
  path: string;
};

export const primaryNavigationLinks: NavigationLink[] = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about-us" },
  { label: "Academics", path: "/academics" },
  { label: "Gallery", path: "/gallery" },
  { label: "Notices", path: "/notices" },
  { label: "Contact", path: "/contact" },
  { label: "Apply Now", path: "/apply-now" },
];

export const footerNavigationLinks: NavigationLink[] =
  primaryNavigationLinks.filter((link) => link.path !== "/");
