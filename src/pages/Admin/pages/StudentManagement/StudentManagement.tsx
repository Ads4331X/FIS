import { AdminPlaceholder } from "../../components/AdminPlaceholder";
import { findAdminSection } from "../../config/sections";

export default function StudentManagement() {
  const section = findAdminSection("/admin/studentmanagement");
  return (
    <AdminPlaceholder title={section.label} subtitle={section.subtitle} />
  );
}
