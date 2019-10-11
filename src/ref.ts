export const refSymbol = Symbol(__DEV__ ? 'refSymbol' : undefined)

export interface Ref<T = any> {
    [refSymbol]: true
    value: UnwrapRef<T>
}

type BailTypes =
  | Function
  | Map<any, any>
  | Set<any>
  | WeakMap<any, any>
  | WeakSet<any>

// Recursively unwraps nested value bindings.
export type UnwrapRef<T> = {
    ref: T extends Ref<infer V> ? UnwrapRef<V> : T
    array: T extends Array<infer V> ? Array<UnwrapRef<V>> : T
    object: { [K in keyof T]: UnwrapRef<T[K]> }
    stop: T
  }[T extends Ref
    ? 'ref'
    : T extends Array<any>
      ? 'array'
      : T extends BailTypes
        ? 'stop' // bail out on types that shouldn't be unwrapped
        : T extends object ? 'object' : 'stop']

// only unwrap nested ref
export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>