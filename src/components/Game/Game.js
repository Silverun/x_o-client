import React, { useEffect, useState } from "react";
import styles from "./game.module.css";
import socket from "../../api/io";
import { useLocation, useParams } from "react-router-dom";

const Game = () => {
  const [cells, setCells] = useState(Array(9).fill(""));
  const [winner, setWinner] = useState();
  const params = useParams();
  const gameRoom = params.game_id;
  const sessionID = localStorage.getItem("sessionID");
  const [turn, setTurn] = useState(gameRoom === socket.userID ? "x" : "o");
  const [paused, setPaused] = useState(
    gameRoom === socket.userID ? false : true
  );
  const [yourTurn, setYourTurn] = useState(
    gameRoom === socket.userID ? true : false
  );

  useEffect(() => {
    console.log("myID", socket.userID);

    if (sessionID) {
      console.log(sessionID, "sesId Ran");
      socket.auth = { sessionID };
      socket.connect();
    }
    console.log(gameRoom);
    socket.on("turn_start", (newSquares) => {
      console.log("newSquares", newSquares);
      setCells(newSquares);
      setYourTurn(true);
      setPaused((prev) => !prev);
      checkWinner(newSquares);
    });

    socket.on("play_again_trigger", () => {
      setWinner(null);
      setCells(Array(9).fill(""));
    });
  }, []);

  const checkWinner = (squares) => {
    let combos = {
      across: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ],
      down: [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
      ],
      diagonal: [
        [0, 4, 8],
        [2, 4, 6],
      ],
    };

    for (let combo in combos) {
      combos[combo].forEach((pattern) => {
        // if (
        //   squares[pattern[0]] === "" ||
        //   squares[pattern[1]] === "" ||
        //   squares[pattern[2]] === ""
        // ) {
        //   // do nothing no mathching rows for win
        // } else
        if (
          squares[pattern[0]] === squares[pattern[1]] &&
          squares[pattern[1]] === squares[pattern[2]]
        ) {
          //pattern matched
          setWinner(squares[pattern[0]]);
        } else if (squares.every((cell) => cell !== "")) {
          setWinner("draw");
        }
      });
    }
  };

  // function switchTurn() {
  //   if (turn === "x") {
  //     setTurn("o");
  //   }

  //   if (turn === "o") {
  //     setTurn("x");
  //   }
  // }

  const handleCellClick = (num) => {
    if (cells[num]) {
      alert("already clicked");
      return;
    }

    let squares = [...cells];

    if (turn === "x") {
      squares[num] = "x";
      // setTurn("o");
    } else {
      squares[num] = "o";
      // setTurn("x");
    }
    checkWinner(squares);
    setCells(squares);
    // console.log(squares);
    //send board and pause turn
    // switch turn
    socket.emit("turn_end", squares, gameRoom);
    // switchTurn();
    setYourTurn(false);
    setPaused((prev) => !prev);
  };

  const playAgainHandler = () => {
    setWinner(null);
    setCells(Array(9).fill(""));
    socket.emit("play_again_click", gameRoom);
  };

  const Cell = ({ num }) => {
    return (
      <td
        onClick={() => (paused ? null : handleCellClick(num))}
        className={styles.cell}
      >
        {cells[num]}
      </td>
    );
  };

  return (
    <div className="container-sm gap-2 d-flex flex-column flex-col align-items-center">
      {winner && (
        <div>
          {winner === "draw" ? <h3>Draw</h3> : <h3>{winner} is the winner!</h3>}
          <button className="btn btn-secondary" onClick={playAgainHandler}>
            Play again
          </button>
        </div>
      )}
      <h3>{yourTurn ? "Your turn" : "Opponents turn"}</h3>
      <h3>Place: {turn}</h3>
      <table>
        <tbody>
          <tr>
            <Cell num={0} />
            <Cell num={1} />
            <Cell num={2} />
          </tr>
          <tr>
            <Cell num={3} />
            <Cell num={4} />
            <Cell num={5} />
          </tr>
          <tr>
            <Cell num={6} />
            <Cell num={7} />
            <Cell num={8} />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Game;
