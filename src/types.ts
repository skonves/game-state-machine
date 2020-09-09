export interface IConditionContinuation<TState> {
  then(effect: IEffect<TState>): IRuleAndEffectContinuation<TState>;
  and(condition: ICondition<TState>): IConditionContinuation<TState>;
}

export interface IScopedConditionContinuation<TState, TScope> {
  then(
    effect: IScopedEffect<TState, TScope>,
  ): IRuleAndScopedEffectContinuation<TState, TScope>;
  and(
    condition: IScopedCondition<TState, TScope>,
  ): IScopedConditionContinuation<TState, TScope>;
}

export interface IEffectContinuation<TState> {
  then(effect: IEffect<TState>): IRuleAndEffectContinuation<TState>;
}

export interface IScopedEffectContinuation<TState, TScope> {
  then(
    effect: IScopedEffect<TState, TScope>,
  ): IRuleAndScopedEffectContinuation<TState, TScope>;
}

export interface IRuleAndEffectContinuation<TState>
  extends IEffectContinuation<TState>,
    IRule<TState> {}

export interface IRuleAndScopedEffectContinuation<TState, TScope>
  extends IScopedEffectContinuation<TState, TScope>,
    IRule<TState> {}

export interface IRule<TState> {
  (state: TState): Iterable<IEffect<TState>>;
}

export interface IEffect<TState> {
  (state: TState): Promise<TState>;
}

export interface IScopeSelector<TState, TScope> {
  (state: TState): Iterable<TScope>;
}

export interface IScopedEffect<TState, TScope> {
  (scope: TScope): IEffect<TState>;
}

export interface ICondition<TState> {
  (state: TState): boolean;
}

export interface IScopedCondition<TState, TScope> {
  (scope: TScope): ICondition<TState>;
}
