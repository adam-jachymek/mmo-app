import { Button } from "@mantine/core";
import classNames from "classnames";

type Props = {
  showStats: boolean;
  setShowStats: (arg: boolean) => void;
};

const CharacterMenu = ({ showStats, setShowStats }: Props) => {
  return (
    <div className="character__menu">
      <Button
        className={classNames("character__button", { active: !showStats })}
        onClick={() => {
          setShowStats(false);
        }}
        variant="outline"
        color="gray"
      >
        Inventory
      </Button>
      <Button
        className={classNames("character__button", { active: showStats })}
        onClick={() => {
          setShowStats(true);
        }}
        variant="outline"
        color="gray"
      >
        Stats
      </Button>
    </div>
  );
};

export default CharacterMenu;
