import { Box } from "@mui/material";
import { useEffect } from "react";
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
import GalleryManagement from "../pages/Admin/pages/GalleryManagement/GalleryManagement";
import NoticeBoard from "../pages/Admin/pages/NoticeBoard/NoticeBoard";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const pageTitles: Record<string, string> = {
      "/": "Home",
      "/about_us": "About Us",
      "/academics": "Academics",
      "/gallery": "Gallery",
      "/notices": "Notices",
      "/contact": "Contact",
      "/apply_now": "Admission",
      "/admin": "Admin",
      "/admin/noticeboard": "Admin - Notice Board",
      "/admin/gallerymanagement": "Admin - Gallery Management",
    };

    const currentPageTitle =
      pageTitles[location.pathname] ?? "Fairyland International School";
    document.title = `${currentPageTitle} | Fairyland International School`;
  }, [location.pathname]);

  return (
    <Box>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="noticeboard" replace />} />
          <Route path="noticeboard" element={<NoticeBoard />} />
          <Route path="gallerymanagement" element={<GalleryManagement />} />
          <Route path="*" element={<Navigate to="noticeboard" replace />} />
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
