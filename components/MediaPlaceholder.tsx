"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

export default function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div className="media-ph" role="img" aria-label={`Visual placeholder for ${label}`}>
      <ImageIcon size={30} strokeWidth={1.4} aria-hidden="true" />
      <span>Visual · {label}</span>
    </div>
  );
}