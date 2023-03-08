import React from "react";
import Container from "react-bootstrap/esm/Container";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import socket from "../api/io";

const Layout = () => {
  const navigate = useNavigate();

  const exitLobbyHandler = () => {
    socket.disconnect();
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Nav className="me-auto">
            <Button onClick={exitLobbyHandler}>Logout</Button>
          </Nav>
        </Container>
      </Navbar>
      <Container
        as={"main"}
        style={{ maxWidth: "100%" }}
        className="vh-100 vw-100 d-flex align-items-center"
      >
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
