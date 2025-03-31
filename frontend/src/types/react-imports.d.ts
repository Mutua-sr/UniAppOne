declare module 'react' {
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  export interface ReactComponentElement<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>, P = Pick<ComponentProps<T>, keyof ComponentProps<T>>> extends ReactElement<P, Exclude<T, number>> { }

  export type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<any, any>);

  export type Key = string | number;

  export type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = T extends JSXElementConstructor<infer P> ? P : T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : {};

  export type ComponentType<P = {}> = JSXElementConstructor<P> | keyof JSX.IntrinsicElements;

  export interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> { }

  export interface ComponentLifecycle<P, S, SS = any> {
    render(): ReactNode;
  }

  export type ReactText = string | number;
  export type ReactChild = ReactElement | ReactText;
  export type ReactFragment = {} | Iterable<ReactNode>;
  export type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;

  export interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }

  export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }

  export interface SyntheticEvent<T = Element, E = Event> {
    bubbles: boolean;
    cancelable: boolean;
    currentTarget: EventTarget & T;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    nativeEvent: E;
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget & T;
    timeStamp: number;
    type: string;
  }

  export type DependencyList = ReadonlyArray<unknown>;
  export type EffectCallback = () => (void | (() => void | undefined));

  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
  export function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  export function useCallback<T extends Function>(callback: T, deps: DependencyList): T;

  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);
}

declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty { props: {}; }
    interface ElementChildrenAttribute { children: {}; }
    interface IntrinsicAttributes extends React.Attributes { }
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> { }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}