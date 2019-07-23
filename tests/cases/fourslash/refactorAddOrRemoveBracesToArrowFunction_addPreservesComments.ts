/// <reference path='fourslash.ts' />

////const foo = /*m1*/a/*m2*/ => /* c1 */ a /* c2 */; /* c3 */

goTo.select("m1", "m2");
edit.applyRefactor({
    refactorName: "Add or remove braces in an arrow function",
    actionName: "Add braces to arrow function",
    actionDescription: "Add braces to arrow function",
    newContent: `const foo = a => {
    return /* c1 */ a /* c2 */;
}`,
});
