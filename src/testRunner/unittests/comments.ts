namespace ts {
    describe("comment parsing", () => {
        const withShebang = `#! node
/** comment */
// another one
;`;
        const noShebang = `/** comment */
// another one
;`;
//        const withTrailing = `;/* comment */
// another one
// `;
        it("skips shebang", () => {
            const result = getLeadingCommentRanges(withShebang, 0);
            assert.isDefined(result);
            assert.strictEqual(result!.length, 2);
        });

        it("treats all comments at start of file as leading comments", () => {
            const result = getLeadingCommentRanges(noShebang, 0);
            assert.isDefined(result);
            assert.strictEqual(result!.length, 2);
        });

/*
        it("returns leading comments if position is not 0", () => {
            const result = getLeadingCommentRanges(withTrailing, 1);
            assert.isDefined(result);
            assert.strictEqual(result!.length, 1);
            assert.strictEqual(result![0].kind, SyntaxKind.SingleLineCommentTrivia);
        });
*/

        interface CommentRangeCallback {
            start: number;
            end: number;
            text: string;
            kind: CommentKind;
        }

        function getForEachCommentInRangeCallbackInvocations(input: string, rangeStart?: number, rangeEnd?: number): CommentRangeCallback[] {
            const calls: CommentRangeCallback[] = [];
            forEachCommentInRange(input, (start, end, kind) => {
                calls.push({ start, end, kind, text: input.substring(start, end) });
            }, rangeStart, rangeEnd);

            return calls;
        }

        it("forEachCommitInRange should not double report line comments", () => {
            const input = "// c1 // c2";
            const calls = getForEachCommentInRangeCallbackInvocations(input);
            assert.strictEqual(calls.length, 1);
            assert.strictEqual(calls[0].text, "// c1 // c2");
            assert.strictEqual(calls[0].kind, SyntaxKind.SingleLineCommentTrivia);
        });

        it("forEachCommitInRange should not double report nested multi-line comments", () => {
            const input = "/* c1 /* c2 */ */";
            const calls = getForEachCommentInRangeCallbackInvocations(input);
            assert.strictEqual(calls.length, 1);
            assert.strictEqual(calls[0].text, "/* c1 /* c2 */");
            assert.strictEqual(calls[0].kind, SyntaxKind.MultiLineCommentTrivia);
        });

        it("forEachCommitInRange invalid ranges should not parse", () => {
            const failOnCall = (s: number, e: number, k: CommentKind) => {
                const kindString = k === SyntaxKind.SingleLineCommentTrivia ? "single-line" : "multi-line";
                assert.fail(undefined, undefined, `(${s}, ${e}, ${kindString})`);
            };
            forEachCommentInRange("", failOnCall, 0, 1);
            forEachCommentInRange("/* test */", failOnCall, -1, 3); // negative start
            forEachCommentInRange("/* test */", failOnCall, 0, 20); // end outside of range
            forEachCommentInRange("/* test */", failOnCall, 2, 1); // start greater than end
            forEachCommentInRange("/* test */", failOnCall, 0, 11); // end on boundary of range
            forEachCommentInRange("/* test */", failOnCall, 1, 1); // empty range
        });

        it("forEachCommentInRange should parse comments on the same line", () => {
            const input = "/* c1 */ /* c2 */ // c3";
            const calls = getForEachCommentInRangeCallbackInvocations(input);
            assert.strictEqual(calls.length, 3);
            assert.strictEqual(calls[0].text, "/* c1 */");
            assert.strictEqual(calls[0].kind, SyntaxKind.MultiLineCommentTrivia);
            assert.strictEqual(calls[1].text, "/* c2 */");
            assert.strictEqual(calls[1].kind, SyntaxKind.MultiLineCommentTrivia);
            assert.strictEqual(calls[2].text, "// c3");
            assert.strictEqual(calls[2].kind, SyntaxKind.SingleLineCommentTrivia);
        });

        it("forEachCommentInRange should parse both kinds of comment", () => {
            const calls = getForEachCommentInRangeCallbackInvocations(noShebang);

            assert.strictEqual(calls.length, 2);
            assert.strictEqual(calls[0].start, 0);
            assert.strictEqual(calls[0].end, 14);
            assert.strictEqual(calls[0].kind, SyntaxKind.MultiLineCommentTrivia);
            assert.strictEqual(calls[0].text, "/** comment */");
            assert.strictEqual(calls[1].start, 15);
            assert.strictEqual(calls[1].end, 29);
            assert.strictEqual(calls[1].kind, SyntaxKind.SingleLineCommentTrivia);
            assert.strictEqual(calls[1].text, "// another one");
        });
    });
}
