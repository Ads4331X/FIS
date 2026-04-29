import Footer from "./component/Footer";
import Header from "./component/Header";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/about_us" element={<h1>About</h1>} />
        <Route path="/facilities" element={<h1>Facilities</h1>} />
        <Route path="/academics" element={<h1>Academics</h1>} />
        <Route path="/news_and_events" element={<h1>News</h1>} />
        <Route path="/contact" element={<h1>Contact</h1>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
