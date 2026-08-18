"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";

type BtnProps = {
  href?: string;
  external?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export default function Btn({
  href,
  external,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
  children,
}: BtnProps) {
  const classes = `group btn ${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`;
  const motionProps = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring", stiffness: 400, damping: 22 },
  } as const;

  if (href) {
    if (external) {
      return (
        <motion.a href={href} target="_blank" rel="noreferrer" className={classes} {...motionProps}>
          {children}
        </motion.a>
      );
    }
    return (
      <motion.div className="inline-flex" {...motionProps}>
        <Link href={href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}