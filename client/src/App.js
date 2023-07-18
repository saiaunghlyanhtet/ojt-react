import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './pages/Login/Login';
import UserManagement from "./pages/UserManagment/UserManagement";
import TeamManage from "./pages/UserTeamManagment/TeamManage";
import Menu from "./pages/Menu/Menu";
import { AuthContext } from "./utils/AuthContext"; // Update the path to the AuthContext file
import { useEffect, useState } from "react";
import UserSearch from "./pages/UserSearch/UserSearch";

function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const { data, expiry } = JSON.parse(storedUserInfo);
      if (expiry > Date.now()) {
        setUserInfo(data);
      } else {
        localStorage.removeItem("userInfo");
      }
    }
  }, []);

  const handleLogin = (user) => {
    const expiryTime = Date.now() + 5 * 60 * 1000; // Set expiry time to 5 minutes from now
    const userInfo = { data: user, expiry: expiryTime };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setUserInfo(user);
  };


  return (
    <Router>
      <AuthContext.Provider value={{userInfo, handleLogin}}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/usermanagement" element={<UserManagement />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/team-management" element={<TeamManage />} />
          <Route path="/user-search" element={<UserSearch/>} />
        </Routes>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
