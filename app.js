const form = document.querySelector("#tipForm");
const billInput = document.querySelector("#billAmount");
const customTipInput = document.querySelector("#customTip");
const peopleInput = document.querySelector("#peopleCount");
const tipButtons = Array.from(document.querySelectorAll(".tip-button"));

const tipAmountOutput = document.querySelector("#tipAmount");
const grandTotalOutput = document.querySelector("#grandTotal");
const perPersonOutput = document.querySelector("#perPerson");
const resultHint = document.querySelector("#resultHint");

const errors = {
  bill: document.querySelector("#billError"),
  tip: document.querySelector("#tipError"),
  people: document.querySelector("#peopleError"),
};

if (!billAmount || billAmount <= 0) {
  alert("Please enter a valid bill amount");
  return;
};

const wrappers = {
  bill: billInput.closest(".input-wrapper"),
  tip: customTipInput.closest(".input-wrapper"),
  people: peopleInput.closest(".input-wrapper"),
};

const state = {
  activePreset: null,
};

const MAX_BILL = 10_000_000;
const MAX_TIP = 100;

function parseDecimal(value) {
  const trimmed = value.trim();

  if (trimmed === "") {
    return { value: null, empty: true, valid: true };
  }

  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return { value: null, empty: false, valid: false };
  }

  return { value: Number(trimmed), empty: false, valid: true };
}

function parsePeople(value) {
  const trimmed = value.trim();

  if (trimmed === "") {
    return { value: null, empty: true, valid: true };
  }

  if (!/^\d+$/.test(trimmed)) {
    return { value: null, empty: false, valid: false };
  }

  return { value: Number(trimmed), empty: false, valid: true };
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function setError(field, message) {
  errors[field].textContent = message;
  wrappers[field].classList.toggle("has-error", Boolean(message));

  const input = field === "bill" ? billInput : field === "tip" ? customTipInput : peopleInput;

  if (message) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

function setActivePreset(value) {
  state.activePreset = value;

  tipButtons.forEach((button) => {
    const isActive = button.dataset.tip === value;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function validate() {
  const bill = parseDecimal(billInput.value);
  const customTip = parseDecimal(customTipInput.value);
  const people = parsePeople(peopleInput.value);

  const result = {
    bill: 0,
    tipPercent: state.activePreset ? Number(state.activePreset) : 0,
    people: 1,
    valid: true,
    hasEnoughInput: false,
  };

  if (!bill.valid) {
    setError("bill", "Enter a valid positive number, for example 2500 or 2500.50.");
    result.valid = false;
  } else if (!bill.empty && bill.value <= 0) {
    setError("bill", "Bill amount must be greater than 0.");
    result.valid = false;
  } else if (!bill.empty && bill.value > MAX_BILL) {
    setError("bill", "Bill amount is too large for this calculator.");
    result.valid = false;
  } else {
    setError("bill", "");
    result.bill = bill.value ?? 0;
  }

  if (!customTip.valid) {
    setError("tip", "Enter a valid tip percentage, for example 10 or 12.5.");
    result.valid = false;
  } else if (!customTip.empty && customTip.value < 0) {
    setError("tip", "Tip percentage cannot be negative.");
    result.valid = false;
  } else if (!customTip.empty && customTip.value > MAX_TIP) {
    setError("tip", `Tip percentage must be ${MAX_TIP}% or less.`);
    result.valid = false;
  } else {
    setError("tip", "");

    if (!customTip.empty) {
      result.tipPercent = customTip.value;
    }
  }

  if (!people.valid) {
    setError("people", "Enter a whole number, for example 1, 2, or 3.");
    result.valid = false;
  } else if (!people.empty && people.value < 1) {
    setError("people", "Number of people must be at least 1.");
    result.valid = false;
  } else if (!people.empty && !Number.isSafeInteger(people.value)) {
    setError("people", "Number of people is too large.");
    result.valid = false;
  } else {
    setError("people", "");
    result.people = people.value ?? 1;
  }

  result.hasEnoughInput = result.bill > 0 && result.people >= 1;

  return result;
}

function calculateAndRender() {
  const data = validate();

  if (!data.valid || !data.hasEnoughInput) {
    tipAmountOutput.textContent = formatMoney(0);
    grandTotalOutput.textContent = formatMoney(0);
    perPersonOutput.textContent = formatMoney(0);
    resultHint.textContent = data.valid
      ? "Add a bill amount to see the split."
      : "Fix the highlighted field to continue.";
    return;
  }

  const tipAmount = data.bill * (data.tipPercent / 100);
  const grandTotal = data.bill + tipAmount;

  // Rounding policy: each person pays the nearest 2-decimal amount for display.
  // The policy is explained in ANSWERS.md.
  const perPerson = grandTotal / data.people;

  tipAmountOutput.textContent = formatMoney(tipAmount);
  grandTotalOutput.textContent = formatMoney(grandTotal);
  perPersonOutput.textContent = formatMoney(perPerson);

  resultHint.textContent = `${data.people} ${data.people === 1 ? "person" : "people"} splitting at ${data.tipPercent}% tip.`;
}

tipButtons.forEach((button) => {
  button.addEventListener("click", () => {
    customTipInput.value = "";
    setActivePreset(button.dataset.tip);
    calculateAndRender();
  });
});

[billInput, customTipInput, peopleInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (input === customTipInput && customTipInput.value.trim() !== "") {
      setActivePreset(null);
    }

    calculateAndRender();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();

    const focusOrder = [billInput, customTipInput, peopleInput];
    const currentIndex = focusOrder.indexOf(input);
    const nextInput = focusOrder[currentIndex + 1];

    if (nextInput) {
      nextInput.focus();
    } else {
      input.blur();
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

form.addEventListener("reset", () => {
  setTimeout(() => {
    setActivePreset(null);
    Object.keys(errors).forEach((field) => setError(field, ""));
    calculateAndRender();
    billInput.focus();
  }, 0);
});

calculateAndRender();
