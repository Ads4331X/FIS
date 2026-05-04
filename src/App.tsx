import { Box } from "@mui/material";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Home from "./pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import About from "./pages/About/About";
import Academics from "./pages/Academics/Academics";
import Contact from "./pages/contact/contact";
import Admission from "./pages/Admission/Admission";

function App() {
  return (
    <Box>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about_us" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/news_and_events" element={<h1>News</h1>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/apply_now" element={<Admission />} />
      </Routes>
      <Footer />
    </Box>
  );
}

export default App;
