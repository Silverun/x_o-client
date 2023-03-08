import { useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import socket from "../api/io";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const nameInputRef = useRef();
  const navigate = useNavigate();

  const onUsernameSelection = () => {
    socket.auth = { username: nameInputRef.current.value };
    socket.connect();

    navigate("main");
  };

  return (
    <Container fluid="md">
      <Form>
        <Form.Label htmlFor="enter_name">Enter your name</Form.Label>
        <Form.Control
          ref={nameInputRef}
          id="enter_name"
          aria-label="Username"
        />
        <Button onClick={onUsernameSelection} variant="primary">
          Join
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
