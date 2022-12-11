import { Modal, Button } from "@mantine/core";

type Props = {
  isVisible: boolean;
  title: string;
  onCancelAction: () => void;
  onConfirmAction: () => void;
};

const ConfirmModal = ({
  isVisible,
  title,
  onConfirmAction,
  onCancelAction,
}: Props) => {
  return (
    <Modal opened={isVisible} onClose={onCancelAction} title={title}>
      <Button color="green" onClick={onConfirmAction}>
        CONFIRM
      </Button>
      <Button
        style={{ marginLeft: "20px" }}
        color="red"
        onClick={onCancelAction}
      >
        CANCEL
      </Button>
    </Modal>
  );
};

export default ConfirmModal;
