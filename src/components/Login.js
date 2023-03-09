import { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import socket from "../api/io";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

const Login = () => {
  const nameInputRef = useRef();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const onUsernameSelection = () => {
    const name = nameInputRef.current.value;
    if (name.length < 3) {
      setMessage("Please provide valid name (3 or more characters)");
      setTimeout(() => {
        setMessage(null);
      }, 2500);
      return;
    }
    socket.auth = { username: name };
    socket.connect();

    navigate("main");
  };

  return (
    <Container className="d-flex justify-content-center text-center" fluid="sm">
      <Form style={{}}>
        <Form.Label htmlFor="enter_name">Enter your name</Form.Label>
        <Form.Control
          className="mb-3"
          ref={nameInputRef}
          id="enter_name"
          aria-label="Username"
        />
        {message && (
          <Alert className="mb-3" key={"light"} variant={"light"}>
            {message}
          </Alert>
        )}
        <Button onClick={onUsernameSelection} variant="primary">
          Join
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
