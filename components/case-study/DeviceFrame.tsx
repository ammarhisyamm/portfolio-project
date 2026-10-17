import type { ReactNode } from "react";

/** A light device shell so product screens read as screens, not loose images. */
export default function DeviceFrame({ kind, children, className = "" }: { kind: "phone" | "desktop"; children: ReactNode; className?: string }) {
  if (kind === "phone") {
    return (
      <div className={`relative mx-auto w-full max-w-[260px] rounded-[34px] bg-[#141414] p-[7px] shadow-[0_24px_48px_-24px_rgba(22,22,22,.45)] ${className}`}>
        <div className="relative aspect-[390/844] w-full overflow-hidden rounded-[28px] bg-bg">{children}</div>
      </div>
    );
  }
  return (
    <div className={`w-full overflow-hidden rounded-[14px] border border-[#e8e8e8] bg-panel shadow-[0_24px_48px_-28px_rgba(22,22,22,.35)] sm:rounded-[18px] ${className}`}>
      <div className="flex h-7 items-center gap-1.5 border-b border-[#eeeeee] bg-[#f7f7f7] px-3" aria-hidden="true">
        <i className="h-2 w-2 rounded-full bg-[#dcdcdc]" />
        <i className="h-2 w-2 rounded-full bg-[#dcdcdc]" />
        <i className="h-2 w-2 rounded-full bg-[#dcdcdc]" />
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg">{children}</div>
    </div>
  );
}
