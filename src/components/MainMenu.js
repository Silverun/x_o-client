import { useContext, useEffect, useRef, useState } from "react";
import socket from "../api/io";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

const MainMenu = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [users, setUsers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [invitation, setInvitation] = useState({});
  const navigate = useNavigate();
  // const { users } = useContext();
  // const currentUserName = localStorage.getItem("user");
  const sessionID = localStorage.getItem("sessionID");

  useEffect(() => {
    // console.log("Effect ran");
    if (sessionID) {
      console.log(sessionID, "sesId Ran");
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
    socket.on("user_connected", (newUser) => {
      console.log(newUser);
    });
    // socket.on("user_disconnected", (id) => {
    //   setUsers((prev) => prev.filter((user) => user.userID !== id));
    // });
    socket.on("game_invitation", ({ from, by }) => {
      setShowInvite(true);
      setInvitation({ from, by });
      console.log("invited by", from);
    });

    socket.on("game_accepted", () => {
      navigate("/game");
    });

    return () => {
      // console.log("unmouted listeners removed");
      socket.removeAllListeners();
    };
  }, []);

  const exitLobbyHandler = () => {
    socket.disconnect();
    localStorage.clear();
    navigate("/");
  };

  const invitePlayerHandler = (id) => {
    console.log(id);
    socket.emit("invite_player", id);
  };

  const closeInviteHandler = () => {
    setShowInvite(false);
  };

  const acceptInviteHandler = () => {
    socket.emit("join_room", invitation.from);
    navigate("/game");
  };

  return (
    <Container>
      <Modal show={showInvite} onHide={closeInviteHandler}>
        <Modal.Body>{invitation.by} invited you for a game!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeInviteHandler}>
            Deny
          </Button>
          <Button variant="primary" onClick={acceptInviteHandler}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>

      <Button onClick={exitLobbyHandler}>Exit lobby</Button>
      <h3>{isConnected ? "Online" : "Offline"}</h3>
      <h3>Online Players</h3>
      <ListGroup>
        {users.map((user) => (
          <ListGroup.Item key={user.userID}>
            {user.username}
            <Button
              hidden={socket.userID === user.userID}
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
