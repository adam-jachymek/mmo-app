import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { createUser, loginUser, getUser } from "./api/endpoints";

function Login() {
  const { mutate: loginValues } = useMutation(loginUser, {
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
    },
  });

  const register = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      registerValues(values);
    },
  });

  return (
    <>
      <h1>MMO-APP</h1>
      <div className="main__login">
        <h3>Login</h3>
        <form onSubmit={login.handleSubmit}>
          <label className="main__label">Email</label>
          <input
            className="main__input"
            name="email"
            onChange={login.handleChange}
            value={login.values.email}
          />
          <label className="main__label">Password</label>
          <input
            className="main__input"
            type="password"
            name="password"
            onChange={login.handleChange}
            value={login.values.password}
          />
          <button type="submit">Login</button>
        </form>
      </div>
      <div className="main__register">
        <h3>Create Account</h3>
        <form onSubmit={register.handleSubmit}>
          <label className="main__label">Email</label>
          <input
            className="main__input"
            name="email"
            onChange={register.handleChange}
            value={register.values.email}
          />
          <label className="main__label">Password</label>
          <input
            className="main__input"
            type="password"
            name="password"
            onChange={register.handleChange}
            value={register.values.password}
          />
          <button type="submit">Create Account</button>
        </form>
      </div>
    </>
  );
}

export default Login;
