import { useNavigate } from "react-router-dom";
import "./styles.sass";

const MobileMenu = () => {
  let navigate = useNavigate();
  return (
    <div className="mobile-menu">
      <div className="mobile-menu__wrapper">
        <img
          onClick={() => {
            navigate("/character");
          }}
          src="/media/ui/inventory.png"
        />
        <img src="/media/ui/skills.png" />
        <img
          className="mobile-menu__home"
          onClick={() => {
            navigate("/explore");
          }}
          src="/media/ui/menu.png"
        />
        <img src="/media/ui/inventory.png" />
        <img
          src="/media/ui/skills.png"
          onClick={() => {
            navigate("/admin");
          }}
        />
      </div>
    </div>
  );
};

export default MobileMenu;
