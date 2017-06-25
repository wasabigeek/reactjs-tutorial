import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={(props.isCurrentSquare) ? 'square bold' : 'square'} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const isCurrentSquare = (i === this.props.currentSquare) ? true : false;
    return (
      <Square
        value={this.props.squares[i]}
        isCurrentSquare={isCurrentSquare}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // layout of board
    const boardRows = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];

    // create JSX for each row
    let boardElem = boardRows.map((row, index) => {
      const boardRowSquares = row.map((square, index) => {
        return this.renderSquare(square);
      });

      return (
        <div className="board-row">
          {boardRowSquares}
        </div>
      );
    });

    return (
      <div>
        {boardElem}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastMove: null,
      }],
      sortHistoryInDescendingOrder: true,
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastMove: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  toggleSortOrder() {
    this.setState({
      sortHistoryInDescendingOrder: !this.state.sortHistoryInDescendingOrder,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;
    const winningRow = calculateWinner(current.squares).winningRow;

    const moves = history.map((step, move) => {
      const currentPlayer = (move % 2) ? 'O' : 'X';
      const desc = move ?
        'Move #' + move + ' (' + currentPlayer + ' in position ' + step.lastMove + ')':
        'Game start';
      return (
        <li key={move}>
          <a
            href="#"
            className={(move === this.state.stepNumber) ? 'bold' : null}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </a>
        </li>
      );
    });
    const sortedMoves = (this.state.sortHistoryInDescendingOrder) ? moves : moves.reverse();

    const sortToggle = <a href="#" onClick={() => this.toggleSortOrder()}>
      {(this.state.sortHistoryInDescendingOrder) ? 'descending' : 'ascending'}
    </a>;

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            currentSquare = {current.lastMove}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <div>Sorted in {sortToggle} order</div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateCurrentPlayer(step) {
  return (step % 2) ? false : true;
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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningRow: [a, b, c],
      };
    }
  }
  return { winner: null };
}
