import { Game } from '../engine';
import { IEffect, ICondition, IRule } from '../types';
import { always, either } from '../builder';

type Marker = 'X' | 'O';

interface GameState {
  currentPlayer: Marker;
  squares: (Marker | undefined)[];
}

const aPlayerHasThreeInARow: ICondition<GameState> = (state) => {
  const [a, b, c, d, e, f, g, h, i] = state.squares;

  if (a && a === b && b === c) return true; // top row
  if (d && d === e && e === f) return true; // middle row
  if (g && g === h && h === i) return true; // bottom row
  if (a && a === d && d === g) return true; // left column
  if (b && b === e && e === h) return true; // middle column
  if (c && c === f && f === i) return true; // right column
  if (a && a === e && e === i) return true; // diag from top left
  if (c && c === e && e === g) return true; // diag from top right

  return false;
};

const allSquaresAreFilled: ICondition<GameState> = (state) => {
  return state.squares.every((x) => !!x);
};

const markASquareWithTheCurrentPlayer: IEffect<GameState> = (state) => {
  for (let i = 0; i < state.squares.length; i++) {
    if (!state.squares[i]) {
      const newState: GameState = {
        ...state,
        squares: [...state.squares],
      };
      newState.squares[i] = state.currentPlayer;

      return Promise.resolve(newState);
    }
  }
  return Promise.resolve(state);
};

const playContinuesToTheNextPlayer: IEffect<GameState> = (state) => {
  const nextPlayer = state.currentPlayer === 'X' ? 'O' : 'X';

  return Promise.resolve({
    ...state,
    playerTurn: nextPlayer,
  });
};

const initialState: GameState = {
  currentPlayer: 'X',
  squares: new Array(9).fill(undefined),
};
const objective = either(aPlayerHasThreeInARow, allSquaresAreFilled);
const rules = [
  always(markASquareWithTheCurrentPlayer).then(playContinuesToTheNextPlayer),
];

export const game = new Game(initialState, objective, rules);
