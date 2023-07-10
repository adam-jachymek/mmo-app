import { useEffect, useState } from "react";
import { Item } from "/types";
import { Button, Switch } from "@mantine/core";
import { useMutation } from "react-query";
import { deleteManyItemsByIds } from "api/endpoints";
import ConfirmModal from "components/ConfirmModal";
import { isEmpty } from "lodash";
import BagsSlots from "./BagsSlots";
import ItemsSlots from "./ItemsSlots";

import "./styles.sass";

type Props = {
  itemsData: Item[];
  openItemModal: (item: Item) => void;
  refetchItems: any;
};

const CharacterInventory = ({
  itemsData,
  openItemModal,
  refetchItems,
}: Props) => {
  const [multiSelect, setMultiSelect] = useState<boolean>(false);
  const [multiItemsIds, setMultiItemsIds] = useState<number[]>([]);
  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);

  const inventory = itemsData?.filter((item: Item) => !item.equip);

  const allItemsInInventory = inventory?.map((item: Item) => item.id);

  useEffect(() => {
    setMultiItemsIds([]);
  }, [multiSelect]);

  const { mutate: deleteManyItems } = useMutation(deleteManyItemsByIds, {
    onSuccess: (response) => {
      refetchItems();
    },
  });

  return (
    <>
      <div className="inventory__wrapper-list">
        <BagsSlots openItemModal={openItemModal} itemsData={itemsData} />
        <div className="inventory__panel">
          <Switch
            label="Multi Select"
            radius="md"
            color="rgba(0, 0, 0, 0.3)"
            onChange={(e) => setMultiSelect(e.target.checked)}
          />
          {multiSelect && (
            <Button
              onClick={() => setMultiItemsIds(allItemsInInventory)}
              compact
              style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
              variant="outline"
              color="blue"
            >
              Select All
            </Button>
          )}
          {!isEmpty(multiItemsIds) && (
            <Button
              onClick={() => setDeleteModalIsVisible(true)}
              compact
              style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
              variant="outline"
              color="red"
            >
              Delete
            </Button>
          )}
        </div>
        <ItemsSlots
          itemsData={itemsData}
          inventory={inventory}
          multiSelect={multiSelect}
          multiItemsIds={multiItemsIds}
          setMultiItemsIds={setMultiItemsIds}
          openItemModal={openItemModal}
        />
      </div>
      <ConfirmModal
        isVisible={deleteModalIsVisible}
        title={`Do you want to delete ${multiItemsIds.length} items?`}
        onConfirmAction={() => {
          deleteManyItems(multiItemsIds);
        }}
        onCancelAction={() => {
          setDeleteModalIsVisible(false);
        }}
      />
    </>
  );
};

export default CharacterInventory;
