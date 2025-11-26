import "./App.css";
import Header from "./components/Header";
import { AuthorizationProvider } from "./components/WithRole";
import { useAppSelector } from "./hooks/redux";

function App() {
  const userRole = useAppSelector((state) => state.auth);

  return (
    <>
      <AuthorizationProvider getUserRoles={() => [userRole.role]}>
        <Header />
      </AuthorizationProvider>
    </>
  );
}

export default App;
