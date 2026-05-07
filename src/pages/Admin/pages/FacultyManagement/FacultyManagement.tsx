import { AdminPlaceholder } from "../../components/AdminPlaceholder";
import { findAdminSection } from "../../config/sections";

export default function FacultyManagement() {
  const section = findAdminSection("/admin/facultymanagement");
  return (
    <AdminPlaceholder title={section.label} subtitle={section.subtitle} />
  );
}
