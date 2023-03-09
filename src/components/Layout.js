import React from "react";
import Container from "react-bootstrap/esm/Container";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import socket from "../api/io";
import logo from "../img/logo.png";

const Layout = () => {
  const navigate = useNavigate();

  const exitLobbyHandler = () => {
    socket.disconnect();
    // localStorage.clear();
    navigate("/");
  };
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container className="d-flex ">
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="xologo"
          />
          <Nav>
            <Button variant="dark" onClick={() => navigate("/main")}>
              Lobby
            </Button>
          </Nav>
          <Nav>
            <Button variant="dark" onClick={exitLobbyHandler}>
              Logout
            </Button>
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
