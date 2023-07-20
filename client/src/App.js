import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './pages/Login/Login';
import UserManagement from "./pages/UserManagment/UserManagement";
import TeamManage from "./pages/UserTeamManagment/TeamManage";
import Menu from "./pages/Menu/Menu";
import { AuthContext } from "./utils/AuthContext";
import UserSearch from "./pages/UserSearch/UserSearch";

function App() {
  const [userInfo, setUserInfo] = useState(() => {
    // Fetch user information from local storage on mount
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const { data, expiry } = JSON.parse(storedUserInfo);
      if (expiry > Date.now()) {
        return data;
      } else {
        localStorage.removeItem("userInfo");
      }
    }
    return null;
  });

  const handleLogin = (user) => {
    const expiryTime = Date.now() + 5 * 60 * 1000;
    const userInfo = { data: user, expiry: expiryTime };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setUserInfo(user);
  };

  // Memoize the context value to prevent unnecessary re-renders of consuming components
  const authContextValue = useMemo(() => ({ userInfo, handleLogin }), [userInfo]);

  return (
    <Router>
      <AuthContext.Provider value={authContextValue}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/usermanagement" element={<UserManagement />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/team-management" element={<TeamManage />} />
          <Route path="/user-search" element={<UserSearch />} />
        </Routes>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
