/**
 * Pure helpers for the OTP input.
 *
 * The state is one slot per box: an array of single characters (or ""
 * for an empty box). A plain string cannot represent a gap — clearing
 * a middle box must leave that box empty while the digits after it
 * stay where they are — so the component keeps slots and only joins
 * them into a string for `value`, `onChange`, and `onComplete`.
 *
 * These helpers are free of React so the behaviour can be tested
 * without a DOM. The component in
 * `components/otp-input/otp-input.tsx` is a thin wrapper around them.
 */

/** Keep only the characters the input accepts, in order. */
export function filterChars(text: string, mode: "numeric" | "alphanumeric"): string {
  if (mode === "numeric") {
    return text.replace(/[^0-9]/g, "");
  }
  return text.replace(/[^0-9A-Za-z]/g, "");
}

/** A value string as slots, left-packed and cut to `length`. */
export function toSlots(value: string, length: number): string[] {
  const slots = value.split("").slice(0, length);
  while (slots.length < length) {
    slots.push("");
  }
  return slots;
}

/** Slots as the public value string. */
export function fromSlots(slots: string[]): string {
  return slots.join("");
}

/** True when every slot holds a character. */
export function isComplete(slots: string[]): boolean {
  return slots.length > 0 && slots.every((slot) => slot !== "");
}

/**
 * What the slots become when one character is typed into the box
 * at `index`. Returns `null` when the keystroke is not accepted
 * (for example a letter in numeric mode).
 */
export function applyDigit(
  slots: string[],
  index: number,
  char: string,
  mode: "numeric" | "alphanumeric",
): { slots: string[]; focus: number } | null {
  const clean = filterChars(char, mode);
  if (clean.length === 0) {
    return null;
  }
  const next = slots.slice();
  next[index] = clean[0] as string;
  return { slots: next, focus: Math.min(index + 1, slots.length - 1) };
}

/**
 * What the slots become when text is pasted starting at `index`.
 * The pasted text fills that box and the ones after it.
 */
export function applyPaste(
  slots: string[],
  index: number,
  pasted: string,
  mode: "numeric" | "alphanumeric",
): { slots: string[]; focus: number } {
  const clean = filterChars(pasted, mode);
  if (clean.length === 0) {
    return { slots: slots.slice(), focus: index };
  }
  const next = slots.slice();
  for (let i = 0; i < clean.length && index + i < next.length; i++) {
    next[index + i] = clean[i] as string;
  }
  const focus = Math.min(index + clean.length, next.length - 1);
  return { slots: next, focus };
}

/**
 * What the slots become when Backspace is pressed in the box at
 * `index`. If the box already holds a character, only that character
 * is cleared and focus stays; if it is empty, the previous box is
 * cleared and focus moves back.
 */
export function applyBackspace(
  slots: string[],
  index: number,
): { slots: string[]; focus: number } {
  const next = slots.slice();
  if (next[index] !== "") {
    next[index] = "";
    return { slots: next, focus: index };
  }
  if (index === 0) {
    return { slots: next, focus: 0 };
  }
  next[index - 1] = "";
  return { slots: next, focus: index - 1 };
}

/** What the slots become when the box at `index` is cleared. */
export function clearSlot(slots: string[], index: number): string[] {
  const next = slots.slice();
  next[index] = "";
  return next;
}
