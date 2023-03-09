import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainMenu from "./components/MainMenu";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Game from "./components/Game/Game";
import { UserProvider } from "./context/userContext";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<MainMenu />} />
      <Route path="/game/:game_id" element={<Game />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
