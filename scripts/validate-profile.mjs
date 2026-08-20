import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => readFile(join(root, relativePath), "utf8");
const exists = async (relativePath) => access(join(root, relativePath), constants.F_OK).then(() => true).catch(() => false);
const errors = [];
const readme = await read("README.md");

const requiredLinks = [
  "https://ggoo.ai",
  "https://open.ggoo.ai",
  "https://build.ggoo.ai",
  "https://www.zerowalk.ai",
  "https://x.com/GSNirvana",
  "https://github.com/MSNirvana/Tooken",
  "https://github.com/MSNirvana/github-skill-video-maker",
  "https://github.com/MSNirvana/codex-ip-theme",
  "https://github.com/MSNirvana/ai-diagnostic"
];
for (const link of requiredLinks) if (!readme.includes(link)) errors.push(`README is missing ${link}`);

const assetRefs = [...readme.matchAll(/(?:src|srcset)="(\.\/[^"?#]+)"/g)].map((match) => match[1]);
for (const reference of assetRefs) if (!(await exists(reference.slice(2)))) errors.push(`README asset does not exist: ${reference}`);

const svgFiles = [
  "assets/hero/ggoo-build-site-motion.svg",
  "assets/hero/ggoo-build-site-static.svg",
  "assets/hero/ggoo-build-site-mobile-motion.svg",
  "assets/hero/ggoo-build-site-mobile-static.svg",
  "assets/identity/builder-console.svg",
  "assets/identity/builder-console-mobile.svg",
  "assets/products/ggoo-ai-station.svg",
  "assets/products/ggoo-ai-station-mobile.svg",
  "assets/products/open-ggoo-station.svg",
  "assets/products/open-ggoo-station-mobile.svg",
  "assets/products/ggoo-build-station.svg",
  "assets/products/ggoo-build-station-mobile.svg",
  "assets/products/zerowalk-station.svg",
  "assets/products/zerowalk-station-mobile.svg",
  "assets/repositories/building-now.svg",
  "assets/repositories/building-now-mobile.svg",
  "assets/activity/contribution-route.svg",
  "assets/activity/contribution-route-mobile.svg",
  "assets/contact/contact-ggoo.svg",
  "assets/contact/contact-x.svg",
  "assets/contact/contact-github.svg"
];
for (const relativePath of svgFiles) {
  const contents = await read(relativePath);
  if (!contents.startsWith("<?xml") || !contents.includes("<svg") || !contents.includes("</svg>")) errors.push(`Invalid SVG wrapper: ${relativePath}`);
  for (const href of [...contents.matchAll(/(?:href|xlink:href)="([^"#]+)"/g)].map((match) => match[1])) {
    if (href.startsWith("http") || href.startsWith("data:")) continue;
    const target = join(dirname(relativePath), href);
    if (!(await exists(target))) errors.push(`${relativePath} references missing ${href}`);
  }
}

if (readme.includes("hero-ggoo-universe.jpg") || readme.includes("route-product-system.jpg") || readme.includes("contributions-2026-08-19.jpg")) {
  errors.push("README still references V1 raster posters");
}
if (!readme.includes("prefers-reduced-motion")) errors.push("README does not expose reduced-motion sources");

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Profile validation passed: ${assetRefs.length} README assets and ${svgFiles.length} SVG files.`);
}
