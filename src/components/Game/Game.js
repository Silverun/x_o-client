import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./game.module.css";
import socket from "../../api/io";
import { useLocation, useParams } from "react-router-dom";

const Game = () => {
  const [cells, setCells] = useState(Array(9).fill(""));
  const [winner, setWinner] = useState();
  const [draw, setDraw] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
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
  const winRef = useRef(null);

  const newGame = useCallback(() => {
    console.log("newGame ran");
    setCells(Array(9).fill(""));
    setWinner(null);
    setDraw(false);
    winRef.current = null;
    setGameEnded(false);
    setTurn(gameRoom === socket.userID ? "x" : "o");
    setPaused(gameRoom === socket.userID ? false : true);
    setYourTurn(gameRoom === socket.userID ? true : false);
  }, []);

  const gameEnd = useCallback(() => {
    console.log("gameEnd ran");
    setPaused(true);
    setGameEnded(true);
  }, []);

  useEffect(() => {
    // console.log("myID", socket.userID);
    // console.log("name", socket);
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }
    socket.on("turn_start", (newSquares) => {
      // console.log("newSquares", newSquares);
      setCells(newSquares);
      setYourTurn(true);
      setPaused((prev) => !prev);
      checkWinner(newSquares);
      // checkDraw(newSquares);
    });
    socket.on("play_again_trigger", () => {
      // setWinner(null);
      // setCells(Array(9).fill(""));
      newGame();
    });
  }, []);

  // const checkDraw = (squares) => {
  //   const cellsFilled = squares.every((cell) => cell !== "");
  //   console.log("winner from check draw", winner);
  //   if (cellsFilled && !winner) {
  //     setDraw(true);
  //   }
  // };

  const checkWinner = useCallback((squares) => {
    // console.log(squares);

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
        let match =
          squares[pattern[0]] === squares[pattern[1]] &&
          squares[pattern[1]] === squares[pattern[2]] &&
          squares[pattern[0]] !== "";

        if (match) {
          winRef.current = true;
          console.log("set winner pattern");
          setWinner(squares[pattern[0]]);
        }
      });
    }
    let cellsFilled = squares.every((cell) => cell !== "");
    console.log("cellsFilled", cellsFilled);
    console.log("winRef", winRef.current);
    if (!winRef.current && cellsFilled) {
      setDraw(true);
    }
  }, []);

  const handleCellClick = (num) => {
    if (winner || draw) return;

    if (cells[num]) {
      // alert("already clicked");
      return;
    }
    let squares = [...cells];

    if (turn === "x") {
      squares[num] = "x";
    } else {
      squares[num] = "o";
    }
    checkWinner(squares);
    setCells(squares);
    // checkDraw(squares);
    socket.emit("turn_end", squares, gameRoom);

    setYourTurn(false);
    setPaused((prev) => !prev);
  };

  const playAgainHandler = () => {
    newGame();
    // setWinner(null);
    // setCells(Array(9).fill(""));
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
      {draw && (
        <div>
          <h3>Draw!</h3>
          <button className="btn btn-secondary" onClick={playAgainHandler}>
            Play again
          </button>
        </div>
      )}
      {winner && (
        <div>
          <h3>{winner} is the winner!</h3>
          <button className="btn btn-secondary" onClick={playAgainHandler}>
            Play again
          </button>
        </div>
      )}
      {winner || draw ? null : (
        <>
          <h3>{yourTurn ? "Your turn" : "Opponent's turn"}</h3>
          <h3>Playing as: {turn}</h3>
        </>
      )}

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
