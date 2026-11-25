# OTP Input

Accessible one-time code input for React: one box per digit for
verification codes from SMS or an authenticator app.

Install with `npx shadcn@latest add @upfork/otp-input`.

Entry point: `components/otp-input/otp-input.tsx`, export `OtpInput`.
Helpers: `lib/otp-helpers.ts` (`applyDigit`, `applyPaste`,
`applyBackspace`, `isComplete`). Demo: `demos/default.tsx`.

Key props: `length` (default 6), `value` / `defaultValue`,
`onChange(value)`, `onComplete(value)` (fires once when the last
box is filled), `mode` (`"numeric"` default, or `"alphanumeric"`),
`disabled`, `error`, `autoFocus`, `ariaLabel`, `name` (adds a
hidden input so the code submits with a plain HTML form).

Example:

```tsx
import { OtpInput } from "@/components/otp-input/otp-input";

<OtpInput length={6} onComplete={(code) => verify(code)} />
```

Typing advances to the next box, Backspace moves back, arrow keys
move between boxes, and pasting a whole code fills the boxes from
the focused one. No dependencies beyond React.
