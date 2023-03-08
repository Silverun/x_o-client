import React from "react";
import Container from "react-bootstrap/esm/Container";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Container
      as={"main"}
      style={{ maxWidth: "100%" }}
      className="vh-100 vw-100 d-flex align-items-center"
    >
      <Outlet />
    </Container>
  );
};

export default Layout;
