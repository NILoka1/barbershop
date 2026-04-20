import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginPage from "./pages/loginPage/LoginPage";
import { HomePage } from "./pages/homePage/HomePage";
import WorkerDashbord from "./pages/workerDashbord/WorkerDashbord";
import { AppSh } from "./components/AppShell";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
        <Route element={<AppSh><Outlet /></AppSh>}>
          <Route path="/workerDashbord" element={<WorkerDashbord />} />
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
