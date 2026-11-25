// @upfork layout=centered background=dots
import * as React from "react";

import { OtpInput } from "@/components/otp-input/otp-input";

/**
 * Default demo: type or paste a 6-digit code, watch the status
 * change when it is complete, then reset and try again.
 */
export default function Default() {
  const [code, setCode] = React.useState("");
  const [completed, setCompleted] = React.useState<string | null>(null);
  const [error, setError] = React.useState(false);

  const reset = () => {
    setCode("");
    setCompleted(null);
    setError(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <OtpInput
        length={6}
        value={code}
        onChange={(next) => {
          setCode(next);
          setError(false);
        }}
        onComplete={(next) => setCompleted(next)}
        error={error}
        ariaLabel="Demo one-time code"
      />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {completed !== null
          ? `Code complete: ${completed}`
          : code.length > 0
            ? `${code.length} of 6 digits entered`
            : "Type or paste a 6-digit code"}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setError(true)}
          className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
        >
          Show error state
        </button>
      </div>
    </div>
  );
}
