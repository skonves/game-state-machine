import { EventEmitter } from 'events';
import { ICondition, IEffect, IRule } from './types';

export class Game<TGame> extends EventEmitter {
  constructor(
    state: TGame,
    private readonly objective: ICondition<TGame>,
    private readonly rules: Iterable<IRule<TGame>>,
  ) {
    super();
    this.iterator = this.getIterator();
    this._state = state;
  }

  private _state: TGame;
  get state(): TGame {
    return this._state;
  }

  private readonly iterator: IterableIterator<IEffect<TGame>>;

  private _objectiveReached: boolean = false;

  get objectiveReached(): boolean {
    return this._objectiveReached;
  }

  private _currentRule: IRule<TGame>;
  get currentRule(): IRule<TGame> {
    return this._currentRule;
  }

  private _currentEffect: IEffect<TGame>;
  get currentEffect(): IEffect<TGame> {
    return this._currentEffect;
  }

  private *getIterator(): IterableIterator<IEffect<TGame>> {
    // TODO: consider returning if state does not change during a game loop
    while (true) {
      this.emit('loop');
      for (const rule of this.rules) {
        this._currentRule = rule;
        this.emit('rule');
        for (const effect of rule(this.state)) {
          this._currentEffect = effect;
          this.emit('effect');
          yield effect;
        }
      }
    }
  }

  async step(): Promise<void> {
    this.emit('step');
    const result: IteratorResult<
      IEffect<TGame>,
      IEffect<TGame>
    > = this.iterator.next();
    const effect = result.value;

    const newState = await effect(this.state);

    if (newState === this.state) {
      this.emit('noop');
    } else {
      this._state = newState;
      this.emit('state');
      this._objectiveReached = this.objective(this.state);
      this.emit('objective');
    }
  }

  private _run: boolean = false;

  pause() {
    this._run = false;
  }

  async play() {
    this._run = true;

    while (this._run && !this._objectiveReached) await this.step();
  }
}
