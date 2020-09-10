## Reference Examle: Tic-Tac-Toe

Note that you can use this libary without Typescript, but I do strongly recommend using it. All examples here are strictly typed.

The following is an example of how you would implement tic-tac-toe as a state machine. Tic-tac-toe is simple enough that there is really just one rule: The current player places their marker in an empty square, then play continues to the next player. The game continues until either a player gets three in a row or all squares are filled.

### Define the game state

First, let's define a game state interface:

```ts
type Marker = 'X' | 'O';
interface GameState {
  currentPlayer: Marker;
  squares: (Marker | undefined)[];
}
```

That's pretty simple. The game engine doesn't have a built in mechanism for representing player turns, so we have to define that in our game state. In this case, we maintain the marker for the current player. The only other thing is the array of squares that make up the board. Each square can be either a marker or empty.

### Define the objective

Let's start by defining the objective of the game. The object has two conditions, and if either is reached, then the game is over.

```ts
import { either, ICondition } from 'game-state-engine';

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

const objective = either(aPlayerHasThreeInARow, allSquaresAreFilled);
```

Because the condition names are well chosen, the code reads fluently: "either a player has three in a row (or) all squares are filled."

### Define the effects and rules

Per the rules, there are two effects: place a marker, and progress to the next player.

We can represent those as follows:

```ts
import { IEffect } from 'game-state-machine';

const placeTheCurrentPlayersMarkerInAnEmptySquare: IEffect<GameState> = (
  state,
) => {
  // Make a copy of the old state
  const newSate = {
    ...state,
    sqaures: [...state.squares],
  };

  // Get the current players marker
  const marker = state.currentPlayer;

  // TODO: implement a strategy to select and mark an empty square

  // Return the "updated" state
  return newState;
};

const playContinuesToTheNextPlayer: IEffect<GameState> = (state) => {
  const nextPlayer = state.playerTurn === 'X' ? 'O' : 'X';

  return Promise.resolve({
    ...state,
    currentPlayer: nextPlayer,
  });
};

const rule = always(placeTheCurrentPlayersMarkerInAnEmptySquare).then(
  playContinuesToTheNextPlayer,
);
```

Again, the `always` rule builder facilitates a fluent rule: "always place the current player's marker in an empty square then play continues to the next player."

Note that the game engine doesn't provide any sort of strategy builders or AI, so it's up to the developer to create those implementations, in this case for selecting where to play.

### Running the game

We can create an instance of the game engine by constructing a `Game` with an initial state, the objective, and a set of rules:

```ts
import { Game } from 'game-state-machine';

const initialState: GameState = {
  playerTurn: 'X',
  squares: new Array(9).fill(undefined),
};
const objective = either(aPlayerHasThreeInARow, allSquaresAreFilled);
const rules = [
  always(markASquareWithTheCurrentPlayer).then(playContinuesToTheNextPlayer),
];

export const game = new Game(initialState, objective, rules);

game.on('state', () => console.log(game.state));

game.play();
```
