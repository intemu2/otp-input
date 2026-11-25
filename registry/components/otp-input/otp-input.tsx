import * as React from "react";

import {
  applyBackspace,
  applyDigit,
  applyPaste,
  clearSlot,
  filterChars,
  fromSlots,
  isComplete,
  toSlots,
} from "../../lib/otp-helpers";

export type OtpInputProps = {
  /** Number of boxes. Defaults to 6. */
  length?: number;
  /** Controlled value. Leave unset for uncontrolled use. */
  value?: string;
  /** Starting value for uncontrolled use. Defaults to "". */
  defaultValue?: string;
  /** Called with the full value on every change. */
  onChange?: (value: string) => void;
  /** Called once when the last empty box is filled. */
  onComplete?: (value: string) => void;
  /** "numeric" accepts digits only; "alphanumeric" also accepts letters. Defaults to "numeric". */
  mode?: "numeric" | "alphanumeric";
  /** Disables every box. Defaults to false. */
  disabled?: boolean;
  /** Shows the error state (red border, shake, aria-invalid). Defaults to false. */
  error?: boolean;
  /** Focuses the first box on mount. Defaults to false. */
  autoFocus?: boolean;
  /** Accessible name for the group. Defaults to "One-time code". */
  ariaLabel?: string;
  /** Extra classes for the group wrapper. */
  className?: string;
  /** Extra classes for each box. */
  inputClassName?: string;
  /** id for the group; each box gets `${id}-${index}`. */
  id?: string;
  /**
   * Form field name. When set, a hidden input carries the value so
   * the code submits with a plain HTML form.
   */
  name?: string;
};

/**
 * One-time code input: one box per character, with auto-advance,
 * backspace navigation, arrow-key navigation, and paste support.
 *
 * No dependencies beyond React. Works controlled or uncontrolled.
 *
 * @example
 * ```tsx
 * <OtpInput length={6} onComplete={(code) => verify(code)} />
 * ```
 */
export function OtpInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  mode = "numeric",
  disabled = false,
  error = false,
  autoFocus = false,
  ariaLabel = "One-time code",
  className = "",
  inputClassName = "",
  id,
  name,
}: OtpInputProps) {
  const isControlled = value !== undefined;
  const [innerSlots, setInnerSlots] = React.useState<string[]>(() =>
    toSlots(defaultValue, length),
  );
  const slots = isControlled ? toSlots(value as string, length) : innerSlots;
  const current = fromSlots(slots);
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
  const completedRef = React.useRef<string | null>(null);

  const focusBox = (index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    inputsRef.current[clamped]?.focus();
  };

  const commit = (nextSlots: string[]) => {
    if (!isControlled) {
      setInnerSlots(nextSlots);
    }
    const next = fromSlots(nextSlots);
    onChange?.(next);
    if (isComplete(nextSlots)) {
      if (completedRef.current !== next) {
        completedRef.current = next;
        onComplete?.(next);
      }
    } else {
      completedRef.current = null;
    }
  };

  const handleChange = (index: number, raw: string) => {
    const clean = filterChars(raw, mode);
    if (clean.length === 0) {
      // Cleared on a keyboard that never fires keydown (some mobile
      // keyboards): empty just this box.
      if (raw === "" && slots[index] !== "") {
        commit(clearSlot(slots, index));
      }
      return;
    }
    const result =
      clean.length > 1
        ? applyPaste(slots, index, clean, mode)
        : applyDigit(slots, index, clean, mode);
    if (result === null) {
      return;
    }
    commit(result.slots);
    focusBox(result.focus);
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const result = applyBackspace(slots, index);
      if (fromSlots(result.slots) !== current) {
        commit(result.slots);
      }
      focusBox(result.focus);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
      return;
    }
    if (event.key === "Delete") {
      event.preventDefault();
      if (slots[index] !== "") {
        commit(clearSlot(slots, index));
      }
    }
  };

  const handlePaste = (
    index: number,
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text");
    const result = applyPaste(slots, index, pasted, mode);
    commit(result.slots);
    focusBox(result.focus);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const boxes = Array.from({ length }, (_, index) => {
    const char = slots[index] ?? "";
    return (
      <input
        key={index}
        ref={(el) => {
          inputsRef.current[index] = el;
        }}
        id={id === undefined ? undefined : `${id}-${index}`}
        type="text"
        inputMode={mode === "numeric" ? "numeric" : "text"}
        autoComplete={index === 0 ? "one-time-code" : "off"}
        autoFocus={autoFocus && index === 0}
        aria-label={`${ariaLabel} digit ${index + 1} of ${length}`}
        aria-invalid={error}
        disabled={disabled}
        maxLength={1}
        value={char}
        onChange={(event) => handleChange(index, event.target.value)}
        onKeyDown={(event) => handleKeyDown(index, event)}
        onPaste={(event) => handlePaste(index, event)}
        onFocus={handleFocus}
        className={[
          "h-12 w-11 rounded-lg border bg-white text-center text-xl font-semibold",
          "text-zinc-900 placeholder:text-zinc-300",
          "outline-none transition-colors",
          "focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20",
          "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50",
          "dark:focus:border-zinc-100 dark:focus:ring-zinc-100/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400 dark:focus:border-red-400"
            : "border-zinc-300",
          inputClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  });

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={["flex items-center gap-2", error ? "otp-shake" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {boxes}
      {name !== undefined ? (
        <input type="hidden" name={name} value={current} readOnly />
      ) : null}
    </div>
  );
}
