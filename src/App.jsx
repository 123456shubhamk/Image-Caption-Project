import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/css/ImageCaptionUi.css";
import "./assets/css/AddCaption.css";
import ImageCaptionUi from "./components/image-caption/ImageCaptionUi";
import AddCaption from "./components/image-caption/AddCaption";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ImageCaptionUi />} />
          <Route path="/add-caption" element={<AddCaption />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
