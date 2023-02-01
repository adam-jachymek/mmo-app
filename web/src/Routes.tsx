import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { socket } from "api/socket";
import { Navigate, Route, Routes } from "react-router-dom";
import { getUser } from "./api/endpoints";
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
import GuildHome from "./components/Guild";
import PartyNavBar from "./components/Party";
import { getToken, removeToken } from "./api/token";
import GuildInfo from "./components/Guild/GuildInfo";
import { Loader } from "@mantine/core";
import MobileMenu from "./components/MobileMenu";
import WelcomeScreen from "./components/WelcomeScreen";
import { User } from "./types";

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
        console.log("UserSocket", response);
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

  if (currentUser && user) {
    return (
      <>
        <TopNavBar
          user={user}
          currentUser={currentUser}
          refetchUser={refetchUser}
        />
        <SideNavBar />
        {/* <PartyNavBar /> */}
        <Routes>
          <Route
            path="/"
            element={
              <Home currentUser={currentUser} refetchUser={refetchUser} />
            }
          />
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
          <Route path="/admin/mobs" element={<Mobs />} />
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
          <Route path="/explore/:id" element={<ExploreScreen user={user} />} />
        </Routes>
        <MobileMenu />
      </>
    );
  }

  return <div>Something went wrong. Refresh the page.</div>;
};

export default AppRouter;
