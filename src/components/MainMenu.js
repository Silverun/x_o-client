import { useContext, useEffect, useRef, useState } from "react";
import socket from "../api/io";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";

const MainMenu = () => {
  const [users, setUsers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [invitation, setInvitation] = useState({});
  const navigate = useNavigate();
  const sessionID = localStorage.getItem("sessionID");

  useEffect(() => {
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }
    socket.on("users", (users) => {
      setUsers(users);
    });
    socket.on("session", ({ sessionID, userID }) => {
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      socket.userID = userID;
    });
    socket.on("user_connected", (newUser) => {});
    socket.on("user_disconnected", (id) => {});
    socket.on("game_invitation", ({ from, by }) => {
      setShowInvite(true);
      setInvitation({ from, by });
    });
    socket.on("game_accepted", () => {
      navigate(`/game/${socket.userID}`);
    });
    return () => {
      socket.removeAllListeners();
    };
  }, []);

  const invitePlayerHandler = (id) => {
    socket.emit("invite_player", id);
  };

  const closeInviteHandler = () => {
    setShowInvite(false);
  };

  const acceptInviteHandler = () => {
    socket.emit("join_room", invitation.from);
    navigate(`/game/${invitation.from}`);
  };

  return (
    <Container>
      <Modal
        style={{ maxWidth: 400 }}
        className="text-center"
        show={showInvite}
        onHide={closeInviteHandler}
      >
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
      <Container fluid="sm">
        <h3>Players</h3>
        <ListGroup className="mt-3">
          {users
            .sort((a, b) => b.connected - a.connected)
            .map((user) => (
              <ListGroup.Item
                className="d-flex justify-content-between align-items-center"
                style={{ maxWidth: "50%" }}
                key={user.userID}
              >
                {user.username} {socket.userID === user.userID ? "(You)" : null}
                {user.connected && (
                  <Button
                    variant="light"
                    hidden={socket.userID === user.userID}
                    onClick={() => invitePlayerHandler(user.userID)}
                  >
                    Invite to play
                  </Button>
                )}
                {user.connected ? (
                  <Badge pill bg="warning" text="dark">
                    Online
                  </Badge>
                ) : (
                  <Badge pill bg="dark">
                    Offline
                  </Badge>
                )}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Container>
    </Container>
  );
};

export default MainMenu;
