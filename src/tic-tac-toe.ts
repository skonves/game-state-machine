import { Game } from './engine';
import { IEffect, ICondition, IRule } from './types';
import { always } from './builder';

type Marker = 'X' | 'O';

interface GameState {
  playerTurn: Marker;
  squares: [
    Marker | undefined,
    Marker | undefined,
    Marker | undefined,
    Marker | undefined,
    Marker | undefined,
    Marker | undefined,
    Marker | undefined,
    Marker | undefined,
    Marker | undefined,
  ];
}

const hasThreeInARow: ICondition<GameState> = (state) => {
  // top row
  if (
    state.squares[0] !== undefined &&
    state.squares[0] === state.squares[1] &&
    state.squares[1] === state.squares[2]
  )
    return true;

  // middle row
  if (
    state.squares[3] !== undefined &&
    state.squares[3] === state.squares[4] &&
    state.squares[4] === state.squares[5]
  )
    return true;

  // bottom row
  if (
    state.squares[6] !== undefined &&
    state.squares[6] === state.squares[7] &&
    state.squares[7] === state.squares[8]
  )
    return true;

  // left column
  if (
    state.squares[0] !== undefined &&
    state.squares[0] === state.squares[3] &&
    state.squares[3] === state.squares[6]
  )
    return true;

  // middle column
  if (
    state.squares[1] !== undefined &&
    state.squares[1] === state.squares[4] &&
    state.squares[4] === state.squares[7]
  )
    return true;

  // right column
  if (
    state.squares[2] !== undefined &&
    state.squares[2] === state.squares[5] &&
    state.squares[5] === state.squares[8]
  )
    return true;

  // diag from top left
  if (
    state.squares[0] !== undefined &&
    state.squares[0] === state.squares[4] &&
    state.squares[4] === state.squares[8]
  )
    return true;

  // diag from top right
  if (
    state.squares[2] !== undefined &&
    state.squares[2] === state.squares[4] &&
    state.squares[4] === state.squares[6]
  )
    return true;

  // cat
  if (state.squares.every((s) => s !== undefined)) return true;

  return false;
};

const markASquareWithTheCurrentPlayer: IEffect<GameState> = (state) => {
  for (let i = 0; i < state.squares.length; i++) {
    if (!state.squares[i]) {
      const newState: GameState = {
        ...state,
        squares: [...state.squares],
      };
      newState.squares[i] = state.playerTurn;

      return Promise.resolve(newState);
    }
  }
  return Promise.resolve(state);
};

const itsTheNextPlayersTurn: IEffect<GameState> = (state) => {
  const nextPlayer = state.playerTurn === 'X' ? 'O' : 'X';

  return Promise.resolve({
    ...state,
    playerTurn: nextPlayer,
  });
};

export const game = new Game<GameState>(
  {
    playerTurn: 'X',
    squares: [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ],
  },
  hasThreeInARow,
  [always(markASquareWithTheCurrentPlayer).then(itsTheNextPlayersTurn)],
);
