import { useQuery } from "react-query";
import { Route, Routes } from "react-router-dom";
import { getUser } from "./api/endpoints";
import Login from "./Login";
import Home from "./Home";

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
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AppRouter;
