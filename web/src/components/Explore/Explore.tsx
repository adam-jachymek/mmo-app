import { useQuery } from "react-query";
import { getMap } from "api/endpoints";
import { User } from "/types";
import classNames from "classnames";

import "./styles.sass";

type Props = {
  currentUser: User;
};

const Explore = ({ currentUser }: Props) => {
  const { data: mapData, refetch: refetchMaps } = useQuery("getMap", getMap);

  return (
    <div className="explore">
      <ul className="explore__map-list">
        {mapData?.map((map: any) => (
          <a
            key={map.id}
            href={
              map.minLevel <= currentUser.level ? `/explore/${map.id}` : "#"
            }
          >
            <li
              className={classNames("explore__map-item", {
                disabled: map.minLevel >= currentUser.level,
              })}
            >
              {map.name}
              <p className="explore__map-level">
                {map.minLevel}
                <span className="explore__map-level-lvl">LVL</span> -{" "}
                {map.maxLevel}
                <span className="explore__map-level-lvl">LVL</span>
              </p>
            </li>
          </a>
        ))}
      </ul>
    </div>
  );
};

export default Explore;
function user(user: any) {
  throw new Error("Function not implemented.");
}
