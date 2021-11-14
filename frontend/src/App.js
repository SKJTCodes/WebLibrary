import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import OpeningPage from "./components/OpeningPage";
import ItemInfoPage from "./components/ItemInfoPage";
import Viewer from "./components/Viewer";
import NotFound from "./components/NotFound";
import SearchPage from "./components/SearchPage";
import UploadPage from "./components/UploadPage";
// Styles
import { GlobalStyle } from "./GlobalStyle";

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/:itemType" element={<OpeningPage />} />
      <Route path="/:itemType/:itemId" element={<ItemInfoPage />} />
      <Route path="/:itemType/:itemId/:num" element={<Viewer />} />
      <Route path="/s" element={<SearchPage />} />
      <Route path="/u" element={<UploadPage />} />
      <Route path="/*" element={<NotFound />} />
      <Route path="/" element={<Navigate replace to="/c?sort=DateCreated" />} />
    </Routes>
    <Footer />
    <GlobalStyle />
  </Router>
);

export default App;
