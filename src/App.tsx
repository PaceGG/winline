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
        <MatchList />
      </AuthorizationProvider>
    </>
  );
}

export default App;
