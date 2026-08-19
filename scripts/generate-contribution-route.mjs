import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = join(root, "assets/activity");
const to = new Date();
const from = new Date(to);
from.setUTCFullYear(to.getUTCFullYear() - 1);
const iso = (date) => date.toISOString().replace(/\.\d{3}Z$/, "Z");
const snapshot = to.toISOString().slice(0, 10);

const query = `query { user(login: "MSNirvana") { contributionsCollection(from: "${iso(from)}", to: "${iso(to)}") { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } } } } }`;
const { stdout } = await run("gh", ["api", "graphql", "-f", `query=${query}`]);
const payload = JSON.parse(stdout);
const calendar = payload?.data?.user?.contributionsCollection?.contributionCalendar;
if (!calendar?.weeks?.length || typeof calendar.totalContributions !== "number") {
  throw new Error("GitHub did not return a valid contribution calendar");
}

const days = calendar.weeks.flatMap((week) => week.contributionDays);
const levels = days.map((day) => day.contributionCount);
const max = Math.max(...levels, 1);
const levelColor = (count) => {
  if (!count) return "#E9EBEF";
  const ratio = count / max;
  if (ratio < .2) return "#C8D5FF";
  if (ratio < .45) return "#88A5FF";
  if (ratio < .72) return "#4D75F2";
  return "#F1281B";
};
const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const render = ({ mobile = false } = {}) => {
  const width = mobile ? 720 : 1100;
  const height = mobile ? 430 : 300;
  const cell = mobile ? 18 : 14;
  const gap = mobile ? 5 : 4;
  const maxCols = mobile ? 18 : 53;
  const selectedWeeks = mobile ? calendar.weeks.slice(-maxCols) : calendar.weeks;
  const columns = Math.min(selectedWeeks.length, maxCols);
  const start = mobile ? 34 : 52;
  const startY = mobile ? 142 : 118;
  const cells = [];
  for (let col = 0; col < columns; col += 1) {
    const week = selectedWeeks[col];
    for (let row = 0; row < 7; row += 1) {
      const day = week.contributionDays[row];
      if (!day) continue;
      cells.push(`<rect x="${start + col * (cell + gap)}" y="${startY + row * (cell + gap)}" width="${cell}" height="${cell}" rx="3" fill="${levelColor(day.contributionCount)}" opacity="${day.contributionCount ? 1 : .62}"><title>${esc(day.date)} · ${day.contributionCount} contributions</title></rect>`);
    }
  }
  const endX = start + (columns - 1) * (cell + gap) + cell / 2;
  const style = `
    text { font-family: Arial, "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif; }
    .ink { fill: #0A0A0B; } .muted { fill: #62666D; } .red { fill: #F1281B; }
    .mono { font-family: "SFMono-Regular", Consolas, monospace; letter-spacing: 1.5px; }
    .route { stroke-dasharray: 12 15; animation: route 4.5s linear infinite; }
    .pulse { animation: pulse 2.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
    @keyframes route { to { stroke-dashoffset: -54; } }
    @keyframes pulse { 0%,100% { opacity: .35; transform: scale(.85); } 50% { opacity: 1; transform: scale(1.15); } }
    @media (prefers-reduced-motion: reduce) { .route, .pulse { animation: none; } }
  `;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img">
  <title>MSNirvana 真实 GitHub 贡献路线，${calendar.totalContributions} contributions，数据截至 ${snapshot}</title>
  <style>${style}</style>
  <rect width="${width}" height="${height}" rx="8" fill="#F7F8FA" stroke="#D9DDE3" stroke-width="2"/>
  <text x="${mobile ? 34 : 46}" y="${mobile ? 58 : 48}" font-size="${mobile ? 38 : 31}" class="ink" font-weight="800">江湖行迹</text>
  <text x="${mobile ? 218 : 190}" y="${mobile ? 58 : 48}" font-size="${mobile ? 22 : 16}" class="red mono" font-weight="700"> / REAL CONTRIBUTION ROUTE</text>
  <text x="${mobile ? 34 : 46}" y="${mobile ? 104 : 84}" font-size="${mobile ? 26 : 19}" class="muted">过去一年真实发生过的每一步</text>
  <g>${cells.join("")}</g>
  <path d="M ${start + cell / 2} ${startY + cell / 2} C ${start + 180} ${startY - 72}, ${endX - 160} ${startY + 176}, ${endX} ${startY + cell / 2}" fill="none" stroke="#F1281B" stroke-width="3" class="route" opacity=".9"/>
  <circle cx="${endX}" cy="${startY + cell / 2}" r="8" class="red pulse"/>
  <text x="${mobile ? 34 : 46}" y="${mobile ? 404 : 278}" font-size="${mobile ? 25 : 18}" class="ink mono" font-weight="700">${calendar.totalContributions} contributions</text>
  <text x="${mobile ? 396 : 838}" y="${mobile ? 404 : 278}" font-size="${mobile ? 22 : 16}" class="muted mono" font-weight="700">snapshot · ${snapshot}</text>
</svg>`;
};

await mkdir(outputDir, { recursive: true });
await writeFile(join(outputDir, "contribution-route.svg"), render());
await writeFile(join(outputDir, "contribution-route-mobile.svg"), render({ mobile: true }));
console.log(`Generated ${calendar.totalContributions} contributions through ${snapshot}.`);
