import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import About from "../pages/About/About";
import Academics from "../pages/Academics/Academics";
import Admission from "../pages/Admission/Admission";
import Contact from "../pages/Contact/Contact";
import Home from "../pages/Home/Home";

function App() {
  return (
    <Box>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about_us" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/apply_now" element={<Admission />} />
      </Routes>
      <Footer />
    </Box>
  );
}

export default App;
