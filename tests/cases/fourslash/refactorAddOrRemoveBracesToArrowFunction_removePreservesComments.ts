/// <reference path='fourslash.ts' />

////const foo = /*m1*/a/*m2*/ => { // c1
////    return a; // c2
////}

goTo.select("m1", "m2");
edit.applyRefactor({
    refactorName: "Add or remove braces in an arrow function",
    actionName: "Remove braces from arrow function",
    actionDescription: "Remove braces from arrow function",
    newContent: `const foo = a => /* c1*/ a /* c2*/`,
});
