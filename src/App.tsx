import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import MatchList from "./components/MatchList";
import { AuthorizationProvider } from "./components/WithRole";
import { useAppSelector } from "./hooks/redux";

function App() {
  const userRole = useAppSelector((state) => state.user.user?.role);

  return (
    <>
      <AuthorizationProvider getUserRoles={() => [userRole ?? "NONE"]}>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/matches" element={<MatchList />} />
          </Routes>
        </BrowserRouter>
      </AuthorizationProvider>
    </>
  );
}

export default App;
