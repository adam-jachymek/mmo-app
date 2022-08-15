import { TextInput, Button } from "@mantine/core";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { socket } from "./api/socket";

const Home = ({ currentUser, refetchUser }) => {
  const [chat, setChat] = useState([]);

  useEffect(() => {
    if (chat.length < 1) {
      socket.emit("findAllMessages", (response) => {
        setChat([...chat, ...response]);
      });
    }
  }, []);

  useEffect(() => {
    socket.on("message", (message) => {
      setChat([...chat, message]);
    });
  });

  const chatFormik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: (values, { resetForm }) => {
      socket.emit("createMessage", { name: currentUser?.username, ...values });
      resetForm();
    },
  });

  const renderChat = () => {
    return chat
      .slice(0)
      .reverse()
      .map(({ name, message }, index) => (
        <div style={{ margin: "15px 0" }} key={index}>
          <span style={{ display: "block", fontSize: "14px" }}>[{name}]</span>
          <span>{message}</span>
        </div>
      ));
  };

  return (
    <div>
      <h2>Chat</h2>
      <form style={{ display: "flex" }} onSubmit={chatFormik.handleSubmit}>
        <TextInput
          name="message"
          style={{ width: "300px", marginRight: "10px" }}
          onChange={chatFormik.handleChange}
          value={chatFormik.values.message}
        />
        <Button type="submit">SEND</Button>
      </form>
      <div style={{ marginTop: "30px" }}>{renderChat()}</div>
    </div>
  );
};

export default Home;
