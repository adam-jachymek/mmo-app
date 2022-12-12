import { useState } from "react";
import { Button, Loader, TextInput } from "@mantine/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import { useMutation } from "react-query";
import { createUser } from "api/endpoints";

import "./styles.sass";

type Props = {
  refetchUser: () => void;
};

const Register = ({ refetchUser }: Props) => {
  const [avatar, setAvatar] = useState("");

  const { mutate: registerValues } = useMutation(createUser, {
    onSuccess: () => {
      refetchUser();
    },
  });

  const SignupSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    username: Yup.string()
      .min(3, "Too Short!")
      .max(15, "Too Long!")
      .required("Required")
      .matches(
        /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/g,
        "Name can only contain letters."
      ),
    password: Yup.string()
      .required("Password is required")
      .min(10, "Minimum 10 characters!"),
    passwordConfirmation: Yup.string()
      .required("Please retype your password.")
      .oneOf([Yup.ref("password")], "Your passwords do not match."),
  });

  const register = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      passwordConfirmation: "",
      avatar: "",
    },
    validationSchema: SignupSchema,

    onSubmit: (values) => {
      const submitValues = { ...values, avatar: avatar };
      registerValues(submitValues);
    },
  });

  return (
    <div className="register">
      <h3>Create Account</h3>
      <form onSubmit={register.handleSubmit}>
        <TextInput
          label="Email"
          className="register__input"
          name="email"
          onChange={register.handleChange}
          value={register.values.email}
        />
        {register.touched.email && register.errors.email && (
          <div className="register__error">{register.errors.email}</div>
        )}
        <TextInput
          label="Password"
          className="register__input"
          type="password"
          name="password"
          onChange={register.handleChange}
          value={register.values.password}
        />
        {register.touched.password && register.errors.password && (
          <div className="register__error">{register.errors.password}</div>
        )}
        <TextInput
          label="Password Confirmation"
          className="register__input"
          type="password"
          name="passwordConfirmation"
          onChange={register.handleChange}
          value={register.values.passwordConfirmation}
        />
        {register.touched.passwordConfirmation &&
          register.errors.passwordConfirmation && (
            <div className="register__error">
              {register.errors.passwordConfirmation}
            </div>
          )}
        <TextInput
          label="Username"
          className="register__input"
          type="text"
          name="username"
          onChange={register.handleChange}
          value={register.values.username}
        />
        {register.touched.username && register.errors.username && (
          <div className="register__error">{register.errors.username}</div>
        )}
        <h2 className="register__avatar">Choose your avatar</h2>
        <div className="register__avatars">
          <img
            className={classNames({ register__border: avatar === "male" })}
            onClick={() => {
              setAvatar("male");
            }}
            src="/media/avatars/male.png"
          />
          <img
            className={classNames({ register__border: avatar === "female" })}
            onClick={() => {
              setAvatar("female");
            }}
            src="/media/avatars/female.png"
          />
        </div>
        <Button type="submit" color="green">
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default Register;
