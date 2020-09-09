import { game } from './tic-tac-toe';

game.on('state', () => console.log(game.state));

game.play();
