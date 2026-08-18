"use client";

import { useState } from "react";
import MediaPlaceholder from "./MediaPlaceholder";

type MediaProps = {
  src?: string;
  alt: string;
  label: string;
  imgClassName?: string;
};

export default function Media({ src, alt, label, imgClassName }: MediaProps) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <MediaPlaceholder label={label} />;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={imgClassName ?? "h-full w-full object-cover"}
    />
  );
}