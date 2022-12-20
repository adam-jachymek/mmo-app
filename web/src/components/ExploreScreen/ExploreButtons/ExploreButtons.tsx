import "./styles.sass";

type Props = {
  user: any;
  setUser: any;
};

const ExploreButtons = ({ user, setUser }: Props) => {
  return (
    <div className="explore-buttons">
      <div className="explore-buttons__wrapper">
        <button
          className="explore-buttons__left"
          onClick={() => {
            setUser({
              ...user,
              x: user.x - 1,
            });
          }}
        >
          <img src="/media/explore/joystick-arrow-left.svg" />
        </button>
        <button
          className="explore-buttons__right"
          onClick={() => {
            setUser({
              ...user,
              x: user.x + 1,
            });
          }}
        >
          <img src="/media/explore/joystick-arrow-right.svg" />
        </button>
        <button
          className="explore-buttons__down"
          onClick={() => {
            setUser({
              ...user,
              y: user.y + 1,
            });
          }}
        >
          <img src="/media/explore/joystick-arrow-down.svg" />
        </button>
        <button
          className="explore-buttons__up"
          onClick={() => {
            setUser({
              ...user,
              y: user.y - 1,
            });
          }}
        >
          <img src="/media/explore/joystick-arrow-up.svg" />
        </button>
      </div>
    </div>
  );
};

export default ExploreButtons;
