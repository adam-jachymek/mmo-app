import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { createUser, loginUser, getUser } from "api/endpoints";
import { Button, Loader, TextInput } from "@mantine/core";
import { User } from "/types";

import "./styles.sass";

type Props = {
  refetchUser: () => void;
};

function Login({ refetchUser }: Props) {
  const { mutate: loginValues, isLoading } = useMutation(loginUser, {
    onSuccess: (response) => {
      refetchUser();
    },
  });

  const login = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      loginValues(values);
    },
  });

  return (
    <div className="login">
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
  );
}

export default Login;
