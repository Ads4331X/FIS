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
import Admin from "../pages/Admin/Admin";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <Box>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Navigate to="/admin/gallerymanagement" replace />} />
        <Route path="/admin/overview" element={<Admin />} />
        <Route path="/admin/studentmanagement" element={<Admin />} />
        <Route path="/admin/gallerymanagement" element={<Admin />} />
        <Route path="/admin/systemsettings" element={<Admin />} />
        <Route path="/about_us" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/apply_now" element={<Admission />} />
      </Routes>
      {!isAdminRoute && <Footer />}
      <ScrollToTop />
    </Box>
  );
}

export default App;
