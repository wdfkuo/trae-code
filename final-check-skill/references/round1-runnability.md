# Round 1 — Runnable: Does It Actually Work?

## Goal

Prove the code runs from a cold start. This round is NOT about code quality or feature match — it only answers one question: can the user take the output and make it run without debugging?

## Checklist

Go through every item below. For YES items, confirm with an actual action (running a command, reading a file). For NO items, fix before the round can pass.

### A. Files and Paths

1. [ ] Every output file that was promised actually exists on disk at the path where it should be. Verify with `ls` or `stat`; do not trust memory.
2. [ ] No promised file is empty (size 0). Check file sizes.
3. [ ] The main / entry file is at the expected path and has a shebang or entry-point marker where applicable.
4. [ ] File references inside the code (import paths, `require()`, `<link href>`, `<script src>`, file opens) point to files that actually exist.

### B. Dependencies and Configuration

5. [ ] If the project declares dependencies (`package.json`, `requirements.txt`, `Pipfile`, `Cargo.toml`, `pom.xml`, `Gemfile`, `go.mod`, etc.), the file exists and lists every dependency the code actually uses.
6. [ ] Any required config file (`.env.example`, `config.yaml`, `docker-compose.yml`, etc.) exists and contains valid placeholder values or instructions.
7. [ ] There are no references to environment variables, ports, paths, or secrets that the user would not be able to set up without documentation.

### C. The Execute Test

8. [ ] **Run the code.** Use the most natural command for the project type:
   - Node.js/JS: try `node <entry>`, or `npm run build` / `npm start` if configured
   - Python: try `python <entry>.py`, or `python -m <module>`
   - Go: `go build ./...` then `./<binary>`, or `go run ./...`
   - Rust: `cargo check` then `cargo build` / `cargo run`
   - Java: `javac <files>` then `java <main>`
   - Shell scripts: `bash -n <script>` (syntax check) then actually run it if safe
   - Frontend (webpack/vite/etc.): `npm run build` or the configured build command
   - Static HTML: serve it (`python3 -m http.server`) and verify the page loads without 404s
9. [ ] The run produces NO uncaught exceptions, "module not found" errors, missing-file errors, or obvious setup crashes. Warnings are tolerable; hard errors are not.
10. [ ] If the project has a test script (`npm test`, `pytest`, `cargo test`, etc.), run it. Tests must pass, or at minimum not crash the test runner.

### D. Entry Point and Startup

11. [ ] The first thing the user is told to run in the final delivery message actually works — test exactly that command.
12. [ ] The output directory is clean: the entry point does not depend on files that exist only in your working directory but not in the deliverable.

## Common Things That Fail This Round

- An import statement references a file you forgot to create
- A `require('some-dep')` but that dep is not in `package.json`
- A Python file imports a module not in `requirements.txt`
- A `process.env.VAR` is used but `.env.example` does not list it
- A relative path in the code assumes you're running from a specific directory that is not the default
- An HTML file references a CSS/JS file that was never written
- A shell script is missing `chmod +x` and the user would hit "permission denied" (document this in the final message if the script must be executable)

## Fixing Issues Found

When you find a problem in this round:
1. Fix it (add the missing file, add the missing dependency, correct the path, etc.).
2. Re-run the EXECUTE TEST (step 8 above) again from scratch.
3. If the fix requires a dependency install, install it and re-test with the dependency in place.

## Pass Criteria

Round 1 passes when:
- Every output file exists at its promised path
- The natural run-or-build command completes without errors
- Any configured test command runs without crash-level failures
- The entry-point command you will tell the user actually works
