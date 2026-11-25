# Listing

- **Title:** OTP Input — accessible one-time code input for React
- **URL name:** `otp-input`
- **Summary:** One box per digit for verification codes: auto-advance, backspace and arrow-key navigation, paste a whole code, controlled or uncontrolled, numeric or alphanumeric. No dependencies beyond React.
- **Categories:** form, authentication, input
- **Tags:** otp, verification-code, pin-input, one-time-code, react, tailwind, shadcn, accessible
- **License:** MIT
- **Price:** free

## Description

Every sign-in, checkout, and password reset asks for a code from
an SMS or an authenticator app — and most hand-rolled inputs get
the small things wrong: focus does not move, paste fills one box,
backspace does nothing useful, screen readers hear six unrelated
fields.

OTP Input is one component that gets those details right:

- **One box per digit.** Typing fills the box and moves on;
  backspace clears and moves back; arrow keys move between boxes.
- **Paste works.** Pasting `483920` fills all six boxes from the
  focused one, instead of stuffing the whole code into a single box.
- **Complete means complete.** `onComplete` fires once, the moment
  the last empty box is filled — wire it straight to your verify call.
- **Controlled or uncontrolled.** Pass `value` and `onChange`, or
  just `defaultValue` and `onComplete`.
- **Numeric or alphanumeric.** Digits only by default; letters too
  with `mode="alphanumeric"`.
- **Forms included.** Set `name` and a hidden input carries the
  code on a plain HTML submit. The first box uses
  `autoComplete="one-time-code"`, so browsers and SMS autofill can
  offer the code.
- **Accessible.** A labelled group, one label per box
  ("One-time code digit 3 of 6"), `aria-invalid` on error, and a
  visible error state with a shake.
- **No dependencies beyond React.** Tailwind classes only, strict
  TypeScript, and the typing/paste/backspace rules live in a small
  tested helper module (`lib/otp-helpers.ts`).

Drop it into any React project with Tailwind CSS. The demo shows
the live component with a reset button and an error-state toggle.
