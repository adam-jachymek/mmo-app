import { useQuery } from "react-query";
import { Route, Routes } from "react-router-dom";
import { getUser } from "./api/endpoints";
import Login from "./Login";
import Home from "./Home";
import Admin from "components/Admin";
import SideNavBar from "components/SideNavBar";
import TopNavBar from "components/TopNavBar";
import Battle from "components/Battle";
import BattleScreen from "components/BattleScreen";
import Items from "./components/Admin/sub/Items";
import Maps from "./components/Admin/sub/Maps";
import Mobs from "./components/Admin/sub/Mobs";
import Explore from "./components/Explore";
import ExploreScreen from "./components/ExploreScreen";
import Character from "./components/Character";

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
      <TopNavBar currentUser={currentUser} refetchUser={refetchUser} />
      <SideNavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/character" element={<Character />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/items" element={<Items />} />
        <Route path="/admin/maps" element={<Maps />} />
        <Route path="/admin/mobs" element={<Mobs />} />
        <Route
          path="/explore"
          element={<Explore currentUser={currentUser} />}
        />
        <Route path="/battle" element={<Battle currentUser={currentUser} />} />
        <Route
          path="/battle/:id"
          element={
            <BattleScreen currentUser={currentUser} refetchUser={refetchUser} />
          }
        />
        <Route path="/explore/:id" element={<ExploreScreen />} />
      </Routes>
    </>
  );
};

export default AppRouter;
