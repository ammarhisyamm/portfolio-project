"use client";

import { useEffect, useState } from "react";

type Contribution = { date: string; count: number; level: number };
type Activity = { contributions: Contribution[]; total: number };

export default function GitHubActivity({ username }: { username: string }) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setActivity(null);
    setError(false);

    fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Activity unavailable");
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data.contributions)) throw new Error("Invalid activity data");
        const contributions = (data.contributions as Contribution[]).slice(-364);
        setActivity({
          contributions,
          total: typeof data.total?.lastYear === "number"
            ? data.total.lastYear
            : contributions.reduce((sum, day) => sum + day.count, 0),
        });
      })
      .catch((cause) => {
        if (cause?.name !== "AbortError") setError(true);
      });

    return () => controller.abort();
  }, [username]);

  const months = activity
    ? activity.contributions.filter((day, index, days) =>
        index > 0 && index % 7 === 0 && new Date(day.date).getUTCMonth() !== new Date(days[index - 7].date).getUTCMonth()
      )
    : [];

  return (
    <section className="panel p-5 sm:p-8" aria-labelledby="github-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="kicker">GitHub activity</span>
          <h2 id="github-title" className="mt-3 text-[clamp(22px,3vw,28px)] font-normal tracking-[-0.05em]">
            Contributions over the past year
          </h2>
          <p className="mt-2 text-sm text-sub">
            {activity ? `${activity.total.toLocaleString()} contributions` : error ? "Activity is temporarily unavailable." : "Loading contribution activity..."}
          </p>
        </div>
        <a className="btn btn-secondary" href={`https://github.com/${encodeURIComponent(username)}`} target="_blank" rel="noreferrer">
          View GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>

      {activity && (
        <div className="mt-7 overflow-x-auto rounded-xl border border-line bg-[#fafafa] p-4" aria-label={`${activity.total} GitHub contributions in the past year`}>
          <div className="w-max min-w-full">
            <div className="relative mb-3 h-4 text-[10px] text-sub" aria-hidden="true">
              {months.map((day) => {
                const index = activity.contributions.indexOf(day);
                return <span key={day.date} className="absolute" style={{ left: `${Math.floor(index / 7) * 13}px` }}>
                  {new Date(day.date).toLocaleString("en", { month: "short", timeZone: "UTC" })}
                </span>;
              })}
            </div>
            <div className="github-grid" aria-hidden="true">
              {activity.contributions.map((day) => (
                <span key={day.date} className={`github-cell github-cell-${Math.max(0, Math.min(4, day.level))}`} title={`${day.date}: ${day.count} contributions`} />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-end gap-1.5 text-[11px] text-sub" aria-hidden="true">
              <span className="mr-1">Less</span>
              {[0, 1, 2, 3, 4].map((level) => <span key={level} className={`github-cell github-cell-${level}`} />)}
              <span className="ml-1">More</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
