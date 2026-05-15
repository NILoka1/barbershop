import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginPage from "./pages/loginPage/LoginPage";
import { HomePage } from "./pages/homePage/HomePage";
import { ShiftsPage } from "./pages/shiftsPage/ShiftsPage";
import { AppSh } from "./components/AppShell";
import ServicesPage from "./pages/servicesPage/ServicesPage";
import WorkersPage from "./pages/workersPage/WorkersPage";
import { DashboardPage } from "./pages/DashboardPage/DashboardPage";
import { BookingPage } from "./pages/BookingPage/BookingPage";
import { ClientsPage } from "./pages/ClientsPage/ClientsPage";
import CalendarShiftsPage from "./pages/CalendarShiftsPage/CalendarShiftsPage";
import AnalyticsPage from "./pages/АnalyticsPage/AnalyticsPage";
import { AdminRoute } from "./components/AdminRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <AppSh>
                <Outlet />
              </AppSh>
            }
          >
            <Route element={<AdminRoute />}>
              <Route path="/services" element={<ServicesPage />}></Route>
              <Route path="/workers" element={<WorkersPage />} />
              <Route path="/clients" element={<ClientsPage />} />
            </Route>
            <Route path="/calendarShifts" element={<CalendarShiftsPage />} />
            <Route path="/workerDashbord" element={<DashboardPage />} />

            <Route path="/shifts" element={<ShiftsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
