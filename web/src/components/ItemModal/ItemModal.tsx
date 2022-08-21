import { Button, Modal } from "@mantine/core";
import classNames from "classnames";
import { useMutation, useQuery } from "react-query";
import { deleteItem, equipItem, getItems } from "api/endpoints";
import { EquipItem } from "/types";

type Props = {
  item: any;
  openItem: boolean;
  setOpenItem: (arg: boolean) => void;
  refetchItems: () => void;
};

const ItemModal = ({ item, openItem, setOpenItem, refetchItems }: Props) => {
  const { mutate: equipThisItem } = useMutation(equipItem, {
    onSuccess: (response) => {
      refetchItems();
    },
  });

  const { mutate: deleteThis } = useMutation(deleteItem, {
    onSuccess: (response) => {
      refetchItems();
    },
  });

  return (
    <Modal
      classNames={{ root: "player__modal" }}
      centered
      withCloseButton={false}
      opened={openItem}
      onClose={() => {
        setOpenItem(false);
      }}
    >
      <img
        src={`/media/items/${item?.sprite}.png`}
        className="player__modal-icon"
      />
      <h3>{item?.name}</h3>
      <h4>{item?.level} lvl</h4>
      <h4
        className={classNames(
          {
            uncommon: item?.quality === "UNCOMMON",
          },
          {
            rare: item?.quality === "RARE",
          },
          {
            epic: item?.quality === "EPIC",
          },
          {
            legendary: item?.quality === "LEGENDARY",
          }
        )}
      >
        {item?.quality}
      </h4>
      {item?.type === "WEAPON" && (
        <p>
          Attack: {item?.minAttack} - {item?.maxAttack}
        </p>
      )}
      {item?.type === "HEAD" && (
        <div>
          <p>Stamina: {item?.stamina}</p>
          <p>Defence: {item?.defence}</p>
        </div>
      )}
      <div className="player__modal-buttons">
        {item?.isEquipment && (
          <Button
            variant="outline"
            color="lime"
            onClick={() => {
              equipThisItem(item?.id);
              setOpenItem(false);
            }}
          >
            {item?.equip ? "UNEQUIP" : "EQUIP"}
          </Button>
        )}
        {item?.type === "potion" && (
          <Button
            variant="outline"
            color="lime"
            onClick={() => {
              setOpenItem(false);
            }}
          >
            USE
          </Button>
        )}
        <Button
          onClick={() => deleteThis(item?.id)}
          variant="outline"
          color="red"
          uppercase
        >
          Remove
        </Button>
        <Button
          onClick={() => {
            setOpenItem(false);
          }}
          variant="outline"
          color="gray"
          uppercase
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ItemModal;
