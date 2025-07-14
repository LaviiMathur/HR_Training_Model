import { Routes, Route } from "react-router-dom";
import { logIn, home, intern, project } from "./routes/Routes.js";
import ProjectForm from "./components/Mentor/ProjectForm.jsx";
import InternForm from "./components/Hr/InternForm.jsx";
import { LoginPage, HomePage } from "./pages/index.pages.js";
import useTokenRefresher from "./hooks/useTokenRefresher.js";

function App() {
  useTokenRefresher();
  return (
    <Routes>
      <Route path={logIn} element={<LoginPage />} />
      <Route path={home} element={<HomePage />} />
      <Route path={intern} element={<InternForm />} />
      <Route path={project} element={<ProjectForm />} />
    </Routes>
  );
}

export default App;
