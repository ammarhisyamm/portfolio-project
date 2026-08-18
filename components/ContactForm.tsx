"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { Check, ArrowUpRight } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Please add your name."),
  email: z.string().email("Please add a valid email."),
  message: z.string().min(10, "Message should be at least 10 characters."),
});

type FormValues = z.infer<typeof schema>;

export default function ContactForm({ email }: { email: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [sent, setSent] = useState(false);

  const onSubmit = async (values: FormValues) => {
    const subject = encodeURIComponent(`Project inquiry — ${values.name}`);
    const body = encodeURIComponent(`${values.message}\n\n— ${values.name}\n${values.email}`);
    await new Promise((r) => setTimeout(r, 500));
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-muted">
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
          <label htmlFor="email" className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-muted">
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
        <label htmlFor="message" className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-muted">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="Tell me about your product, problem, or idea."
          aria-invalid={!!errors.message}
          className={`field resize-none ${errors.message ? "field-error" : ""}`}
          {...register("message")}
        />
        {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>}
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-10 items-center gap-2 border border-ink bg-ink px-5 text-[13px] font-medium text-white no-underline transition-colors duration-200 hover:bg-black disabled:opacity-60"
        >
          {isSubmitting ? "Sending…" : "Send message"}
          <ArrowUpRight size={14} aria-hidden="true" />
        </button>
        <AnimatePresence>
          {sent && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-accent-ink"
            >
              <Check size={15} /> Message ready — I&rsquo;ll get back to you soon.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
