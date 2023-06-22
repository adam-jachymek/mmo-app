import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { socket } from "api/socket";
import { Navigate, Route, Routes, redirect } from "react-router-dom";
import { getUser } from "./api/endpoints";
import Admin from "components/Admin";
import SideNavBar from "components/SideNavBar";
import TopNavBar from "components/TopNavBar";
import Battle from "components/Battle";
import BattleScreen from "components/BattleScreen";
import Items from "./components/Admin/sub/Items";
import Maps from "./components/Admin/sub/Maps/Maps";
import Mobs from "./components/Admin/sub/Mobs";
import Explore from "./components/Explore";
import Character from "./components/Character";
import Players from "./components/Players";
import GuildHome from "./components/Guild";
import { getToken, removeToken } from "./api/token";
import GuildInfo from "./components/Guild/GuildInfo";
import { Loader } from "@mantine/core";
import WelcomeScreen from "./components/WelcomeScreen";
import { User } from "./types";
import Spirtes from "./components/Admin/sub/Sprites";
import MapEditor from "./components/Admin/sub/Maps/MapEditor";
import NpcEditor from "./components/Admin/sub/NpcEditor";
import MenuCollapse from "./components/MenuCollapse/MenuCollapse";

const AppRouter = () => {
  const [user, setUser] = useState<User>();
  const token = getToken();

  const {
    isLoading,
    data: currentUser,
    refetch: refetchUser,
    isLoadingError,
  } = useQuery("currentUser", getUser, {
    enabled: Boolean(token),
    retry: 1,
  });

  useEffect(() => {
    currentUser?.id && socket.emit("connectUser", currentUser?.id.toString());
  }, [currentUser?.id]);

  useEffect(() => {
    currentUser?.id &&
      socket.on(`user-${currentUser?.id}`, (response: any) => {
        setUser(response);
      });
  }, [currentUser?.id, socket]);

  if (isLoading) {
    return <Loader />;
  }

  if (isLoadingError) {
    removeToken();
  }

  if (!currentUser || !token) {
    return (
      <Routes>
        <Route path="/" element={<WelcomeScreen refetchUser={refetchUser} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (user?.battleId) {
    return (
      <>
        <TopNavBar
          user={user}
          currentUser={currentUser}
          refetchUser={refetchUser}
        />
        <Routes>
          <Route
            path={`/explore`}
            element={
              <BattleScreen
                propsBattleId={user?.battleId}
                currentUser={currentUser}
                refetchUser={refetchUser}
              />
            }
          />
          <Route path="*" element={<Navigate to={`/explore`} replace />} />
        </Routes>
      </>
    );
  }

  if (currentUser && user) {
    return (
      <>
        <TopNavBar
          user={user}
          currentUser={currentUser}
          refetchUser={refetchUser}
        />
        <SideNavBar />
        <Routes>
          <Route path="/" element={<Explore user={user} />} />
          <Route
            path="/character"
            element={
              <Character
                user={user}
                currentUser={currentUser}
                refetchUser={refetchUser}
              />
            }
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/items" element={<Items />} />
          <Route path="/admin/maps" element={<Maps />} />
          <Route
            path="/admin/maps/editor/:id"
            element={<MapEditor user={user} />}
          />
          <Route path="/admin/mobs" element={<Mobs />} />
          <Route path="/admin/sprites" element={<Spirtes />} />
          <Route path="/admin/npc" element={<NpcEditor />} />
          <Route path="/players" element={<Players />} />
          <Route
            path="/guild"
            element={
              <GuildHome currentUser={currentUser} refetchUser={refetchUser} />
            }
          />
          <Route
            path="/guild/:id"
            element={
              <GuildInfo currentUser={currentUser} refetchUser={refetchUser} />
            }
          />
          <Route path="/explore" element={<Explore user={user} />} />
          <Route
            path="/battle"
            element={<Battle currentUser={currentUser} />}
          />
        </Routes>
        <MenuCollapse />
      </>
    );
  }

  return <div>Something went wrong. Refresh the page.</div>;
};

export default AppRouter;
