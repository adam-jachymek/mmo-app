import classNames from "classnames";
import {
  GiDrippingSword,
  GiAbdominalArmor,
  GiShardSword,
  GiVikingHead,
  GiBorderedShield,
  GiBoots,
  GiArmoredPants,
} from "react-icons/gi";

type Props = {
  itemsData: any;
  openItemModal: (item: any) => void;
};

const CharacterEq = ({ itemsData, openItemModal }: Props) => {
  return (
    <div className="player__eq">
      <span className="player__eq-armor">
        <GiAbdominalArmor className="player__eq-icon" />
      </span>
      <span className="player__eq-head">
        {itemsData?.map(
          (item: any) =>
            item.equip &&
            item.type === "HEAD" && (
              <div
                onClick={() => {
                  openItemModal(item);
                }}
              >
                <img
                  src={`/media/items/${item.item.sprite}.png`}
                  className={classNames(
                    "player__item-icon",
                    {
                      uncommon: item.quality === "UNCOMMON",
                    },
                    {
                      rare: item.quality === "RARE",
                    },
                    {
                      epic: item.quality === "EPIC",
                    },
                    {
                      legendary: item.quality === "LEGENDARY",
                    }
                  )}
                />
              </div>
            )
        )}
      </span>
      <span className="player__eq-leftarm">
        <GiBorderedShield className="player__eq-icon" />
      </span>
      <span className="player__eq-rightarm">
        {itemsData?.map(
          (item: any) =>
            item.equip &&
            item.type === "WEAPON" && (
              <div
                onClick={() => {
                  openItemModal(item);
                }}
              >
                <img
                  src={`/media/items/${item.item.sprite}.png`}
                  className="player__item-icon"
                />
              </div>
            )
        )}
      </span>
      <span className="player__eq-legs">
        <GiArmoredPants className="player__eq-icon" />
      </span>
      <span className="player__eq-boots">
        <GiBoots className="player__eq-icon" />
      </span>
    </div>
  );
};

export default CharacterEq;
