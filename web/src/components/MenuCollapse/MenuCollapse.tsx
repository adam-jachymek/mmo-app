import { Button, Collapse } from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineExplore, MdOutlineInventory2, MdMenu } from "react-icons/md";
import { ImMenu3 } from "react-icons/im";
import { TiArrowDownOutline } from "react-icons/ti";

import "./styles.sass";

const MenuCollapse = () => {
  const [menuCollapse, setMenuCollapse] = useState(false);

  let navigate = useNavigate();

  const handleButton = (url: string) => {
    setMenuCollapse(false);
    navigate(url);
  };

  return (
    <div className="menu">
      <button
        onClick={() => setMenuCollapse(!menuCollapse)}
        className="menu__menu-button"
        color="#000"
      >
        <span
          style={{ fontSize: "15px", fontWeight: "bold", color: "#C1C2C5" }}
        >
          MENU
        </span>
        <ImMenu3 size="23px" color="#C1C2C5" />
      </button>
      <Collapse in={menuCollapse}>
        <div className="menu__wrapper">
          <Button
            onClick={() => handleButton("explore")}
            color="gray"
            className="menu__button"
            variant="outline"
            leftIcon={<MdOutlineExplore size="20px" />}
          >
            EXPLORE
          </Button>
          <Button
            onClick={() => handleButton("character")}
            color="gray"
            className="menu__button"
            variant="outline"
            leftIcon={<MdOutlineInventory2 size="20px" />}
          >
            INVENTORY
          </Button>
        </div>
      </Collapse>
    </div>
  );
};

export default MenuCollapse;
