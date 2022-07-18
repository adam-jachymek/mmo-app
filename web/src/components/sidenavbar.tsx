import { GiCrossedSwords, GiCharacter } from "react-icons/gi";
import { TiHomeOutline } from "react-icons/ti";
import { AiOutlineQuestion } from "react-icons/ai";

const SideNavBar = () => {
  return (
    <div className="player__navbar">
      <ul className="player__navbar-ul">
        <li className="player__navbar-li">
          <a href="#"></a> <TiHomeOutline /> Home
        </li>
        <li className="player__navbar-li">
          <a href="#"></a> <GiCharacter /> Character Profile
        </li>
        <li className="player__navbar-li">
          <a href="#"></a> <AiOutlineQuestion /> Quest
        </li>
        <li className="player__navbar-li">
          <a href="#"></a> <GiCrossedSwords /> Battle
        </li>
      </ul>
    </div>
  );
};

export default SideNavBar;
