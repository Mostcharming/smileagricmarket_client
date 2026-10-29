"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/agri-button";
import { cn } from "@/lib/utils";
import { useCreateBetaSignup } from "@/mutation";

type Role = "investor" | "farm_owner";

const roleLabels: Record<Role, string> = {
  investor: "I want to invest",
  farm_owner: "I run a farm",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+]?[\d\s\-().]{7,20}$/;

const INVEST_TIMELINE_OPTIONS = [
  "Immediately (within 1 month)",
  "Soon (1–3 months)",
  "Planning ahead (3–6 months)",
  "Just exploring for now",
];

const inputClass = (hasError?: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-background px-4 text-sm text-ink shadow-[var(--shadow-soft)] outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-leaf focus-visible:ring-4 focus-visible:ring-leaf/20",
    hasError ? "border-destructive" : "border-input"
  );

const selectClass = (hasError?: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-background px-4 text-sm text-ink shadow-[var(--shadow-soft)] outline-none transition-colors focus-visible:border-leaf focus-visible:ring-4 focus-visible:ring-leaf/20 appearance-none cursor-pointer",
    hasError ? "border-destructive" : "border-input"
  );

type FieldErrors = Partial<Record<"name" | "location" | "phone" | "email" | "produce" | "investmentTimeline", string>>;

export function WaitlistForm() {
  const reduceMotion = useReducedMotion();
  const { mutate, isPending } = useCreateBetaSignup();
  const [role, setRole] = useState<Role>("investor");

  // Common fields
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Farmer-specific
  const [produce, setProduce] = useState("");

  // Investor-specific
  const [investmentTimeline, setInvestmentTimeline] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (!name.trim()) errors.name = "Please enter your name.";
    if (!location.trim()) errors.location = "Please enter your location.";
    if (!phone.trim()) {
      errors.phone = "Please enter your phone number.";
    } else if (!PHONE_RE.test(phone.trim())) {
      errors.phone = "Enter a valid phone number.";
    }
    if (!email.trim()) {
      errors.email = "Please enter your email address.";
    } else if (!EMAIL_RE.test(email.trim())) {
      errors.email = "Enter a valid email address so we can reach you.";
    }
    if (role === "farm_owner" && !produce.trim()) {
      errors.produce = "Please tell us what you produce.";
    }
    if (role === "investor" && !investmentTimeline) {
      errors.investmentTimeline = "Please select an investment timeline.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;
    setServerError(null);
    if (!validate()) return;

    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || name.trim();

    mutate(
      {
        email: email.trim(),
        firstName,
        name: name.trim(),
        location: location.trim(),
        phone: phone.trim(),
        type: role,
        ...(role === "farm_owner" ? { produce: produce.trim() } : {}),
        ...(role === "investor" ? { investmentTimeline } : {}),
      },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: (err: any) => {
          setServerError(err?.message || "Failed to join private beta. Please try again.");
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
      {/* Role Toggle */}
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
                onClick={() => {
                  setRole(key);
                  setFieldErrors({});
                }}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600",
                  active
                    ? "bg-forest text-white shadow-[var(--shadow-soft)]"
                    : "text-muted-foreground hover:text-ink"
                )}
              >
                {roleLabels[key]}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Name */}
      <div>
        <label htmlFor="waitlist-name" className="mb-1.5 block text-sm font-medium text-ink">
          Name
        </label>
        <input
          id="waitlist-name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          value={name}
          disabled={isPending}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
          }}
          aria-invalid={!!fieldErrors.name}
          className={inputClass(!!fieldErrors.name)}
        />
        {fieldErrors.name && (
          <p role="alert" className="mt-1.5 text-xs text-destructive">{fieldErrors.name}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="waitlist-location" className="mb-1.5 block text-sm font-medium text-ink">
          Location
        </label>
        <input
          id="waitlist-location"
          type="text"
          autoComplete="address-level2"
          placeholder="City, State or Country"
          value={location}
          disabled={isPending}
          onChange={(e) => {
            setLocation(e.target.value);
            if (fieldErrors.location) setFieldErrors((p) => ({ ...p, location: undefined }));
          }}
          aria-invalid={!!fieldErrors.location}
          className={inputClass(!!fieldErrors.location)}
        />
        {fieldErrors.location && (
          <p role="alert" className="mt-1.5 text-xs text-destructive">{fieldErrors.location}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="waitlist-phone" className="mb-1.5 block text-sm font-medium text-ink">
          Phone
        </label>
        <input
          id="waitlist-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+234 800 000 0000"
          value={phone}
          disabled={isPending}
          onChange={(e) => {
            setPhone(e.target.value);
            if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
          }}
          aria-invalid={!!fieldErrors.phone}
          className={inputClass(!!fieldErrors.phone)}
        />
        {fieldErrors.phone && (
          <p role="alert" className="mt-1.5 text-xs text-destructive">{fieldErrors.phone}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="waitlist-email" className="mb-1.5 block text-sm font-medium text-ink">
          Email
        </label>
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
            if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
          }}
          aria-invalid={!!fieldErrors.email}
          className={inputClass(!!fieldErrors.email)}
        />
        {fieldErrors.email && (
          <p role="alert" className="mt-1.5 text-xs text-destructive">{fieldErrors.email}</p>
        )}
      </div>

      {/* Farmer-specific: What do you produce */}
      {role === "farm_owner" && (
        <div>
          <label htmlFor="waitlist-produce" className="mb-1.5 block text-sm font-medium text-ink">
            What do you produce?
          </label>
          <input
            id="waitlist-produce"
            type="text"
            placeholder="e.g. Maize, Cassava, Poultry..."
            value={produce}
            disabled={isPending}
            onChange={(e) => {
              setProduce(e.target.value);
              if (fieldErrors.produce) setFieldErrors((p) => ({ ...p, produce: undefined }));
            }}
            aria-invalid={!!fieldErrors.produce}
            className={inputClass(!!fieldErrors.produce)}
          />
          {fieldErrors.produce && (
            <p role="alert" className="mt-1.5 text-xs text-destructive">{fieldErrors.produce}</p>
          )}
        </div>
      )}

      {/* Investor-specific: How soon do you want to invest */}
      {role === "investor" && (
        <div>
          <label htmlFor="waitlist-timeline" className="mb-1.5 block text-sm font-medium text-ink">
            How soon do you want to invest?
          </label>
          <div className="relative">
            <select
              id="waitlist-timeline"
              value={investmentTimeline}
              disabled={isPending}
              onChange={(e) => {
                setInvestmentTimeline(e.target.value);
                if (fieldErrors.investmentTimeline) setFieldErrors((p) => ({ ...p, investmentTimeline: undefined }));
              }}
              aria-invalid={!!fieldErrors.investmentTimeline}
              className={cn(selectClass(!!fieldErrors.investmentTimeline), !investmentTimeline && "text-muted-foreground/70")}
            >
              <option value="" disabled>Select a timeline</option>
              {INVEST_TIMELINE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
          {fieldErrors.investmentTimeline && (
            <p role="alert" className="mt-1.5 text-xs text-destructive">{fieldErrors.investmentTimeline}</p>
          )}
        </div>
      )}

      {/* Server error */}
      {serverError && (
        <p role="alert" className="text-sm text-destructive">{serverError}</p>
      )}

      {/* Submit */}
      <Button variant="cta" size="xl" type="submit" disabled={isPending}>
        Join private beta
        <ArrowRight data-icon="inline-end" className="size-4" />
      </Button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        No spam. We email you about beta access and nothing else. Investments carry risk
        and returns are not guaranteed.
      </p>
    </form>
  );
}
