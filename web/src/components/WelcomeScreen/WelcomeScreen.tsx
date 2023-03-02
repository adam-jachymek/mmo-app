import { Button } from "@mantine/core";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

import "./styles.sass";

type Props = {
  refetchUser: () => void;
};

const WelcomeScreen = ({ refetchUser }: Props) => {
  const [isRegister, setRegister] = useState(false);

  const form = () => {
    if (isRegister) {
      return <Register refetchUser={refetchUser} />;
    } else {
      return <Login refetchUser={refetchUser} />;
    }
  };

  return (
    <div className="welcome">
      <img
        alt="welcome-logo"
        className="welcome__logo"
        src="/media/logo150.png"
      />
      {form()}
      {!isRegister ? (
        <Button onClick={() => setRegister(true)} type="submit">
          Create Account
        </Button>
      ) : (
        <Button type="button" onClick={() => setRegister(false)}>
          Back to login
        </Button>
      )}
    </div>
  );
};

export default WelcomeScreen;
