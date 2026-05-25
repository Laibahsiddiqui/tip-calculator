# ANSWERS.md

## 1. How to run

No dependencies are required because this project uses vanilla HTML, CSS, and JavaScript.

To run it on a fresh machine:

1. Download or clone the repository.
2. Open the project folder.
3. Open `index.html` directly in a modern browser.

Alternatively, if Python is installed, run:

```bash
python3 -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

On Windows, this command may be:

```bash
python -m http.server 5173
```

I have not included a deployed URL in this submission. If deployed later, I would use GitHub Pages or Netlify because this is a static frontend project.

---

## 2. Stack & design choices

I chose vanilla HTML, CSS, and JavaScript because the task is interaction-focused but not large enough to require a framework. This keeps the project easy to run on a fresh machine, avoids dependency installation, and makes the live calculation, validation, and DOM updates straightforward to review.

Two specific design and interaction decisions:

1. **Two-panel layout for inputs and results**  
   I placed the inputs on the left and the live output panel on the right on larger screens. This makes the cause-and-effect relationship clear: the user changes values on one side and immediately sees the result on the other. On smaller screens, the layout becomes a single column so the form remains readable.

2. **Visually distinct active tip preset**  
   The selected preset button receives an `.active` class and `aria-pressed="true"`. This makes it obvious which preset is currently controlling the calculation. When the user types a custom tip, the active preset is cleared so the interface does not show two competing tip choices.

Rounding policy:

The calculator displays all money values rounded to the nearest two decimal places using `Intl.NumberFormat`. I chose this because the app is a quick bill-splitting calculator, and two decimal places are the normal display format for currency-style totals. Internally, the per-person value is calculated from the unrounded grand total, then formatted for display. With another day, I would add an optional "settle exactly" mode that distributes any one-paisa/cent remainder across people so the displayed shares add up exactly to the displayed grand total.

---

## 3. Responsive & accessibility

On a **360px-wide phone**, the app switches to a single-column layout. The result panel sits below the inputs and becomes sticky near the bottom so the user can still see the calculation while editing. The tip buttons also stack vertically on very narrow screens to avoid cramped tap targets.

On a **1440px laptop**, the app uses a wider two-column card. Inputs are grouped on the left, while the live totals are grouped in a stronger visual result panel on the right. This uses the available horizontal space and reduces unnecessary scrolling.

One accessibility consideration I handled:

- The form uses real labels, fieldsets, legends, visible focus states, `aria-live` error messages, and `aria-invalid` on invalid fields. The tip preset buttons also use `aria-pressed` so screen reader users can understand which option is active.

One accessibility consideration I knowingly skipped:

- I did not add a full automated accessibility test setup or screen-reader-specific end-to-end testing. For this small assessment, I focused on semantic HTML, keyboard navigation, visible focus states, and inline error messages. With another day, I would test it with VoiceOver/NVDA and add automated checks with tools like axe.

---

## 4. AI usage

I used ChatGPT to help structure the project and generate an initial version of the vanilla HTML, CSS, JavaScript, README, and assessment answers.

Specific AI-assisted areas:

1. I asked for a simple frontend implementation for a tip calculator that updates live without a calculate button.
2. I asked for inline validation logic for bill amount, tip percentage, and number of people.
3. I asked for README and ANSWERS.md wording aligned with the assessment instructions.

One thing I changed from the AI output:

The initial idea used numeric inputs, but I changed the inputs to `type="text"` with `inputmode="decimal"` or `inputmode="numeric"`. I did this because browser number inputs can allow awkward values like `e`, `+`, or `-` depending on the browser, and they can trigger browser-default validation behavior. The assessment specifically asks for inline validation, so text inputs gave me more control over pasted garbage text, custom error messages, and mobile keyboards.

Another change:

The basic layout idea was a simple vertical form. I changed it into a two-panel design on larger screens because the key interaction is live feedback. Keeping results visible beside the inputs makes the update feel immediate and easier to test.

---

## 5. Honest gap

One thing that is not polished enough is the rounding behavior for exact group settlement. The app displays each person's share rounded to the nearest two decimal places, but if many people split a bill, the displayed per-person amount multiplied by the number of people may differ from the displayed grand total by a tiny rounding amount.

With another day, I would add a detailed split breakdown. For example, if the exact division creates a remainder, the app could show that some people pay one paisa/cent more so the group total exactly matches the bill plus tip. That would make the calculator stronger for real-world settlement, not just quick estimation.
