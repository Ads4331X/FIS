import { AdminPlaceholder } from "../../components/AdminPlaceholder";
import { findAdminSection } from "../../config/sections";

export default function Overview() {
  const section = findAdminSection("/admin/overview");
  return (
    <AdminPlaceholder title={section.label} subtitle={section.subtitle} />
  );
}
