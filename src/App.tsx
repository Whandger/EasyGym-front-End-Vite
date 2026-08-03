import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import TreinoPage from "./pages/TreinoPage";
import HistoricoPage from "./pages/HistoricoPage";
import ContaPage from "./pages/ContaPage";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";
import NotFound from "./pages/NotFound";
import ExercicioDetailPage from "./pages/ExercicioDetailPage";

function App() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rota pública */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/treino"
          element={
            <ProtectedRoute>
              <TreinoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historico"
          element={
            <ProtectedRoute>
              <HistoricoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conta"
          element={
            <ProtectedRoute>
              <ContaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercicio/:exerciseId"
          element={
            <ProtectedRoute>
              <ExercicioDetailPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
