import {
  IEffect,
  ICondition,
  IRuleAndEffectContinuation,
  IConditionContinuation,
  IScopeSelector,
  IScopedCondition,
  IScopedConditionContinuation,
  IScopedEffect,
  IRuleAndScopedEffectContinuation,
} from '../types';
import {
  ConditionContinuation,
  ScopedConditionContinuation,
} from './condition-continuation';
import { create, createScoped } from './helpers';

export function forEach<TState, TScope>(
  selector: IScopeSelector<TState, TScope>,
) {
  return {
    when(
      condition: IScopedCondition<TState, TScope>,
    ): IScopedConditionContinuation<TState, TScope> {
      return new ScopedConditionContinuation([condition], selector);
    },
    always(
      effect: IScopedEffect<TState, TScope>,
    ): IRuleAndScopedEffectContinuation<TState, TScope> {
      return createScoped([], [effect], selector);
    },
  };
}

export function when<TState>(
  condition: ICondition<TState>,
): IConditionContinuation<TState> {
  return new ConditionContinuation([condition]);
}

export function always<TState>(
  effect: IEffect<TState>,
): IRuleAndEffectContinuation<TState> {
  return create([], [effect]);
}
