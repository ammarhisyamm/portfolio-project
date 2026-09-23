"use client";

import { useEffect, useState } from "react";

type Contribution = { count?: number; level?: number };

function placeholderCells() {
  let seed = 23;
  return Array.from({ length: 364 }, () => {
    seed = (seed * 9301 + 49297) % 233280;
    const chance = seed / 233280;
    return chance > 0.66 ? Math.min(4, Math.floor(chance * 7)) : 0;
  });
}

export default function GitHubActivity({ username = "ammarhisyamm" }: { username?: string }) {
  const [cells, setCells] = useState<number[]>(placeholderCells);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("GitHub unavailable"))))
      .then((data) => {
        if (!active || !Array.isArray(data.contributions)) return;
        const contributions = (data.contributions as Contribution[]).slice(-364);
        setCells(contributions.map((item) => item.level ?? Math.min(4, Math.ceil((item.count ?? 0) / 3))));
        setTotal(data.total?.lastYear ?? contributions.reduce((sum, item) => sum + (item.count ?? 0), 0));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [username]);

  return (
    <section className="github-panel mt-4" aria-label="GitHub contribution activity">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="kicker !text-[#a6afbb]">GitHub activity</span>
          <h3 className="mt-3 max-w-[620px] text-[clamp(24px,3vw,40px)] font-normal leading-[1.05] tracking-[-0.06em]">
            Building in public, one contribution at a time.
          </h3>
        </div>
        <a className="btn btn-dark" href={`https://github.com/${username}`} target="_blank" rel="noreferrer">
          View GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="mt-12 flex items-baseline gap-2">
        <strong className="text-xl font-medium tracking-[-0.04em]">{total ?? cells.filter(Boolean).length} contributions in the last year</strong>
        <span className="text-xs text-[#a6afbb]">from {username}</span>
      </div>
      <div className="github-chart mt-4">
        <div className="github-months" aria-hidden="true">
          {"Sep Oct Nov Dec Jan Feb Mar Apr May Jun Jul Aug Sep".split(" ").map((month, index) => <span key={`${month}-${index}`}>{month}</span>)}
        </div>
        <div className="github-grid" aria-hidden="true">
          {cells.map((level, index) => <i key={index} className={`github-cell level-${level}`} />)}
        </div>
        <div className="github-legend"><span>Less</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`github-cell level-${level}`} />)}<span>More</span></div>
      </div>
    </section>
  );
}
