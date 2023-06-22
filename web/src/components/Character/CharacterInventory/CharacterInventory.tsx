import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { Item } from "/types";
import { assets_url } from "config";
import { Button, Switch } from "@mantine/core";
import { useMutation } from "react-query";
import { deleteManyItemsByIds } from "api/endpoints";
import ConfirmModal from "components/ConfirmModal";
import { isEmpty } from "lodash";

import "./styles.sass";

const NUMBER_OF_BAG_SLOTS = 5;
const DEFAULT_NUMBER_OF_SLOTS = 10;

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

  console.log("inventory", inventory);

  const allItemsInInventory = inventory?.map((item: Item) => item.id);

  console.log("allItemsInInventory", allItemsInInventory);

  useEffect(() => {
    setMultiItemsIds([]);
  }, [multiSelect]);

  const { mutate: deleteManyItems } = useMutation(deleteManyItemsByIds, {
    onSuccess: (response) => {
      refetchItems();
    },
  });

  const bags = itemsData?.filter(
    (item: Item) => item.itemType === "BAG" && item.equip
  );

  const numberOfExtraSlots = bags.reduce(
    (n: number, item: Item) => n + item.item.actionAmount,
    0
  );

  // migrate to component
  const renderBags = useMemo(() => {
    let items = [];
    for (let i = 0; i < NUMBER_OF_BAG_SLOTS; i++) {
      const bag = bags[i];
      items.push(
        <li
          key={bag?.id}
          onClick={() => {
            bag && openItemModal(bag);
          }}
          className={classNames("inventory__bag", bag?.quality?.toLowerCase())}
        >
          {bag && (
            <img
              alt="bag-sprite"
              src={`${assets_url}/${bag.sprite}`}
              className="inventory__bag-icon"
            />
          )}
        </li>
      );
    }
    return items;
  }, [bags, openItemModal]);

  const numberOfSlots = DEFAULT_NUMBER_OF_SLOTS + numberOfExtraSlots;

  // migrate to component
  const renderSlots = useMemo(() => {
    let items = [];
    for (let i = 0; i < numberOfSlots; i++) {
      const inventoryItem = inventory[i];
      items.push(
        <li
          key={inventoryItem?.id}
          onClick={() => {
            if (multiSelect && inventoryItem) {
              if (!multiItemsIds.includes(inventoryItem?.id)) {
                setMultiItemsIds([...multiItemsIds, inventoryItem?.id]);
                return;
              } else {
                setMultiItemsIds(
                  multiItemsIds.filter((item) => item !== inventoryItem?.id)
                );
                return;
              }
            }
            inventoryItem && openItemModal(inventoryItem);
          }}
          className={classNames(
            "inventory__item",
            inventoryItem?.quality?.toLowerCase(),
            {
              "inventory__item-selected": multiItemsIds.includes(
                inventoryItem?.id
              ),
            }
          )}
        >
          {inventoryItem && (
            <img
              alt="item-icon"
              src={`${assets_url}/${inventoryItem.sprite}`}
              className="inventory__item-icon"
            />
          )}
        </li>
      );
    }

    return items;
  }, [inventory, multiItemsIds, multiSelect, numberOfSlots, openItemModal]);

  return (
    <>
      <div className="inventory__wrapper-list">
        <ul className="inventory__bag-list">{renderBags}</ul>
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
        <ul className="inventory__items-list">{renderSlots}</ul>
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
