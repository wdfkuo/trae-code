# Round 4 — Delivery Ready: Is This Clean and Self-Explanatory?

## Goal

Make sure what you hand to the user is clean, complete, and usable without you there to explain it. This is the "polish and packaging" round.

## Checklist

1. **No detritus.** Confirm there are no scratch files, `.tmp.*` files, `*-old.js`, `test-output.txt`, or other throwaway files mixed into the deliverable directory that you created during development and did not clean up. If they exist, delete them.

2. **The entry point is obvious.** A user scanning the output directory should be able to tell at a glance which file to run. If the entry point is non-obvious, make it obvious by one of: a short instruction in your final message, a top-level `README`, or a clearly-named entry file (e.g., `main.py`, `index.js`, `index.html`).

3. **File links in the final message are valid.** Before sending the final message, re-read every file path you are about to link to. Each path must:
   - Exist on disk
   - Resolve from a reasonable working directory (absolute paths are preferred for linking in your message; relative paths are fine when inside the code itself)
   - Point to the file the user actually needs, not an intermediate or outdated version

4. **How-to-run instruction works.** Write the one-line run instruction you plan to give the user. Then **actually run it** from a clean state (or as clean as you can make it in this environment). It must work. If it requires prior setup (`npm install`, setting an env var), state that setup step in the message BEFORE the run command.

5. **README / summary exists (when needed).** If the deliverable is more than a single file, there should be either:
   - A brief inline summary in your final message, OR
   - A short README or comment block at the top of the entry file

   The summary should answer:
   - What this is
   - One command to run it
   - One sentence about what to expect

   Keep it short. A paragraph or a short bullet list is enough.

6. **No lingering absolute paths that only make sense on your machine.** If the code references `/home/you/...` or `/workspace/specific-path-that-only-exists-here/...`, replace with relative paths or a configurable root.

7. **Line endings and encoding sanity.** Files should be plain UTF-8. No `\r\n` / `\n` mixing unless the project explicitly calls for Windows line endings.

8. **Final message draft.** Before sending to the user, mentally compose your final message and check it against:
   - Does it open with what was built, in one sentence?
   - Does it link to the key files using valid file paths?
   - Does it tell the user one clear command to run it?
   - Does it avoid jargon and tokenspeak?
   - Is it concise (roughly 100–300 words for most projects)?

## Common Things That Fail This Round

- A scratch file `debug.log` or `test-1.js` sitting next to the real deliverable
- The final message links to a file you renamed at the last minute
- The run command in the final message assumes `npm install` was already run, but you never documented that step
- A leftover absolute path like `/workspace/temp/data.json` that only exists during your session
- The user is told to run `python3 script.py` but the actual file is `script.js`

## Pass Criteria

Round 4 passes when:
- The deliverable directory contains only files the user needs
- Every file link you will send points to a file that exists
- The how-to-run instruction you will send has been tested and works
- The final message you are about to compose is short, clear, and accurate

Once this round passes, the HARD-GATE lifts. You may now deliver the project to the user.
