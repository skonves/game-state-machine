import {
  IConditionContinuation,
  IEffect,
  ICondition,
  IRuleAndEffectContinuation,
  IScopeSelector,
  IScopedEffect,
  IScopedConditionContinuation,
  IRuleAndScopedEffectContinuation,
  IScopedCondition,
} from '../types';
import { create, createScoped } from './helpers';

export class ConditionContinuation<TState>
  implements IConditionContinuation<TState> {
  constructor(private readonly conditions: Iterable<ICondition<TState>>) {}
  then(effect: IEffect<TState>): IRuleAndEffectContinuation<TState> {
    return create(this.conditions, [effect]);
  }
  and(condition: ICondition<TState>): IConditionContinuation<TState> {
    return new ConditionContinuation([
      ...Array.from(this.conditions),
      condition,
    ]);
  }
}

export class ScopedConditionContinuation<TState, TScope>
  implements IScopedConditionContinuation<TState, TScope> {
  constructor(
    private readonly conditions: Iterable<IScopedCondition<TState, TScope>>,
    private readonly selector: IScopeSelector<TState, TScope>,
  ) {}
  then(
    effect: IScopedEffect<TState, TScope>,
  ): IRuleAndScopedEffectContinuation<TState, TScope> {
    return createScoped(this.conditions, [effect], this.selector);
  }
  and(
    condition: IScopedCondition<TState, TScope>,
  ): IScopedConditionContinuation<TState, TScope> {
    return new ScopedConditionContinuation(
      [...Array.from(this.conditions), condition],
      this.selector,
    );
  }
}
