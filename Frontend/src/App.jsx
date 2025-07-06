import { Routes, Route } from "react-router-dom";
import { logIn, home } from "./routes/Routes";

import { LoginPage, HomePage } from "./pages/index.pages.js";
import useTokenRefresher from "./hooks/useTokenRefresher.js";

function App() {
  useTokenRefresher();
  return (
    <Routes>
      <Route path={logIn} element={<LoginPage />} />
      <Route path={home} element={<HomePage />} />
    </Routes>
  );
}

export default App;
