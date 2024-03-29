import { GiCrossedSwords, GiCharacter } from "react-icons/gi";
import { AiOutlineQuestion } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "./styles.sass";

const SideNavBar = () => {
  const [sidebar, setSidebar] = useState(true);

  const showSidebar = () => setSidebar(!sidebar);
  let navigate = useNavigate();

  return (
    <div>
      {sidebar ? (
        <div className="navbar">
          <img src="/media/logo150.png" />
          <ul className="navbar__ul">
            <li onClick={() => navigate("/explore")} className="navbar__li">
              <AiOutlineQuestion /> Explore
            </li>
            <li onClick={() => navigate("/character")} className="navbar__li">
              <GiCharacter /> Character
            </li>
            <li onClick={() => navigate("/guild")} className="navbar__li">
              Guild
            </li>
          </ul>
          <ul className="navbar__ul">
            Admin
            <li onClick={() => navigate("/admin/maps")} className="navbar__li">
              Maps
            </li>
            <li onClick={() => navigate("/battle")} className="navbar__li">
              <GiCrossedSwords /> Battle
            </li>
            <li onClick={() => navigate("/admin/mobs")} className="navbar__li">
              Mobs
            </li>
            <li onClick={() => navigate("/admin/items")} className="navbar__li">
              Items
            </li>
            <li
              onClick={() => navigate("/admin/sprites")}
              className="navbar__li"
            >
              Map Sprites
            </li>
            <li onClick={() => navigate("/admin/npc")} className="navbar__li">
              Npc
            </li>
            <li onClick={() => navigate("/players")} className="navbar__li">
              Players
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default SideNavBar;
