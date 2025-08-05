import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import PaginaBase from "./pages/PaginaBase";

function App() {
  return (
    
      <Router>
        <div className="App">
          <Routes>

            <Route path="/" element={<Navigate to="/pag-base" replace />} />

            <Route path="/pag-base" element={<PaginaBase />} />

            <Route path="*" element={<Navigate to="/pag-base" replace />} />
          </Routes>
        </div>
      </Router>
    
  );
}

export default App;