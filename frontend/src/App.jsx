import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import GardenPage from "./pages/GardenPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/garden" element={<GardenPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
