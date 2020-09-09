import {
  IEffect,
  ICondition,
  IRuleAndEffectContinuation,
  IRule,
  IScopeSelector,
  IScopedCondition,
  IScopedEffect,
  IRuleAndScopedEffectContinuation,
} from '../types';
import {
  EffectContinuation,
  ScopedEffectContinuation,
} from './effect-continuation';

export const either = <TState>(
  a: ICondition<TState>,
  b: ICondition<TState>,
): ICondition<TState> => {
  return (state: TState) => a(state) || b(state);
};

export const both = <TState>(
  a: ICondition<TState>,
  b: ICondition<TState>,
): ICondition<TState> => {
  return (state: TState) => a(state) && b(state);
};

export const neither = <TState>(
  a: ICondition<TState>,
  b: ICondition<TState>,
): ICondition<TState> => {
  return (state: TState) => !a(state) && !b(state);
};

export const not = <TState>(
  condition: ICondition<TState>,
): ICondition<TState> => {
  return (state: TState) => !condition(state);
};

export const allOf = <TState>(
  ...conditions: ICondition<TState>[]
): ICondition<TState> => {
  if (conditions.length === 1) return conditions[0];
  return (state: TState) => conditions.every((condition) => condition(state));
};

export const anyOf = <TState>(
  ...conditions: ICondition<TState>[]
): ICondition<TState> => {
  if (conditions.length === 1) return conditions[0];
  return (state: TState) => conditions.every((condition) => condition(state));
};

export function create<TState>(
  conditions: Iterable<ICondition<TState>>,
  effects: Iterable<IEffect<TState>>,
): IRuleAndEffectContinuation<TState> {
  const rule: IRule<TState> = (state) => {
    for (const condition of conditions) {
      if (!condition(state)) return [];
    }

    return effects;
  };
  const effectContinuation = new EffectContinuation<TState>(
    conditions,
    effects,
  );

  return Object.assign(rule, effectContinuation);
}

export function createScoped<TState, TScope>(
  conditions: Iterable<IScopedCondition<TState, TScope>>,
  effects: Iterable<IScopedEffect<TState, TScope>>,
  selector: IScopeSelector<TState, TScope>,
): IRuleAndScopedEffectContinuation<TState, TScope> {
  function* iterate(state: TState) {
    for (const scope of selector(state)) {
      let pass = true;
      for (const condition of conditions) {
        if (!condition(scope)(state)) pass = false;
      }

      if (pass) {
        for (const effect of effects) {
          yield effect(scope);
        }
      }
    }
  }

  const rule: IRule<TState> = iterate;

  const effectContinuation = new ScopedEffectContinuation<TState, TScope>(
    conditions,
    effects,
    selector,
  );

  return Object.assign(rule, effectContinuation);
}
