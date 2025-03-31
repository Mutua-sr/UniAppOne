declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element {
      type: any;
      props: any;
      key: string | number | null;
    }

    interface ElementClass {
      render(): Element;
    }

    interface ElementAttributesProperty {
      props: {};
    }

    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicAttributes {
      key?: string | number;
    }

    interface IntrinsicClassAttributes<T> {
      ref?: React.Ref<T>;
    }

    type IntrinsicElements = {
      [K in keyof HTMLElementTagNameMap]: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElementTagNameMap[K]>,
        HTMLElementTagNameMap[K]
      >;
    };
  }

  export function jsx(
    type: string | React.JSXElementConstructor<any>,
    props: any,
    key?: string | number | null
  ): JSX.Element;

  export function jsxs(
    type: string | React.JSXElementConstructor<any>,
    props: any,
    key?: string | number | null
  ): JSX.Element;

  export function jsxDEV(
    type: string | React.JSXElementConstructor<any>,
    props: any,
    key?: string | number | null,
    isStaticChildren?: boolean,
    source?: { fileName: string; lineNumber: number; columnNumber: number },
    self?: any
  ): JSX.Element;
}