import { useState } from "react";
import classNames from "classnames";
import { Button, Modal } from "@mantine/core";
import { BiTrash } from "react-icons/bi";
import { useMutation } from "react-query";
import { deleteItem, equipItem } from "api/endpoints";
import ConfirmModal from "../ConfirmModal";

import "./styles.sass";
import { EquipItem } from "/types";

type Props = {
  handleCloseModal: () => void;
  isVisible: boolean;
  item: EquipItem | undefined;
  refetchItems: () => void;
};

const ItemModal = ({
  handleCloseModal,
  isVisible,
  item,
  refetchItems,
}: Props) => {
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
    handleCloseModal();
  };

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
          // tolowercase
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
            handleCloseModal();
          }}
        >
          {item?.equip ? "UNEQUIP" : "EQUIP"}
        </Button>
        {item?.type === "potion" && (
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
