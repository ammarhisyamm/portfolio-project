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
const CROP_RE = /[?&]crop=([\d.]+),([\d.]+),([\d.]+),([\d.]+)/;

export default function Media({ src, alt, label, imgClassName }: MediaProps) {
  const [failed, setFailed] = useState(false);
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  if (!src || failed) return <MediaPlaceholder label={label} />;

  const isVideo = VIDEO_RE.test(src);
  const cropM = src.match(CROP_RE);
  const crop = cropM ? { sx: +cropM[1], sy: +cropM[2], sw: +cropM[3], sh: +cropM[4] } : null;
  const baseClassName = imgClassName ?? "h-full w-full object-cover";

  if (crop && nat) {
    const style = {
      position: "absolute" as const,
      left: `calc(-100% * ${crop.sx / crop.sw})`,
      top: `calc(-100% * ${crop.sy / crop.sh})`,
      width: `calc(100% * ${nat.w / crop.sw})`,
      height: `calc(100% * ${nat.h / crop.sh})`,
      maxWidth: "none",
    };
    return (
      <div className={baseClassName} style={{ overflow: "hidden", position: "relative" }}>
        {isVideo ? (
          <video
            src={src}
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
            onLoadedMetadata={(e) => setNat({ w: e.currentTarget.videoWidth, h: e.currentTarget.videoHeight })}
            onError={() => setFailed(true)}
            style={style}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={(e) => setNat({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
            onError={() => setFailed(true)}
            style={style}
          />
        )}
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
        src={src}
        muted
        playsInline
        autoPlay
        loop
        preload="metadata"
        onLoadedMetadata={(e) => setNat({ w: e.currentTarget.videoWidth, h: e.currentTarget.videoHeight })}
        onError={() => setFailed(true)}
        className={baseClassName}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={(e) => setNat({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
      onError={() => setFailed(true)}
      className={baseClassName}
    />
  );
}