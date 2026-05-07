import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import ScrollToTop from "../components/ui/ScrollToTop";
import About from "../pages/About/About";
import Academics from "../pages/Academics/Academics";
import Admission from "../pages/Admission/Admission";
import Contact from "../pages/Contact/Contact";
import Home from "../pages/Home/Home";
import Gallery from "../pages/Gallery/Gallery";
import Notices from "../pages/Notices/Notices";
import Admin from "../pages/Admin/Admin";
import Overview from "../pages/Admin/pages/Overview/Overview";
import StudentManagement from "../pages/Admin/pages/StudentManagement/StudentManagement";
import FacultyManagement from "../pages/Admin/pages/FacultyManagement/FacultyManagement";
import GalleryManagement from "../pages/Admin/pages/GalleryManagement/GalleryManagement";
import NoticeBoard from "../pages/Admin/pages/NoticeBoard/NoticeBoard";
import SystemSettings from "../pages/Admin/pages/SystemSettings/SystemSettings";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <Box>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="studentmanagement" element={<StudentManagement />} />
          <Route path="facultymanagement" element={<FacultyManagement />} />
          <Route path="noticeboard" element={<NoticeBoard />} />
          <Route path="gallerymanagement" element={<GalleryManagement />} />
          <Route path="systemsettings" element={<SystemSettings />} />
        </Route>
        <Route path="/about_us" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/apply_now" element={<Admission />} />
      </Routes>
      {!isAdminRoute && <Footer />}
      <ScrollToTop />
    </Box>
  );
}

export default App;
