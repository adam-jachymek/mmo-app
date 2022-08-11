import { GiCrossedSwords, GiCharacter } from "react-icons/gi";
import { TiHomeOutline } from "react-icons/ti";
import { AiOutlineQuestion } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import "./styles.sass";

const SideNavBar = () => {
  let navigate = useNavigate();

  return (
    <div className="navbar">
      <ul className="navbar__ul">
        <li onClick={() => navigate("/")} className="navbar__li">
          <TiHomeOutline /> Home
        </li>
        <li onClick={() => navigate("/character")} className="navbar__li">
          <GiCharacter /> Character
        </li>
        {/* <li onClick={() => navigate("#")} className="navbar__li">
          <AiOutlineQuestion /> Quest
        </li> */}
        <li onClick={() => navigate("/explore")} className="navbar__li">
          <AiOutlineQuestion /> Explore
        </li>
        <li onClick={() => navigate("/battle")} className="navbar__li">
          <GiCrossedSwords /> Battle
        </li>
        <li onClick={() => navigate("/admin")} className="navbar__li">
          Admin
        </li>
        <li onClick={() => navigate("/players")} className="navbar__li">
          Players
        </li>
        <li onClick={() => navigate("/guild")} className="navbar__li">
          Guild
        </li>
      </ul>
    </div>
  );
};

export default SideNavBar;
