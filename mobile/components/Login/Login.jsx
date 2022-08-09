import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { loginUser, createUser } from "../../api/endpoints";
import { Formik } from "formik";

const Login = () => {

  const { mutate: loginValues } = useMutation(loginUser, {
    onSuccess: (response) => {
      console.log("response", response)
    },
    onError: (response) => {
      console.log("error", response)
    }
  });

  const { mutate: registerValues } = useMutation(createUser, {
    onSuccess: () => {},
  });


  return (
    <View>
      <View>
        <Text style={styles.title}>Login</Text>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => {
            loginValues(values)
            console.log(values)
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <TextInput
                style={styles.input}
                placeholder="email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              <TextInput
                style={styles.input}
                placeholder="password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry={true}
              />
              <Button style={styles.button} onPress={handleSubmit} title="Login" />
            </View>
          )}
        </Formik>
      </View>
      <View>
        <Text style={styles.registerTitle}>Register</Text>
        <Formik
          initialValues={{ email: "", password: "", username: "" }}
          onSubmit={(values) => registerValues(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <TextInput
                style={styles.input}
                placeholder="email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                placeholderTextColor="#fff"

              />
              <TextInput
                style={styles.input}
                placeholder="username"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
                placeholderTextColor="#fff"

              />
              <TextInput
                style={styles.input}
                placeholder="password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry={true}
                placeholderTextColor="#fff"

              />
              <Button style={styles.button} onPress={handleSubmit} title="Register" />
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: "center",
    color: "#fff"
  },

  registerTitle: {
    marginTop: 50,
    fontSize: 20,
    textAlign: "center",
    color: "#fff"
  },

  input: {
    padding: 5,
    borderRadius: 10,
    width: 200,
    borderColor: "grey",
    borderWidth: 1,
    marginTop: 10,
    color: "#fff",
  },

  button: {
    margin: 20,
    backgroundColor: "#000",
    borderColor: '#fff'
  },
});

export default Login;
