"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import Btn from "./Btn";

const schema = z.object({
  name: z.string().min(2, "Please add your name."),
  email: z.string().email("Please add a valid email."),
  projectType: z.string().min(1, "Please select a project type."),
  message: z.string().min(10, "Message should be at least 10 characters."),
  company: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const PROJECT_TYPES = [
  "Product design",
  "UX/UI design",
  "Design system",
  "Product audit",
  "Other",
];

export default function ContactForm({ email }: { email: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setFormError(data.error || "Gagal mengirim. Coba lagi nanti.");
      return;
    }
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block  text-[11px] uppercase tracking-[0.02em] text-sub">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            className={`field ${errors.name ? "field-error" : ""}`}
            {...register("name")}
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block  text-[11px] uppercase tracking-[0.02em] text-sub">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            className={`field ${errors.email ? "field-error" : ""}`}
            {...register("email")}
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="projectType" className="mb-2 block  text-[11px] uppercase tracking-[0.02em] text-sub">
          Project type
        </label>
        <select
          id="projectType"
          aria-invalid={!!errors.projectType}
          className={`field ${errors.projectType ? "field-error" : ""}`}
          defaultValue=""
          {...register("projectType")}
        >
          <option value="" disabled>
            Select a project type
          </option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.projectType && (
          <p className="mt-1.5 text-xs text-red-500">{errors.projectType.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block  text-[11px] uppercase tracking-[0.02em] text-sub">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell me about your product, problem, or idea."
          aria-invalid={!!errors.message}
          className={`field resize-none ${errors.message ? "field-error" : ""}`}
          {...register("message")}
        />
        {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>}
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Btn type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send message"}
        </Btn>
        {formError && (
          <p className="text-sm text-red-500" role="alert">
            {formError}
          </p>
        )}
        <AnimatePresence>
          {sent && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-accent-ink"
            >
              <Check size={15} /> Message sent — I&rsquo;ll get back to you soon.
            </motion.p>
          )}
        </AnimatePresence>
        <a href={`mailto:${email}`} className="text-sm text-sub no-underline hover:text-ink">
          or email directly
        </a>
      </div>
    </form>
  );
}