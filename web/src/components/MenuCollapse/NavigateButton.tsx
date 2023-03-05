import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

type Props = {
  location: string;
  setMenuCollapse: any;
};

const NavigateButton = ({ location, setMenuCollapse }: Props) => {
  const currentUrl = window.location.href;
  const lastSegment = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);

  let navigate = useNavigate();

  const handleButton = () => {
    setMenuCollapse(false);
    navigate(location);
  };

  if (location !== lastSegment) {
    return (
      <Button
        onClick={() => handleButton()}
        color="gray"
        className="menu__button"
        variant="outline"
      >
        {location.toUpperCase()}
      </Button>
    );
  }

  return null;
};

export default NavigateButton;
