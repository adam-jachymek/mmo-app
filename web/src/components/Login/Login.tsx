import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { createUser, loginUser, getUser } from "api/endpoints";
import { Button, Loader, TextInput } from "@mantine/core";
import { User } from "../../types";

import "./styles.sass";

type Props = {
  currentUser: User;
  refetchUser: () => void;
};

function Login({ currentUser, refetchUser }: Props) {
  const { mutate: loginValues, isLoading } = useMutation(loginUser, {
    onSuccess: (response) => {},
  });

  const { mutate: registerValues } = useMutation(createUser, {
    onSuccess: () => {},
  });

  const login = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      loginValues(values);
      refetchUser();
    },
  });

  const register = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
    },
    onSubmit: (values) => {
      registerValues(values);
    },
  });

  return (
    <>
      <div className="login__wrapper">
        <img className="login__logo" src="/media/logo150.png" />
        <div className="login__login">
          <h3>Login</h3>
          <form onSubmit={login.handleSubmit}>
            <TextInput
              label="Email"
              className="login__input"
              name="email"
              onChange={login.handleChange}
              value={login.values.email}
            />
            <TextInput
              label="Password"
              className="login__input"
              type="password"
              name="password"
              onChange={login.handleChange}
              value={login.values.password}
            />
            <Button color="green" type="submit">
              Login
            </Button>
          </form>
        </div>
        <div className="login__register">
          <h3>Create Account</h3>
          <form onSubmit={register.handleSubmit}>
            <TextInput
              label="Email"
              className="login__input"
              name="email"
              onChange={register.handleChange}
              value={register.values.email}
            />
            <TextInput
              label="Username"
              className="login__input"
              type="text"
              name="username"
              onChange={register.handleChange}
              value={register.values.username}
            />
            <TextInput
              label="Password"
              className="login__input"
              type="password"
              name="password"
              onChange={register.handleChange}
              value={register.values.password}
            />
            <Button type="submit">Create Account</Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
