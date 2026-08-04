"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/agri-button";
import { cn } from "@/lib/utils";
import { useCreateBetaSignup } from "@/mutation";

type Role = "investor" | "operator";

const roleLabels: Record<Role, string> = {
  investor: "I want to invest",
  operator: "I run a farm",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistForm() {
  const reduceMotion = useReducedMotion();
  const { mutate, isPending } = useCreateBetaSignup();
  const [role, setRole] = useState<Role>("investor");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;
    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address so we can reach you.");
      return;
    }
    setError(null);

    const emailParts = email.trim().split("@");
    const username = emailParts[0] || "";
    const firstPart = username.split(".")[0] || "";
    const firstName = firstPart.charAt(0).toUpperCase() + firstPart.slice(1);

    mutate(
      { email: email.trim(), firstName },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: (err: any) => {
          setError(err?.message || "Failed to join private beta. Please try again.");
        },
      }
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-4 py-4 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-mint text-leaf">
          <Check className="size-6" strokeWidth={3} />
        </span>
        <div>
          <p className="text-lg font-semibold text-ink">You&apos;re on the list</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We&apos;ll email <span className="font-medium text-ink">{email.trim()}</span> as
            places open for {role === "investor" ? "investors" : "farm operators"}.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <fieldset>
        <legend className="sr-only">I&apos;m joining as</legend>
        <div
          role="radiogroup"
          aria-label="I'm joining as"
          className="grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1"
        >
          {(Object.keys(roleLabels) as Role[]).map((key) => {
            const active = role === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={isPending}
                onClick={() => setRole(key)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600",
                  active
                    ? "bg-forest text-white shadow-[var(--shadow-soft)]"
                    : "text-muted-foreground hover:text-ink",
                )}
              >
                {roleLabels[key]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="waitlist-email" className="sr-only">
          Email address
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="waitlist-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            disabled={isPending}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "waitlist-error" : undefined}
            className={cn(
              "h-12 w-full rounded-xl border bg-background px-4 text-sm text-ink shadow-[var(--shadow-soft)] outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-leaf focus-visible:ring-4 focus-visible:ring-leaf/20",
              error ? "border-destructive" : "border-input",
            )}
          />
          <Button variant="cta" size="xl" type="submit" className="shrink-0" disabled={isPending}>
            Join private beta
            <ArrowRight data-icon="inline-end" className="size-4" />
          </Button>
        </div>
        {error ? (
          <p id="waitlist-error" role="alert" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        No spam. We email you about beta access and nothing else. Investments carry risk
        and returns are not guaranteed.
      </p>
    </form>
  );
}
