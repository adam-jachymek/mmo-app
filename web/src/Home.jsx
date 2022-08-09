import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io(`${process.env.REACT_APP_API}`);

const Home = ({ currentUser, refetchUser }) => {
  const [chat, setChat] = useState([]);
  const [joined, setJoined] = useState(false)

  // useEffect(() => {
  //   socket.on("message", ({ name, message }) => {
  //     setChat([...chat, { name, message }]);
  //   });
  // });

  useEffect(() => {
    setChat([])
    socket.emit("findAllMessages", (response) => {
      setChat([...chat, ...response]);
    });
  }, []);

  useEffect(() => {
    socket.on("message", (message) => {
      setChat([...chat, message]);
    });
  });

  const join = () => {
    socket.emit('join', {name: currentUser?.username}, () => {
      setJoined(true)
    })
  }

  const chatFormik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: (values, { resetForm }) => {
      socket.emit("createMessage", {name: currentUser?.username, ...values});
      resetForm()
    },
  });

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <p key={index}>
        {name}: <span>{message}</span>
      </p>
    ));
  };

  return (
    <div>
      <h1>Chat</h1>
      <button onClick={join}>Join chat</button>
      <form onSubmit={chatFormik.handleSubmit}>
        <input
          name="message"
          onChange={chatFormik.handleChange}
          value={chatFormik.values.message}
        />
        <button type="submit">Send message</button>
      </form>
      <div style={{marginTop: "50px"}}>
        {renderChat()}
      </div>
    </div>
  );
};

export default Home;
