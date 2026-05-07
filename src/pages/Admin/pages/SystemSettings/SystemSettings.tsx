import { AdminPlaceholder } from "../../components/AdminPlaceholder";
import { findAdminSection } from "../../config/sections";

export default function SystemSettings() {
  const section = findAdminSection("/admin/systemsettings");
  return (
    <AdminPlaceholder title={section.label} subtitle={section.subtitle} />
  );
}
