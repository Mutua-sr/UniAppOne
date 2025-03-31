declare module 'react' {
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }

  export type FC<P = {}> = FunctionComponent<P>;

  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  export type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<any, any>);
  export type Key = string | number;

  export interface Component<P = {}, S = {}, SS = any> {
    render(): ReactNode;
  }

  export type ReactNode = ReactElement | ReactText | ReactFragment | ReactPortal | boolean | null | undefined;
  export type ReactText = string | number;
  export type ReactFragment = {} | Iterable<ReactNode>;
  export interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }
}