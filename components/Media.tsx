"use client";

import { useState } from "react";
import MediaPlaceholder from "./MediaPlaceholder";

type MediaProps = {
  src?: string;
  alt: string;
  label: string;
  imgClassName?: string;
};

const VIDEO_RE = /\.(mp4|webm|mov)(\?|#|$)/i;

export default function Media({ src, alt, label, imgClassName }: MediaProps) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <MediaPlaceholder label={label} />;
  if (VIDEO_RE.test(src)) {
    return (
      <video
        src={src}
        muted
        playsInline
        autoPlay
        loop
        preload="metadata"
        onError={() => setFailed(true)}
        className={imgClassName ?? "h-full w-full object-cover"}
      />
    );
  }
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