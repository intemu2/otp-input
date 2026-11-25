# OTP Input

Accessible one-time code input for React, written the way shadcn/ui
components are: one box per digit, no dependencies beyond React.

## Install

```bash
npx shadcn@latest add @upfork/otp-input
```

## Use

```tsx
import { OtpInput } from "@/components/otp-input/otp-input";

export function VerifyForm() {
  return <OtpInput length={6} onComplete={(code) => verify(code)} />;
}
```

## Behaviour

- Typing a digit fills the box and moves to the next one.
- Backspace clears the current box, or the previous one when the
  current box is empty, and moves focus back.
- Arrow keys move between boxes. Pasting a whole code fills the
  boxes from the focused one.
- `onComplete` fires once, when the last empty box is filled.
- Controlled (`value` + `onChange`) or uncontrolled
  (`defaultValue`) — your call.
- `mode="numeric"` (default) accepts digits only;
  `mode="alphanumeric"` also accepts letters.
- `error` shows the red border, a shake, and `aria-invalid`.
- `name` adds a hidden input so the code submits with a plain
  HTML form. The first box uses `autoComplete="one-time-code"`,
  so browsers and SMS autofill can offer the code.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `length` | `number` | `6` | Number of boxes |
| `value` | `string` | — | Controlled value |
| `defaultValue` | `string` | `""` | Starting value, uncontrolled |
| `onChange` | `(value: string) => void` | — | Every change |
| `onComplete` | `(value: string) => void` | — | Fires once when complete |
| `mode` | `"numeric" \| "alphanumeric"` | `"numeric"` | Accepted characters |
| `disabled` | `boolean` | `false` | Disables every box |
| `error` | `boolean` | `false` | Error state |
| `autoFocus` | `boolean` | `false` | Focuses the first box on mount |
| `ariaLabel` | `string` | `"One-time code"` | Group name |
| `className` | `string` | `""` | Extra classes, group wrapper |
| `inputClassName` | `string` | `""` | Extra classes, each box |
| `id` | `string` | — | Boxes get `${id}-${index}` |
| `name` | `string` | — | Hidden input for form submit |

## Files

- `components/otp-input/otp-input.tsx` — the component
- `lib/otp-helpers.ts` — pure helpers (typing, paste, backspace)
- `demos/default.tsx` — live demo
- `app/globals.css` — the shake keyframes and the product's variables

## License

MIT. See `LICENSE` at the repository root.
