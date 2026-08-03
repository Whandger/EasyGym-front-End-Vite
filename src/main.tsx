import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TrainingProvider } from "./context/TrainingContext";
import App from "./App";
import "./index.css";
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <AuthProvider>
      <ThemeProvider>
      <TrainingProvider>
        <App />
      </TrainingProvider>
      </ThemeProvider>
    </AuthProvider>
  </HashRouter>,
);
