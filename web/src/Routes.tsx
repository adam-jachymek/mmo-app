import { useQuery } from "react-query";
import { Route, Routes } from "react-router-dom";
import { getUser } from "./api/endpoints";
import Login from "./Login";
import Home from "./Home";
import Admin from "components/Admin";
import SideNavBar from "components/SideNavBar";
import TopNavBar from "components/TopNavBar";

const AppRouter = () => {
  const {
    isFetching,
    isError,
    data: currentUser,
    refetch: refetchUser,
  } = useQuery("currentUser", getUser);

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    );
  }

  return (
    <>
      <TopNavBar currentUser={currentUser} />
      <SideNavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
};

export default AppRouter;
