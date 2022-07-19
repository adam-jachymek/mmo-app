import { GiCrossedSwords, GiCharacter } from "react-icons/gi";
import { TiHomeOutline } from "react-icons/ti";
import { AiOutlineQuestion } from "react-icons/ai";

import "./styles.sass";

const SideNavBar = () => {
  return (
    <div className="navbar">
      <ul className="navbar__ul">
        <li className="navbar__li">
          <a href="/">
            <TiHomeOutline /> Home
          </a>
        </li>
        <li className="navbar__li">
          <a href="#">
            <GiCharacter /> Character Profile
          </a>
        </li>
        <li className="navbar__li">
          <a href="#">
            <AiOutlineQuestion /> Quest
          </a>
        </li>
        <li className="navbar__li">
          <a href="/battle">
            <GiCrossedSwords /> Battle
          </a>
        </li>
        <li className="navbar__li">
          <a href="/admin"> Admin</a>
        </li>
      </ul>
    </div>
  );
};

export default SideNavBar;
