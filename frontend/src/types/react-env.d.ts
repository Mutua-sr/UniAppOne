/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'react' {
  export = React;
  export as namespace React;

  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
  }

  interface FC<P = {}> extends FunctionComponent<P> {}

  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  type ReactText = string | number;
  type ReactChild = ReactElement | ReactText;
  type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;

  interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }

  type Key = string | number;

  interface JSXElementConstructor<P> {
    (props: P): ReactElement<P, any> | null;
  }

  type JSXElementType = string | JSXElementConstructor<any>;

  interface ReactFragment {
    [key: string]: ReactNode;
  }

  interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }

  interface SyntheticEvent<T = Element, E = Event> {
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

  type Dispatch<A> = (value: A) => void;
  type SetStateAction<S> = S | ((prevState: S) => S);

  function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];

  function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  function useCallback<T extends Function>(callback: T, deps: DependencyList): T;

  type DependencyList = ReadonlyArray<unknown>;
  type EffectCallback = () => (void | (() => void | undefined));
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