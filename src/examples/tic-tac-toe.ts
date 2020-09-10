import { Game } from '../engine';
import { IEffect, ICondition, IRule } from '../types';
import { always } from '../builder';

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
  const [a, b, c, d, e, f, g, h, i] = state.squares;

  // top row
  if (a && a === b && b === c) return true;

  // middle row
  if (d && d === e && e === f) return true;

  // bottom row
  if (g && g === h && h === i) return true;

  // left column
  if (a && a === d && d === g) return true;

  // middle column
  if (b && b === e && e === h) return true;

  // right column
  if (c && c === f && f === i) return true;

  // diag from top left
  if (a && a === e && e === i) return true;

  // diag from top right
  if (c && c === e && e === g) return true;

  // cat
  if (state.squares.every((x) => !!x)) return true;

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
