declare module 'react' {
  export = React;
  export as namespace React;

  namespace React {
    interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
      type: T;
      props: P;
      key: Key | null;
    }

    type ReactText = string | number;
    type ReactChild = ReactElement | ReactText;
    type ReactFragment = {} | Iterable<ReactNode>;
    type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;

    interface ReactPortal extends ReactElement {
      key: Key | null;
      children: ReactNode;
    }

    type Key = string | number;

    type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<any, any>);

    interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> { }

    interface ComponentLifecycle<P, S, SS = any> {
      render(): ReactNode;
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

    type DependencyList = ReadonlyArray<unknown>;
    type EffectCallback = () => (void | (() => void | undefined));

    function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
    function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
    function useEffect(effect: EffectCallback, deps?: DependencyList): void;
    function useCallback<T extends Function>(callback: T, deps: DependencyList): T;

    type Dispatch<A> = (value: A) => void;
    type SetStateAction<S> = S | ((prevState: S) => S);

    function createElement<P extends {}>(
      type: string | JSXElementConstructor<P>,
      props?: P | null,
      ...children: ReactNode[]
    ): ReactElement<P>;

    function Fragment(props: { children?: ReactNode }): ReactElement;
  }
}