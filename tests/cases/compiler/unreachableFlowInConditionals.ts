function foo() {}
function bar(): undefined { return undefined; }
function baz(): null { return null; }

if (foo()) {
    let unreachable = true;
}

if (bar()) {
    let unreachable = true;
}

if (baz()) {
    let unreachable = true;
}

foo() ? 1 : 0;
bar() ? 1 : 0;
baz() ? 1 : 0;