import { Box } from "@mui/material";
import Footer from "./component/Footer";
import Header from "./component/Header";
import Home from "./component/Home";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Box>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about_us" element={<h1>About</h1>} />
        <Route path="/facilities" element={<h1>Facilities</h1>} />
        <Route path="/academics" element={<h1>Academics</h1>} />
        <Route path="/news_and_events" element={<h1>News</h1>} />
        <Route path="/contact" element={<h1>Contact</h1>} />
      </Routes>
      <Footer />
    </Box>
  );
}

export default App;
