import { useQuery } from "react-query";
import { Navigate, Route, Routes } from "react-router-dom";
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
import Players from "./components/Players";
import Guild from "./components/Guild";
import getToken from "./api/getToken";
import GuildInfo from "./components/Guild/GuildInfo";

const AppRouter = () => {
  const { data: currentUser, refetch: refetchUser } = useQuery(
    "currentUser",
    getUser
  );

  const token = getToken();

  if (token) {
    return (
      <>
        <TopNavBar currentUser={currentUser} refetchUser={refetchUser} />
        <SideNavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/"
            element={
              <Home currentUser={currentUser} refetchUser={refetchUser} />
            }/>
          <Route path="/character" element={<Character />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/items" element={<Items />} />
          <Route path="/admin/maps" element={<Maps />} />
          <Route path="/admin/mobs" element={<Mobs />} />
          <Route path="/players" element={<Players />} />
          <Route
            path="/guild"
            element={
              <Guild currentUser={currentUser} refetchUser={refetchUser} />
            }
          />
          <Route
            path="/guild/:id"
            element={
              <GuildInfo currentUser={currentUser} refetchUser={refetchUser} />
            }
          />
          <Route
            path="/explore"
            element={<Explore currentUser={currentUser} />}
          />
          <Route
            path="/battle"
            element={<Battle currentUser={currentUser} />}
          />
          <Route
            path="/battle/:id"
            element={
              <BattleScreen
                currentUser={currentUser}
                refetchUser={refetchUser}
              />
            }
          />
          <Route path="/explore/:id" element={<ExploreScreen />} />
        </Routes>
      </>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
