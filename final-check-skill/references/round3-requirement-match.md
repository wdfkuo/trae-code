# Round 3 — Matches the Request: Does It Do What the User Actually Asked For?

## Goal

Verify the deliverable matches the user's original intent. It is surprisingly easy to build something adjacent to what was asked and convince yourself it's the same thing. This round forces you to re-read the request and compare it line-by-line against what you produced.

## Process

1. **Re-read the user's original request.** If the request was long, re-read every paragraph. Pay special attention to:
   - Explicit deliverables ("write a function that…", "create a file called…")
   - Constraints ("must run in the browser", "must use Python 3", "no external libraries")
   - Success criteria ("should handle up to N items", "must produce a CSV file")
   - Negative requirements ("do NOT use framework X", "do not change existing files outside /src")

2. **Re-read any design document, spec, or agreed plan** that was produced during the brainstorming phase. Treat it as the source of truth for scope.

3. **Write the comparison out explicitly.** Produce a short bullet list in your working context of the form:
   - Request: "the function must accept a list of URLs and return their HTTP status codes"
     - Code: `checkUrls(urls)` in [file](file:///path/to/file) — accepts an array of strings, returns `{url, status}` objects. ✅ Match.
   - Request: "output saved to /workspace/results.csv"
     - Code: writes to `/workspace/results.csv`. ✅ Match.
   - Request: "no third-party dependencies"
     - Code: uses only Node built-ins. ✅ Match.

   Be honest. If a requirement is NOT met, flag it as `❌ Not met` and describe the gap.

4. **Check edge cases the user would reasonably expect to work:**
   - Empty input
   - Very small input (1 item)
   - Invalid input (garbage URL, negative number, malformed JSON)
   - Network / I/O failure scenario (if applicable)

   You do not need to code every edge case, but the code must not crash catastrophically on them.

5. **Check for scope creep and scope gap:**
   - Scope creep: did you add features the user didn't ask for? If they're cheap and harmless (e.g., a helpful CLI flag), keep them. If they add complexity or change the contract, remove them.
   - Scope gap: did you skip a requirement because you thought it was unimportant? If so, go back and implement it.

6. **If the project has a UI / visual component, perform a quick smoke check:**
   - Does the page load without JavaScript errors?
   - Does the main interaction the user requested actually work end-to-end?
   - Are labels, titles, and copy consistent with the request?

## Common Mismatches

- The user asked for a specific file path and you delivered to a different one
- The user asked for a specific output format (JSON, CSV, plain text) and you produced a different one
- The user asked for a command-line tool and you built a web UI, or vice versa
- The user asked for "no dependencies" and you added a library that required `npm install`
- The user asked for a specific function signature / API shape and you delivered a different one
- You solved a slightly harder / more general problem than asked, and the original problem is no longer the main path

## Fixing Issues Found

- If a requirement is not met, implement the missing behavior. Do NOT argue with yourself about whether the user "will be fine with what you have."
- If scope creep added unnecessary features, remove them. Simplicity is a feature.
- After fixing, re-run Round 1's execute test to ensure you didn't break anything.

## Pass Criteria

Round 3 passes when, for every requirement you can identify in the user's request or the agreed spec:
- Either it is implemented and demonstrable by running the code, OR
- It was explicitly out of scope in the agreed plan (and you have a record of that agreement)

There must be zero `❌ Not met` items by the end of this round.
