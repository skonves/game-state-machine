import {
  IEffect,
  ICondition,
  IRuleAndEffectContinuation,
  IEffectContinuation,
  IScopeSelector,
  IScopedCondition,
  IScopedEffect,
  IScopedEffectContinuation,
  IRuleAndScopedEffectContinuation,
} from '../types';
import { create, createScoped } from './helpers';

export class EffectContinuation<TState> implements IEffectContinuation<TState> {
  constructor(
    private readonly conditions: Iterable<ICondition<TState>>,
    private readonly effects: Iterable<IEffect<TState>>,
  ) {}

  then(effect: IEffect<TState>): IRuleAndEffectContinuation<TState> {
    return create(this.conditions, [...Array.from(this.effects), effect]);
  }
}

export class ScopedEffectContinuation<TState, TScope>
  implements IScopedEffectContinuation<TState, TScope> {
  constructor(
    private readonly conditions: Iterable<IScopedCondition<TState, TScope>>,
    private readonly effects: Iterable<IScopedEffect<TState, TScope>>,
    private readonly selector: IScopeSelector<TState, TScope>,
  ) {}

  then(
    effect: IScopedEffect<TState, TScope>,
  ): IRuleAndScopedEffectContinuation<TState, TScope> {
    return createScoped(
      this.conditions,
      [...Array.from(this.effects), effect],
      this.selector,
    );
  }
}
