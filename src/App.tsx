import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import MatchList from "./components/MatchList";
import { AuthorizationProvider } from "./components/WithRole";
import { useAppSelector } from "./hooks/redux";
import LoginPage from "./components/LoginPage";
import { useEffect } from "react";
import ToastContainer from "./components/ToastContainer";
import RegisterPage from "./components/RegisterPage";

function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function App() {
  const userRole = useAppSelector((state) => state.user.user?.role);

  return (
    <>
      <AuthorizationProvider getUserRoles={() => [userRole ?? "NONE"]}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/matches" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<MainLayout />}>
              <Route
                path="/matches"
                element={<MatchList matchStatus="UPCOMING" />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </AuthorizationProvider>
    </>
  );
}

export default App;
