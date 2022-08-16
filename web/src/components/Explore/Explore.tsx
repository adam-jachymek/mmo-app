import { useQuery } from "react-query";
import { getMap } from "api/endpoints";
import { User } from "/types";
import classNames from "classnames";
import { Navigate, useNavigate } from "react-router-dom";

import "./styles.sass";

type Props = {
  currentUser: User;
};

const Explore = ({ currentUser }: Props) => {
  const { data: mapData, refetch: refetchMaps } = useQuery("getMap", getMap);

  let navigate = useNavigate();

  return (
    <div className="explore">
      <ul className="explore__map-list">
        {mapData?.map((map: any) => (
          // <a
          //   key={map.id}
          //   href={
          //     map.minLevel <= currentUser?.level ? `/explore/${map.id}` : "#"
          //   }
          // >

          <div
            className="explore__map-element"
            onClick={() => {
              return map.minLevel <= currentUser?.level
                ? navigate(`/explore/${map.id}`)
                : "#";
            }}
          >
            <img
              className="explore__map-img"
              src={`/media/explore/${map?.sprite}.gif`}
            />
            {
              <li
                className={classNames("explore__map-item", {
                  disabled: map.minLevel >= currentUser?.level,
                })}
              >
                {map.name}
                <p className="explore__map-level">
                  <p>Requirements</p>
                  {map.minLevel}
                  <span className="explore__map-level-lvl">LVL</span> -{" "}
                  {map.maxLevel}
                  <span className="explore__map-level-lvl">LVL</span>
                </p>
              </li>
            }
          </div>
          // </a>
        ))}
      </ul>
    </div>
  );
};

export default Explore;
