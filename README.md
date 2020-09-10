# Game State Machine

Generic state machine for prototyping and running virtual card and board games

## Overview

There are four main concepts in the library:

**Game state** - The game state represents all of the players, equipment (eg. cards, board, tokens, etc), and conditions that make up the game. The game state is updated\* as the game progresses until it reaches the game objective (a simple function that takes a game state and returns a boolean).

\* Technically a new state is created from the previous state.

**Rules and Effects** - An effect is a reducing function that takes a game state and returns a new game state. A rule is a logical grouping of one or more effects. Effects are asynchronous to facilitate human and network input.

**Game engine** - The Game class provides functionality to loop through the set of rules until the state is updated such that the objective is reached. Note that the objective is evaluated immediately after every effect is run.

**Rule builder** - These functions provide a fluent syntax for describing rules and effects. You don’t have to use the rule builders to define `IRule` objects, but it’s way easier.

## Quick Start

Here is a simple example of a guessing game where the player has to guess a secret number from 1 to 6.

```ts
import { always, Game, ICondition, IEffect } from 'game-state-machine';

interface GameState = {
  secret: number;
  guess: number;
};

const guessARandomNumberFromOneToSix: IEffect<GameState> = state => {
  return Promise.resolve({
    ...state,
    guess: Math.ceil((Math.random() * 6)),
  });
};

const rule: IRule<GameState> = always(guessARandomNumberFromOneToSix);

const objective: ICondition<GameState> = state => {
  return state.guess === state.guess;
};

const initialState: GameState = {
  secret: 4, // chosen by fair dice roll. guarenteed to be random.
  guess: 0,
};

const game = new Game(initialState, objective, [rules])

game.on('state', () => console.log(game.state));

game.step(); // step will run the next effect and then pause

game.play(); // play will iterate until the game object is reached or game.pause() is called.
```
