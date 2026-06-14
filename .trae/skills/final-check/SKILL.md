---
name: "final-check"
description: "MANDATORY final quality gate before delivering any project. Invoke when preparing to announce completion or provide final links. Checks runnability, quality, requirements, and delivery."
---

# Final Check — The Project Delivery Gate

This skill runs automatically the moment you are about to deliver a completed project to the user. Its job is to verify that the output is genuinely runnable, genuinely correct, and genuinely matches what the user asked for — before the user sees it.

You must run final-check whenever:
- You have completed all implementation tasks and every todo item is marked completed
- You are about to write "done" / "completed" / "here's the result" or similar
- You are about to present final file links to the user
- A subagent just returned "task completed" and you are about to relay that to the user

<HARD-GATE>
Do NOT declare project completion, do NOT deliver final file links, do NOT write a final summary,
and do NOT tell the user "we're done" until final-check has completed all rounds below.
This applies to EVERY project regardless of perceived simplicity.
</HARD-GATE>

## The Four Rounds

Run the following four rounds **in order**. Each round is defined in detail in its own reference file.

1. **Round 1 — Runnable** — verify the code actually compiles, runs, and has no missing dependencies or obvious setup problems. See `.trae/skills/final-check/references/round1-runnability.md`.
2. **Round 2 — Quality** — verify no logical errors, unsafe patterns, leftover debug code, or stylistic problems. See `.trae/skills/final-check/references/round2-quality.md`.
3. **Round 3 — Matches the Request** — verify the output actually does what the user asked for, not something adjacent. See `.trae/skills/final-check/references/round3-requirement-match.md`.
4. **Round 4 — Delivery Ready** — verify the final output is clean, complete, and ready to hand to the user. See `.trae/skills/final-check/references/round4-delivery.md`.

## Round Flow Control

For each round:
1. Read the round's reference file and follow its instructions exactly.
2. If the round reveals a problem, **fix it immediately**, then **re-run the SAME round** from the start.
3. If the same round fails 3 times in a row despite attempts to fix, document the unresolved issue and proceed to the next round — do not loop infinitely.
4. A round "passes" when its pass criteria (stated in the reference file) are satisfied.
5. Move to the next round only after the current round passes. Do NOT revisit earlier rounds unless a later round explicitly reveals a problem that originated in an earlier round.

## Terminal State

After all four rounds pass, you may deliver the project to the user. Your delivery message should:
- Briefly summarize what was built (see round 4 reference for the format)
- Provide valid file links for the key deliverables
- Tell the user how to run / use the result (one clear command or two at most)

## Key Principles

- **Run the code**, don't just read it. A build/test that actually executes catches more than any amount of static reviewing.
- **Be honest about problems.** If something doesn't work, fix it rather than deliver it.
- **Stick to the round order.** The rounds are ordered so each one builds on the previous one having passed.
- **Three-fix cap.** Don't spend tokens forever on a single round. After 3 failed fixes, note the issue and move on — report it transparently to the user in the final summary.
- **No bypass.** The HARD-GATE applies even to "obviously simple" projects.
