import { User } from "/types";

import "./styles.sass";

type Props = {
  currentUser: User;
};

const CharacterProfile = ({ currentUser }: Props) => {
  return (
    <div className="profile">
      <div>
        <div className="profile__header">
          <img
            className="profile__avatar-img"
            src={`/media/users/${currentUser.avatar}.png`}
          />
          <div className="profile__header-info">
            <span>{currentUser?.username}</span>
            <span>
              {currentUser?.level}
              <span className="profile__header-info-level"> LVL</span>
            </span>
            <span>{currentUser?.guild}</span>
          </div>
        </div>
        <div>Damage: 100 - 149</div>
      </div>
    </div>
  );
};

export default CharacterProfile;
