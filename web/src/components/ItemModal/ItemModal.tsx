import { useState } from "react";
import classNames from "classnames";
import { Button, Modal } from "@mantine/core";
import { BiTrash } from "react-icons/bi";
import { useMutation } from "react-query";
import { deleteItem, equipItem, getItems } from "api/endpoints";
import ConfirmModal from "../ConfirmModal";

import "./styles.sass";

type Props = {
  item: any;
  openItem: boolean;
  setOpenItem: (arg: boolean) => void;
  refetchItems: () => void;
};

const ItemModal = ({ item, openItem, setOpenItem, refetchItems }: Props) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
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

  const toggleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const handleDeleteItem = () => {
    deleteThis(item?.id);
    setOpenItem(false);
  };

  return (
    <Modal
      classNames={{ modal: "modal" }}
      centered
      withCloseButton={false}
      opened={openItem}
      overlayOpacity={0.55}
      overlayBlur={3}
      closeOnClickOutside={false}
      onClose={() => {
        setOpenItem(false);
      }}
    >
      <div className="modal__delete">
        <Button
          onClick={toggleDeleteModal}
          variant="outline"
          color="red"
          uppercase
        >
          <BiTrash />
        </Button>
      </div>
      <img src={`/media/items/${item?.sprite}.png`} className="modal__icon" />
      <div className="modal__info">
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
      </div>
      <div className="modal__buttons">
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
          onClick={() => {
            setOpenItem(false);
          }}
          variant="outline"
          color="gray"
          uppercase
        >
          Close
        </Button>
        <ConfirmModal
          isVisible={openDeleteModal}
          title="Do you want delete this item?"
          onConfirmAction={handleDeleteItem}
          onCancelAction={toggleDeleteModal}
        />
      </div>
    </Modal>
  );
};

export default ItemModal;
