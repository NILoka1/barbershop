import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginPage from "./pages/loginPage/LoginPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"/>
        <Route path="login" element={<LoginPage/>}/>

        <Route element={<ProtectedRoute />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
