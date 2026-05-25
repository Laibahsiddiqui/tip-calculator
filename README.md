# Tip Calculator & Bill Splitter

A single-screen frontend assessment project built with vanilla HTML, CSS, and JavaScript.

The app lets users enter:

- bill amount in PKR/Rs
- preset or custom tip percentage
- number of people

It updates the total tip, grand total, and per-person share live as the user types.

## How to run locally

No package installation is required.

### Option 1: Open directly

Open `index.html` in any modern browser.

### Option 2: Run with a local server

If Python is installed, run this command from the project folder:

```bash
python3 -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

On Windows, if `python3` does not work, try:

```bash
python -m http.server 5173
```

## Files

```text
.
├── index.html
├── styles.css
├── app.js
├── README.md
└── ANSWERS.md
```

## Suggested commit history

If you are submitting this through GitHub, do not upload it as one single commit. A simple history could be:

```bash
git init
git add index.html styles.css
git commit -m "Create calculator layout and responsive styling"

git add app.js
git commit -m "Add live tip calculation and preset selection"

git add app.js styles.css
git commit -m "Add inline validation and reset behavior"

git add README.md ANSWERS.md
git commit -m "Add project documentation and assessment answers"
```
