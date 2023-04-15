import {useState} from "react";

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0)
    const [ascending, setAscending] = useState(true)
    const xIsNext = currentMove % 2 === 0
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1)
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove)
    }

    const moves = history.map((squares, move) => {
        let description
        let isCurrentMove = move === currentMove
        if (move > 0) {
            description = isCurrentMove
                ? 'You are at move #'
                : 'Go to move #'
            description += move
        } else {
            description = 'Go to start'
        }
        return (
            <li key={move}>
                {
                    isCurrentMove
                        ? description
                        : <button onClick={() => jumpTo(move)}>{description}</button>
                }
            </li>
        )
    })

    const order = ascending ? "Descending" : "Ascending"

    const orderedMovements = ascending ? <ul>{moves}</ul> : <ul>{moves.reverse()}</ul>

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove}/>
            </div>
            <div className="game-info">
                <button onClick={
                    () => {
                        setAscending(!ascending)
                    }
                }>
                    {order} order
                </button>
                {orderedMovements}
            </div>
        </div>
    )
}

function Board({xIsNext, squares, onPlay, currentMove}) {

    let xORo = xIsNext ? "X" : "O"

    const [position, setPosition] = useState("")

    function handleClick(i, row, col) {
        if (squares[i] || calculateWinner(squares)) return
        const nextSquares = squares.slice()
        nextSquares[i] = xORo
        setPosition(`${xORo} at row: ${row + 1}, col: ${col + 1}`)
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares)
        ? squares[calculateWinner(squares)[0]]
        : calculateWinner(squares)

    let status


    if (winner) {
        status = "Winner: " + winner
    } else {
        status = currentMove < 9
            ? `Next player: ${xORo}`
            : "DRAW"
    }

    const arr = [0, 1, 2]

    const rowsSquares = arr.map(
        i => (
            <div className="board-row" key={i}>
                {
                    arr.map(
                        j => {
                            const noHardcode = j + i * 3
                            const winnerSquare = winner ? calculateWinner(squares).includes(noHardcode) : false
                            const className = winnerSquare ? "square winner" : "square"
                            return (
                                <Square value={squares[noHardcode]} onSquareClick={
                                    () => handleClick(noHardcode, i, j)
                                } className={className} key={noHardcode}/>
                            )
                        }
                    )
                }
            </div>
        )
    )

    return (
        <>
            <div className="status">{status}</div>
            {rowsSquares}
            <div className="status">{position}</div>
        </>
    )
}

function Square({value, onSquareClick, className}) {
    return (
        <button className={className} onClick={onSquareClick}>
            {value}
        </button>
    )
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i]
        }
    }
    return null
}
