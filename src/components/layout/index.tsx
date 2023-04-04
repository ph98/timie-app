import { Navigate, Outlet } from "react-router-dom";
import Header from "./header";
import UserContext from "../../context/userContext";
import { useState } from "react";

const Layout = () => {

  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem("user") || "{}"))

  if(!user.access_token){
    return(
      <Navigate to="/login" />
    )
  }

  return (
    <UserContext.Provider value={{
      user,
      setUser
    }}>
      <div>
        <Header />
        <Outlet />
      </div>
    </UserContext.Provider>
  );
};

export default Layout;
