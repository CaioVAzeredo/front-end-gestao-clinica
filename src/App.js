import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import PaginaBase from "./pages/PaginaBase";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import { useState } from "react";

function PrivateRoute({ token, children }) {
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("authToken")); // ✅ Corrigido

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route
            path="/pag-base"
            element={
              <PrivateRoute token={token}>
                <PaginaBase />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              !token ? (
                <Login setToken={setToken} />
              ) : (
                <Navigate to="/pag-base" replace />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
