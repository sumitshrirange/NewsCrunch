import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Home from "../pages/Home";
import History from "../pages/History";
import ArticleDetail from "../pages/ArticleDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AppRouter = () => (
  <>
    <Navbar />
    <main style={{ flex: 1 }}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/article/:id"
          element={
            <ProtectedRoute>
              <ArticleDetail />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <Footer />
  </>
);

export default AppRouter;
