import "./styles.sass";

const MobileMenu = () => {
  return (
    <div className="mobile-menu">
      <div className="mobile-menu__wrapper">
        <img src="/media/ui/inventory.png" />
        <img src="/media/ui/skills.png" />
        <img className="mobile-menu__home" src="/media/ui/menu.png" />
        <img src="/media/ui/inventory.png" />
        <img src="/media/ui/skills.png" />
      </div>
    </div>
  );
};

export default MobileMenu;
