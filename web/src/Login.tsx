import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { createUser, loginUser, getUser } from "api/endpoints";
import { Button, Loader, TextInput } from "@mantine/core";
import { User } from "./types";

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
      <div className="main__wrapper">
        <h1 className="main__title">MMO-APP alpha</h1>
        <div className="main__login">
          <h3>Login</h3>
          <form onSubmit={login.handleSubmit}>
            <TextInput
              label="Email"
              className="main__input"
              name="email"
              onChange={login.handleChange}
              value={login.values.email}
            />
            <TextInput
              label="Password"
              className="main__input"
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
        <div className="main__register">
          <h3>Create Account</h3>
          <form onSubmit={register.handleSubmit}>
            <TextInput
              label="Email"
              className="main__input"
              name="email"
              onChange={register.handleChange}
              value={register.values.email}
            />
            <TextInput
              label="Password"
              className="main__input"
              type="password"
              name="password"
              onChange={register.handleChange}
              value={register.values.password}
            />
            <TextInput
              label="Username"
              className="main__input"
              type="text"
              name="username"
              onChange={register.handleChange}
              value={register.values.username}
            />
            <Button type="submit">Create Account</Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
