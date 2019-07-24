type Foo<T> = { items: T };

const Something = [];

type SomeFoo = Foo<Something>;

const x: Something = [];

type LiteralNumberFoo = Foo<1>;
type LiteralStringFoo = Foo<'test'>;