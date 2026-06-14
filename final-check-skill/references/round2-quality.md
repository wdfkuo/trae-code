# Round 2 — Quality: Is This Code You'd Be Willing To Deliver?

## Goal

Confirm the code is free of obvious bugs, unsafe patterns, leftover debug scaffolding, and style issues that would cause a reader to lose confidence.

## Checklist

Read through the deliverable files. For each file, scan for the items below. Finding any "red flag" item means the round must be treated as FAILED and fixed.

### A. Logical Errors and Runtime Risk

1. [ ] No obvious off-by-one errors, inverted conditions, or wrong-variable bugs in the critical path.
2. [ ] Every `try` / `catch` (or equivalent) block either handles the error or re-raises it with useful context — no silently swallowed errors.
3. [ ] Every `if` branch that must not be silently skipped has a sensible `else` or default behavior.
4. [ ] No infinite loops or recursion that will blow the stack on realistic input.
5. [ ] Null / undefined / None values are handled on paths where they can occur. No "cannot read property of undefined" style crashes waiting to happen.

### B. Security and Hardcoded Values

6. [ ] No hardcoded secrets, API keys, passwords, or tokens in the source files. If config needs a value, it must come from environment or a config file the user fills in.
7. [ ] No SQL-injection-prone string interpolation (e.g., `"SELECT * FROM users WHERE id = " + userInput`). Use parameterized queries or an ORM.
8. [ ] No `eval()` / `exec()` of user-provided input without sanitization, and ideally not at all.
9. [ ] No `chmod 777`, `--no-check-certificate`, or other disabled-security flags unless absolutely necessary and documented.
10. [ ] No paths constructed from raw user input that could result in path-traversal (e.g., `"/var/data/" + user_input` without sanitizing `../`).

### C. Leftover Debug and Temporary Code

11. [ ] No `console.log`, `print()`, `dbg!()`, `System.out.println`, or similar debug prints left in production paths — unless they are intentional, user-facing log output.
12. [ ] No `TODO`, `FIXME`, `HACK`, `XXX`, or `REMOVE THIS` comments left in the code. If a comment says "fix this later", it's later now.
13. [ ] No commented-out code blocks. Remove them. Version control remembers.
14. [ ] No test fixtures, sample data, or scratch files that would confuse the user about what is real vs. what is a throwaway.

### D. Style and Readability

15. [ ] Consistent indentation throughout the file. If the project has a linter/prettier config, the code passes it or at minimum does not have wildly inconsistent style.
16. [ ] Variable and function names describe what they hold / do. No `a`, `temp`, `x`, `foo` for meaningful values.
17. [ ] No functions longer than ~80 lines without a good reason. If a file is doing everything, consider whether it needs splitting — but only split if the split genuinely improves clarity and is within the scope of the deliverable.
18. [ ] No magic numbers pulled out of thin air. If a value like `3600` or `0.01` is used, it should either be a named constant or have a comment explaining the source.

## Common Things That Fail This Round

- A `console.log("DEBUG: got here")` that was never removed
- A commented-out block of older code
- `if (user) { ... }` with no `else`, and downstream code assumes `user` exists
- A hardcoded port number that is also hardcoded somewhere else and the two differ
- A `try { ... } catch (e) {}` empty catch block that silently swallows errors

## Fixing Issues Found

When you find a problem in this round:
1. Fix it directly in the deliverable file.
2. Re-run Round 1's execute test (the build/run command) if your fix could affect runtime behavior — do not assume you didn't introduce a bug while fixing.
3. Re-check this round's checklist for the file you edited.

## Pass Criteria

Round 2 passes when a file-by-file scan of every deliverable finds:
- No red-flag items (items 1–14 above all clear)
- No deliberately sloppy style that would embarrass you in a code review
- Confidence that running the code will not produce obvious runtime surprises beyond those already handled
