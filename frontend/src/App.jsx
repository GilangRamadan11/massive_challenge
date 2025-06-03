import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Login from './pages/login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} ></Route>
        <Route path="/AddProductform" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
