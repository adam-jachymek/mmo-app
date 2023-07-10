import { useMemo, useState } from "react";
import { Button, Modal } from "@mantine/core";
import { BiTrash } from "react-icons/bi";
import { useMutation } from "react-query";
import { deleteItem, equipItem } from "api/endpoints";
import { Item, User } from "/types";
import ConfirmModal from "../ConfirmModal";
import { socket } from "api/socket";
import { assets_url } from "config";

import "./styles.sass";

type Props = {
  handleCloseModal: () => void;
  isVisible: boolean;
  item: Item | undefined;
  refetchItems: () => void;
  user?: User;
  hideAction?: boolean;
};

const ItemModal = ({
  handleCloseModal,
  isVisible,
  item,
  refetchItems,
  user,
  hideAction,
}: Props) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { mutate: equipThisItem } = useMutation(equipItem, {
    onSuccess: (response) => {
      refetchItems();
      socket.emit("updateUser", { userId: user?.id });
    },
  });

  const { mutate: deleteThisItem } = useMutation(deleteItem, {
    onSuccess: (response) => {
      refetchItems();
    },
  });

  const toggleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const handleDeleteItem = () => {
    deleteThisItem(item?.id);
    handleCloseModal();
  };

  const itemStats = useMemo(() => {
    if (item) {
      return [
        { name: "Stamina", value: item.stamina },
        { name: "Defence", value: item.defence },
        { name: "Strenght", value: item.strength },
        { name: "Dexterity", value: item.dexterity },
        { name: "Intelligence", value: item.intelligence },
      ];
    }

    return null;
  }, [item]);

  if (!item) {
    return null;
  }

  return (
    <Modal
      classNames={{ modal: "modal" }}
      centered
      withCloseButton={false}
      opened={isVisible}
      overlayOpacity={0.55}
      overlayBlur={3}
      closeOnClickOutside={false}
      onClose={handleCloseModal}
    >
      <div className="modal__delete">
        {!hideAction && (
          <Button
            onClick={toggleDeleteModal}
            variant="outline"
            color="red"
            uppercase
          >
            <BiTrash />
          </Button>
        )}
      </div>
      <img src={`${assets_url}/${item.sprite}`} className="modal__icon" />
      <div className="modal__info">
        <h3>{item.name}</h3>
        {item.actionAmount && <h4>SLOTS: {item.actionAmount}</h4>}
        {item.quality && (
          <h4 className={item.quality.toLowerCase()}>{item.quality}</h4>
        )}
        <div className="modal__stats">
          {item.minAttack && (
            <p>
              Attack: {item.minAttack} - {item.maxAttack}
            </p>
          )}
          {itemStats?.map(
            (stat: { name: string; value: number }) =>
              stat.value && (
                <p key={stat.name}>
                  {stat.name}: {stat.value}
                </p>
              )
          )}
        </div>
      </div>
      <div className="modal__buttons">
        {!hideAction && (
          <Button
            variant="outline"
            color="lime"
            onClick={() => {
              equipThisItem(item.id);
              handleCloseModal();
            }}
          >
            {item.equip ? "UNEQUIP" : "EQUIP"}
          </Button>
        )}
        {item.type === "POTION" && (
          <Button variant="outline" color="lime" onClick={handleCloseModal}>
            USE
          </Button>
        )}
        <Button
          onClick={handleCloseModal}
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
