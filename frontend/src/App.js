import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import ComicPage from "./components/ComicPage";
import NotFound from "./components/NotFound";
import ComicReader from "./components/ComicReader";
import SearchPage from "./components/SearchPage";
import UploadPage from "./components/UploadPage";
// Styles
import { GlobalStyle } from "./GlobalStyle";

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/c/:comicId" element={<ComicPage />} />
      <Route path="/cc/:comicId/:chptId" element={<ComicReader />} />
      <Route path="/cs/:searchText" element={<SearchPage />} />
      <Route path="/cs/" element={<SearchPage />} />
      <Route path="/u" element={<UploadPage />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
    <Footer />
    <GlobalStyle />
  </Router>
);

export default App;
