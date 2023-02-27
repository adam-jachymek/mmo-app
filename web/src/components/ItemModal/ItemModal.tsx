import { useState } from "react";
import { Button, Modal } from "@mantine/core";
import { BiTrash } from "react-icons/bi";
import { useMutation } from "react-query";
import { deleteItem, equipItem } from "api/endpoints";
import { EquipItem, User } from "/types";
import ConfirmModal from "../ConfirmModal";
import { socket } from "api/socket";
import { assets_url } from "config";

import "./styles.sass";

type Props = {
  handleCloseModal: () => void;
  isVisible: boolean;
  item: EquipItem | undefined;
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
      <img src={`${assets_url}/${item?.sprite}`} className="modal__icon" />
      <div className="modal__info">
        <h3>{item?.name}</h3>
        <h4>{item?.level} lvl</h4>
        <h4 className={item?.quality?.toLowerCase()}>{item?.quality}</h4>
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
        {!hideAction && (
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
        )}
        {item?.type === "POTION" && (
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
