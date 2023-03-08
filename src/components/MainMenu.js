import { useEffect, useRef, useState } from "react";
import socket from "../api/io";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

const MainMenu = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [users, setUsers] = useState([]);
  const currentUserName = localStorage.getItem("user");
  const sessionID = localStorage.getItem("sessionID");

  useEffect(() => {
    console.log("Effect ran");

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("users", (users) => {
      console.log(users);
      setUsers(users);
    });

    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
    });

    socket.on("user_connected", (user) => {
      setUsers((prev) => [...prev, user]);
    });

    socket.on("game_invitation", ({ from }) => {
      console.log("invited by", from);
    });
  }, []);

  const invitePlayerHandler = (id) => {
    socket.emit("invite_player", id);
  };

  //   useEffect(() => {
  //     socket.on("connect", () => {
  //       setIsConnected(true);
  //       console.log("socket.connected", socket.connected);
  //     });
  //     socket.on("disconnect", () => {
  //       setIsConnected(false);
  //     });
  //     socket.on("back_message", (data) => {
  //       console.log(data);
  //       setMessage(data);
  //     });

  //     return () => {
  //       socket.off("connect");
  //       socket.off("disconnect");
  //     };
  //   }, []);

  return (
    <Container>
      <h3>
        {currentUserName} {isConnected ? "Online" : "Offline"}
      </h3>
      <h3>Online Players</h3>
      <ListGroup>
        {users.map((user) => (
          <ListGroup.Item key={user.userID}>
            {user.username}
            <Button
              hidden={currentUserName === user.username}
              onClick={() => invitePlayerHandler(user.userID)}
              className="ms-3"
            >
              Invite
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default MainMenu;
