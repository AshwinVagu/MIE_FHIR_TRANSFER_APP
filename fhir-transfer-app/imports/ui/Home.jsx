import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Landing } from "./Landing.jsx";
import { AuthCode } from "./authCode.jsx";
import { DataRetrieval } from "./dataRetrieval.jsx";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} /> 
          <Route path="/code" element={<AuthCode />} /> 
          <Route path="/data-retrieval" element={<DataRetrieval />} /> 
        </Routes>
      </div>
    </>
  );
};

const Home = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default Home;
