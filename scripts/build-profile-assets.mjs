import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const embeddedFiles = {
  "../source/x-background.png": "assets/source/x-background.png",
  "../characters/open-explorer.png": "assets/source/characters/open-explorer.png",
  "../characters/robot-coder.png": "assets/source/characters/robot-coder.png",
  "../characters/workflow-unlocker.png": "assets/source/characters/workflow-unlocker.png",
  "../source/logos/ggoo-ai.png": "assets/source/logos/ggoo-ai.png",
  "../source/logos/open-ggoo.png": "assets/source/logos/open-ggoo.png",
  "../source/logos/ggoo-build.png": "assets/source/logos/ggoo-build.png",
  "../source/logos/zerowalk.png": "assets/source/logos/zerowalk.png",
  "../source/product-screens/ggoo-ai.png": "assets/source/product-screens/ggoo-ai.png",
  "../source/product-screens/open-ggoo.png": "assets/source/product-screens/open-ggoo.png",
  "../source/product-screens/ggoo-build.png": "assets/source/product-screens/ggoo-build.png",
  "../source/product-screens/zerowalk.png": "assets/source/product-screens/zerowalk.png"
};
const embedded = Object.fromEntries(await Promise.all(Object.entries(embeddedFiles).map(async ([href, relativePath]) => {
  const bytes = await readFile(join(root, relativePath));
  return [href, `data:image/png;base64,${bytes.toString("base64")}`];
})));

const esc = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const write = async (relativePath, content) => {
  const absolutePath = join(root, relativePath);
  await mkdir(dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content.trim() + "\n");
};

const svg = (viewBox, body, { animated = false } = {}) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${viewBox}" role="img">
  <title>GGOOAI 凸星人工作台</title>
  <style>
    :root { color-scheme: light; }
    text { font-family: Arial, "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif; }
    .ink { fill: #0A0A0B; }
    .muted { fill: #62666D; }
    .red { fill: #F1281B; }
    .paper { fill: #F7F8FA; }
    .line { stroke: #D9DDE3; stroke-width: 2; }
    .mono { font-family: "SFMono-Regular", Consolas, monospace; letter-spacing: 1.6px; }
    ${animated ? `
      .float-a { animation: float-a 5.6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
      .float-b { animation: float-b 6.8s ease-in-out .5s infinite; transform-box: fill-box; transform-origin: center; }
      .blink { animation: blink 4.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
      .route { stroke-dasharray: 14 18; animation: route 4.5s linear infinite; }
      .scan { animation: scan 5.5s ease-in-out infinite; }
      .pulse { animation: pulse 2.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
      @keyframes float-a { 0%,100% { transform: translateY(0); } 45% { transform: translateY(-12px); } 70% { transform: translateY(-4px); } }
      @keyframes float-b { 0%,100% { transform: translateY(0) rotate(0deg); } 42% { transform: translateY(-10px) rotate(-2deg); } 72% { transform: translateY(-3px) rotate(1deg); } }
      @keyframes blink { 0%,78%,100% { opacity: 1; } 82%,88% { opacity: .2; } }
      @keyframes route { to { stroke-dashoffset: -64; } }
      @keyframes scan { 0%,100% { transform: translateX(0); opacity: .25; } 48% { transform: translateX(780px); opacity: 1; } 55% { opacity: .1; } }
      @keyframes pulse { 0%,100% { opacity: .35; transform: scale(.9); } 50% { opacity: 1; transform: scale(1.15); } }
      @media (prefers-reduced-motion: reduce) {
        .float-a, .float-b, .blink, .route, .scan, .pulse { animation: none; }
      }
    ` : ""}
  </style>
  ${body}
</svg>`;

const img = (href, x, y, width, height, extra = "") => `<image href="${embedded[href] ?? href}" x="${x}" y="${y}" width="${width}" height="${height}" ${extra.includes("preserveAspectRatio") ? "" : 'preserveAspectRatio="xMidYMid meet"'} ${extra}/>`;
const text = (value, x, y, size, cls = "ink", extra = "") => {
  const tokens = cls.split(" ");
  const color = tokens.find((token) => token.startsWith("#"));
  const classes = tokens.filter((token) => !token.startsWith("#")).join(" ");
  return `<text x="${x}" y="${y}" font-size="${size}" ${classes ? `class="${classes}"` : ""} ${color ? `fill="${color}"` : ""} ${extra}>${esc(value)}</text>`;
};
const rounded = (x, y, width, height, fill, radius = 8, extra = "") => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" ${extra}/>`;

const heroBody = ({ animated }) => `
  ${img("../source/x-background.png", 0, 0, 1800, 560, 'preserveAspectRatio="xMidYMid slice"')}
  <rect width="1800" height="560" fill="#FFFFFF" opacity=".17"/>
  <rect x="0" y="0" width="820" height="560" fill="url(#fade)" opacity=".93"/>
  <defs><linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="#F7F8FA"/><stop offset=".72" stop-color="#F7F8FA" stop-opacity=".88"/><stop offset="1" stop-color="#F7F8FA" stop-opacity="0"/></linearGradient></defs>
  <g>
    ${text("ALPHACRYPTOLABS / BUILD LOG 2026", 76, 64, 20, "ink mono", 'font-weight="700"')}
    <circle cx="48" cy="56" r="8" class="red"/><circle cx="48" cy="56" r="18" fill="#F1281B" opacity=".14"/>
    ${text("GGOO", 72, 192, 116, "ink", 'font-weight="800" letter-spacing="4"')}
    ${text("AI", 430, 192, 116, "red", 'font-weight="800" letter-spacing="4"')}
    ${text("一个 Key，无限模型。", 82, 254, 36, "ink", 'font-weight="700"')}
    ${text("One key. The best AI, within reach.", 84, 296, 22, "muted", 'font-weight="600"')}
    ${rounded(82, 338, 250, 62, "#0A0A0B", 4)}
    ${text("进入 GGOOAI  ↗", 110, 378, 24, "paper", 'font-weight="700"')}
    ${text("AI × Crypto Builder  /  凸星人饲养员", 82, 486, 21, "ink mono", 'font-weight="700"')}
    <circle cx="62" cy="478" r="7" class="red pulse"/>
  </g>
  <g opacity=".94">${rounded(1008, 442, 620, 52, "#0A0A0B", 26, 'opacity=".86"')}${text("LIVE SYSTEM  /  USE → DISCOVER → BUILD → TRANSFORM", 1042, 476, 18, "paper mono", 'font-weight="700"')}</g>
`;

await write("assets/hero/ggoo-build-site-motion.svg", svg("0 0 1800 560", heroBody({ animated: true }), { animated: true }));
await write("assets/hero/ggoo-build-site-static.svg", svg("0 0 1800 560", heroBody({ animated: false }), { animated: false }));

const mobileHeroBody = ({ animated }) => `
  ${img("../source/x-background.png", 0, 0, 720, 780, 'preserveAspectRatio="xMidYMid slice"')}
  <rect width="720" height="780" fill="#F7F8FA" opacity=".28"/>
  <rect width="720" height="780" fill="url(#mobileFade)" opacity=".94"/>
  <defs><linearGradient id="mobileFade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#F7F8FA" stop-opacity=".98"/><stop offset=".57" stop-color="#F7F8FA" stop-opacity=".82"/><stop offset="1" stop-color="#F7F8FA" stop-opacity=".1"/></linearGradient></defs>
  ${text("BUILD LOG 2026", 42, 58, 24, "ink mono", 'font-weight="700"')}
  <circle cx="26" cy="47" r="6" class="red"/>
  ${text("GGOO", 42, 150, 72, "ink", 'font-weight="800" letter-spacing="2"')}
  ${text("AI", 255, 150, 72, "red", 'font-weight="800" letter-spacing="2"')}
  ${text("一个 Key，无限模型。", 46, 202, 26, "ink", 'font-weight="700"')}
  ${text("AI × Crypto Builder", 46, 240, 25, "muted", 'font-weight="600"')}
  ${rounded(44, 270, 238, 54, "#0A0A0B", 4)}
  ${text("进入 GGOOAI  ↗", 70, 307, 27, "paper", 'font-weight="700"')}
  ${rounded(42, 680, 636, 58, "#0A0A0B", 29, 'opacity=".9"')}
  ${text("USE  ·  DISCOVER  ·  BUILD  ·  TRANSFORM", 76, 718, 23, "paper mono", 'font-weight="700"')}
`;

await write("assets/hero/ggoo-build-site-mobile-motion.svg", svg("0 0 720 780", mobileHeroBody({ animated: true }), { animated: true }));
await write("assets/hero/ggoo-build-site-mobile-static.svg", svg("0 0 720 780", mobileHeroBody({ animated: false }), { animated: false }));

const identityBody = ({ mobile = false, animated = true }) => mobile ? `
  ${rounded(0, 0, 720, 500, "#0A0A0B", 8)}
  <path d="M 34 58 H 686" stroke="#34383E" stroke-width="2"/>
  ${text("BUILDER CONSOLE / 01", 34, 42, 23, "paper mono", 'font-weight="700"')}
  ${text("高云宏", 34, 130, 68, "paper", 'font-weight="800"')}
  ${text("GAO YUNHONG", 38, 170, 24, "red mono", 'font-weight="700"')}
  ${text("AlphaCryptoLabs", 36, 220, 32, "paper", 'font-weight="700"')}
  ${text("AI × Crypto Builder  /  Full-stack Coder", 36, 264, 26, "paper", 'font-weight="500"')}
  ${text("把想法变成能运行、能交付的产品。", 36, 306, 27, "#D9DDE3", 'font-weight="500"')}
  <path d="M 34 336 H 686" stroke="#34383E" stroke-width="2"/>
  ${text("AI × CRYPTO", 36, 390, 23, "red mono", 'font-weight="700"')}
  ${text("FULL-STACK", 258, 390, 23, "paper mono", 'font-weight="700"')}
  ${text("凸星人饲养员", 482, 390, 23, "paper", 'font-weight="700"')}
  ${rounded(492, 78, 182, 224, "#FFFFFF", 10, 'stroke="#34383E" stroke-width="2"')}${img("../characters/robot-coder.png", 500, 86, 166, 208)}
  <circle cx="632" cy="440" r="7" class="red ${animated ? "pulse" : ""}"/>
  <circle cx="660" cy="440" r="7" fill="#2F6BFF" opacity=".7"/>
  <circle cx="688" cy="440" r="7" fill="#FFFFFF" opacity=".6"/>
  <path d="M 34 458 H 686" stroke="#34383E" stroke-width="2"/>
  ${text("STATUS: BUILDING THINGS THAT WORK", 34, 484, 21, "#A9AFB8 mono", 'font-weight="700"')}
` : `
  ${rounded(0, 0, 1100, 310, "#0A0A0B", 8)}
  <path d="M 48 58 H 1052" stroke="#34383E" stroke-width="2"/>
  ${text("BUILDER CONSOLE / 01", 48, 38, 17, "paper mono", 'font-weight="700"')}
  ${text("高云宏", 48, 136, 72, "paper", 'font-weight="800"')}
  ${text("GAO YUNHONG", 54, 171, 18, "red mono", 'font-weight="700"')}
  ${text("AlphaCryptoLabs", 50, 214, 29, "paper", 'font-weight="700"')}
  ${text("在 AI 与 Crypto 的交叉地带，", 50, 246, 21, "paper", 'font-weight="500" opacity=".82"')}
  ${text("把想法变成能运行、能交付的产品。", 50, 276, 21, "paper", 'font-weight="500" opacity=".82"')}
  ${rounded(752, 24, 216, 256, "#FFFFFF", 10, 'stroke="#34383E" stroke-width="2"')}${img("../characters/robot-coder.png", 765, 35, 190, 236)}
  <path d="M 520 80 L 730 80 L 730 244 L 520 244 Z" fill="none" stroke="#34383E" stroke-width="2" stroke-dasharray="5 7"/>
  ${text("AI × CRYPTO", 540, 112, 17, "red mono", 'font-weight="700"')}
  ${text("FULL-STACK", 540, 158, 17, "paper mono", 'font-weight="700"')}
  ${text("凸星人饲养员", 540, 204, 17, "paper", 'font-weight="700"')}
  ${text("STATUS: BUILDING", 540, 244, 14, "muted mono", 'font-weight="700" fill="#A9AFB8"')}
  <circle cx="1004" cy="266" r="7" class="red ${animated ? "pulse" : ""}"/><circle cx="1028" cy="266" r="7" fill="#2F6BFF" opacity=".8"/><circle cx="1052" cy="266" r="7" fill="#FFFFFF" opacity=".7"/>
  <rect class="scan" x="490" y="62" width="2" height="208" fill="#F1281B" opacity=".35"/>
`;

await write("assets/identity/builder-console.svg", svg("0 0 1100 310", identityBody({}), { animated: true }));
await write("assets/identity/builder-console-mobile.svg", svg("0 0 720 500", identityBody({ mobile: true }), { animated: true }));

const stationData = {
  ggooAi: {
    stage: "01 / CONNECT",
    name: "GGOO AI Gateway",
    zh: "一个入口连接主流 AI 模型，让开发与使用都更简单。",
    zhLines: ["一个入口连接主流 AI 模型，", "让开发与使用都更简单。"],
    role: "模型入口 / MODEL ACCESS",
    logo: "../source/logos/ggoo-ai.png",
    character: "../characters/robot-coder.png",
    screenImage: "../source/product-screens/ggoo-ai.png",
    accent: "#F1281B",
    screen: `
      ${rounded(480, 56, 560, 290, "#FFFFFF", 8, 'stroke="#D9DDE3" stroke-width="2"')}
      ${text("GGOO / MODEL ROUTER", 510, 92, 15, "muted mono", 'font-weight="700"')}
      ${text("Choose a model. Keep one key.", 510, 138, 24, "ink", 'font-weight="700"')}
      ${rounded(510, 166, 150, 54, "#F7F8FA", 6, 'stroke="#D9DDE3"')}${text("Claude", 530, 200, 18, "ink", 'font-weight="700"')}
      ${rounded(678, 166, 150, 54, "#F7F8FA", 6, 'stroke="#D9DDE3"')}${text("GPT", 698, 200, 18, "ink", 'font-weight="700"')}
      ${rounded(846, 166, 150, 54, "#F7F8FA", 6, 'stroke="#D9DDE3"')}${text("Gemini", 866, 200, 18, "ink", 'font-weight="700"')}
      ${rounded(510, 246, 486, 62, "#0A0A0B", 5)}${text("Ready to build", 532, 284, 19, "paper", 'font-weight="700"')}
      <circle cx="962" cy="277" r="8" class="red pulse"/>
    `
  },
  openGgoo: {
    stage: "02 / DISCOVER",
    name: "Open GGOO",
    zh: "按真实热度发现全网最新、高价值 AI 开源项目。",
    zhLines: ["按真实热度发现全网最新、", "高价值 AI 开源项目。"],
    role: "开源雷达 / OPEN SOURCE RADAR",
    logo: "../source/logos/open-ggoo.png",
    character: "../characters/open-explorer.png",
    screenImage: "../source/product-screens/open-ggoo.png",
    accent: "#2F6BFF",
    screen: `
      ${rounded(480, 56, 560, 290, "#FFFFFF", 8, 'stroke="#D9DDE3" stroke-width="2"')}
      ${text("OPEN GGOO / HOTLIST", 510, 92, 15, "muted mono", 'font-weight="700"')}
      ${text("AI projects worth opening.", 510, 138, 24, "ink", 'font-weight="700"')}
      ${rounded(510, 166, 486, 42, "#EEF3FF", 5)}${text("agent  ·  multimodal  ·  open source", 530, 193, 16, "#2F6BFF", 'font-weight="700"')}
      ${rounded(510, 226, 486, 1, "#D9DDE3", 0)}
      ${text("01", 520, 260, 18, "#2F6BFF mono", 'font-weight="700"')}${text("Open model toolkit", 570, 260, 18, "ink", 'font-weight="700"')}${text("↑ 98", 910, 260, 18, "#2F6BFF mono", 'font-weight="700"')}
      ${text("02", 520, 300, 18, "#2F6BFF mono", 'font-weight="700"')}${text("Agent workflow lab", 570, 300, 18, "ink", 'font-weight="700"')}${text("↑ 76", 910, 300, 18, "#2F6BFF mono", 'font-weight="700"')}
    `
  },
  ggooBuild: {
    stage: "03 / BUILD",
    name: "GGOO Build",
    zh: "AI 咨询、头脑风暴与视觉创作的多工具工作台。",
    zhLines: ["AI 咨询、头脑风暴与视觉创作，", "一个多工具工作台。"],
    role: "创作工作台 / BUILDER DESK",
    logo: "../source/logos/ggoo-build.png",
    character: "../characters/robot-coder.png",
    screenImage: "../source/product-screens/ggoo-build.png",
    accent: "#F1281B",
    screen: `
      ${rounded(480, 56, 560, 290, "#FFFFFF", 8, 'stroke="#D9DDE3" stroke-width="2"')}
      ${text("GGOO BUILD / WORKSPACE", 510, 92, 15, "muted mono", 'font-weight="700"')}
      ${text("Turn a rough idea into a route.", 510, 138, 24, "ink", 'font-weight="700"')}
      ${rounded(510, 172, 126, 92, "#FFF1EF", 6)}${text("IDEA", 532, 208, 15, "red mono", 'font-weight="700"')}${text("输入", 532, 240, 23, "ink", 'font-weight="700"')}
      <path d="M 648 218 H 696" stroke="#F1281B" stroke-width="3" class="route"/>
      ${rounded(710, 172, 126, 92, "#F7F8FA", 6)}${text("PLAN", 732, 208, 15, "muted mono", 'font-weight="700"')}${text("拆解", 732, 240, 23, "ink", 'font-weight="700"')}
      <path d="M 848 218 H 896" stroke="#F1281B" stroke-width="3" class="route"/>
      ${rounded(910, 172, 86, 92, "#0A0A0B", 6)}${text("SHIP", 924, 208, 14, "paper mono", 'font-weight="700"')}${text("交付", 924, 240, 20, "paper", 'font-weight="700"')}
    `
  },
  zerowalk: {
    stage: "04 / TRANSFORM",
    name: "ZeroWalk · 第零漫步",
    zh: "帮助企业完成 AI 改造，定制真正可用的 Agent 工作流。",
    zhLines: ["帮助企业完成 AI 改造，", "定制真正可用的 Agent 工作流。"],
    role: "企业改造 / AGENT WORKFLOWS",
    logo: "../source/logos/zerowalk.png",
    character: "../characters/workflow-unlocker.png",
    screenImage: "../source/product-screens/zerowalk.png",
    accent: "#2F6BFF",
    screen: `
      ${rounded(480, 56, 560, 290, "#FFFFFF", 8, 'stroke="#D9DDE3" stroke-width="2"')}
      ${text("ZEROWALK / AGENT MAP", 510, 92, 15, "muted mono", 'font-weight="700"')}
      ${text("从第零步开始改造业务。", 510, 138, 24, "ink", 'font-weight="700"')}
      <path d="M 562 220 C 650 170 740 270 820 220 S 930 170 980 220" fill="none" stroke="#2F6BFF" stroke-width="3"/>
      ${rounded(520, 188, 110, 60, "#EEF3FF", 6)}${text("现状", 550, 226, 19, "#2F6BFF", 'font-weight="700"')}
      ${rounded(690, 188, 110, 60, "#F7F8FA", 6)}${text("Agent", 714, 226, 19, "ink", 'font-weight="700"')}
      ${rounded(900, 188, 82, 60, "#0A0A0B", 6)}${text("交付", 918, 226, 18, "paper", 'font-weight="700"')}
      <circle cx="980" cy="220" r="8" fill="#2F6BFF" class="pulse"/>
    `
  }
};

const stationSvg = (data, mobile = false) => {
  const width = mobile ? 720 : 1100;
  const height = mobile ? 680 : 410;
  const clipId = `screen-${data.stage.slice(0, 2)}`;
  const content = mobile ? `
    ${rounded(0, 0, width, height, "#F7F8FA", 8, 'stroke="#D9DDE3" stroke-width="2"')}
    ${text(data.stage, 34, 50, 24, "red mono", 'font-weight="700"')}
    ${img(data.logo, 34, 78, 78, 78)}
    ${text(data.name, 132, 128, 36, "ink", 'font-weight="800"')}
    ${text(data.role, 36, 188, 22, "muted mono", 'font-weight="700"')}
    ${text(data.zhLines[0], 36, 232, 28, "ink", 'font-weight="500"')}
    ${text(data.zhLines[1], 36, 270, 28, "ink", 'font-weight="500"')}
    <defs><clipPath id="${clipId}"><rect x="36" y="296" width="648" height="270" rx="6"/></clipPath></defs>
    ${rounded(36, 296, 648, 270, "#FFFFFF", 6, 'stroke="#D9DDE3" stroke-width="2"')}
    ${img(data.screenImage, 36, 296, 648, 270, `preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"`)}
    ${rounded(50, 312, 218, 46, "#0A0A0B", 23, 'opacity=".88"')}${text("LIVE PRODUCT", 76, 343, 20, "paper mono", 'font-weight="700"')}
    ${img(data.character, 526, 522, 112, 140)}
    ${text("OPEN PRODUCT  ↗", 36, 630, 23, "ink mono", 'font-weight="700"')}
    <path d="M 36 646 H 304" stroke="${data.accent}" stroke-width="4"/>
  ` : `
    ${rounded(0, 0, width, height, "#F7F8FA", 8, 'stroke="#D9DDE3" stroke-width="2"')}
    ${text(data.stage, 44, 46, 17, "red mono", 'font-weight="700"')}
    ${img(data.logo, 44, 76, 68, 68)}
    ${text(data.name, 132, 116, 34, "ink", 'font-weight="800"')}
    ${text(data.role, 134, 149, 15, "muted mono", 'font-weight="700"')}
    ${text(data.zhLines[0], 44, 194, 21, "ink", 'font-weight="500"')}
    ${text(data.zhLines[1], 44, 224, 21, "ink", 'font-weight="500"')}
    ${text("OPEN PRODUCT  ↗", 44, 332, 16, "ink mono", 'font-weight="700"')}
    <path d="M 44 348 H 284" stroke="${data.accent}" stroke-width="3"/>
    ${img(data.character, 310, 238, 112, 142)}
    <defs><clipPath id="${clipId}"><rect x="480" y="56" width="560" height="290" rx="8"/></clipPath></defs>
    ${rounded(480, 56, 560, 290, "#FFFFFF", 8, 'stroke="#D9DDE3" stroke-width="2"')}
    ${img(data.screenImage, 480, 56, 560, 290, `preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"`)}
    ${rounded(500, 76, 190, 38, "#0A0A0B", 19, 'opacity=".88"')}${text("LIVE PRODUCT", 524, 101, 14, "paper mono", 'font-weight="700"')}
  `;
  return svg(`0 0 ${width} ${height}`, content, { animated: true });
};

for (const [key, data] of Object.entries(stationData)) {
  await write(`assets/products/${key.replace("ggooAi", "ggoo-ai").replace("openGgoo", "open-ggoo").replace("ggooBuild", "ggoo-build")}-station.svg`, stationSvg(data));
  await write(`assets/products/${key.replace("ggooAi", "ggoo-ai").replace("openGgoo", "open-ggoo").replace("ggooBuild", "ggoo-build")}-station-mobile.svg`, stationSvg(data, true));
}

const repoBody = (mobile = false) => mobile ? `
  ${rounded(0, 0, 720, 520, "#0A0A0B", 8)}
  ${text("正在构建", 34, 64, 38, "paper", 'font-weight="800"')}${text(" / BUILDING NOW", 235, 64, 23, "red mono", 'font-weight="700"')}
  ${text("把公开仓库当作持续交付的工作台。", 34, 108, 26, "#D9DDE3", 'font-weight="500"')}
  ${rounded(34, 142, 652, 98, "#17191C", 6, 'stroke="#34383E"')}${text("Open_GGOO", 56, 180, 29, "paper", 'font-weight="800"')}${text("AI 开源项目数据与发现", 56, 218, 24, "#A9AFB8")}${text("SHELL · ★ 1", 480, 180, 20, "#A9AFB8 mono", 'font-weight="700"')}${text("↗", 636, 198, 32, "red", 'font-weight="700"')}
  ${rounded(34, 254, 652, 98, "#17191C", 6, 'stroke="#34383E"')}${text("ZeroWalk", 56, 292, 29, "paper", 'font-weight="800"')}${text("企业 AI 改造与 Agent 工作流", 56, 330, 24, "#A9AFB8")}${text("CSS · ★ 0", 500, 292, 20, "#A9AFB8 mono", 'font-weight="700"')}${text("↗", 636, 310, 32, "red", 'font-weight="700"')}
  ${rounded(34, 366, 652, 98, "#17191C", 6, 'stroke="#34383E"')}${text("Tooken", 56, 404, 29, "paper", 'font-weight="800"')}${text("Bringing AGI to Web4.", 56, 442, 24, "#A9AFB8")}${text("PYTHON · ★ 0", 466, 404, 20, "#A9AFB8 mono", 'font-weight="700"')}${text("↗", 636, 422, 32, "red", 'font-weight="700"')}
` : `
  ${rounded(0, 0, 1100, 240, "#0A0A0B", 8)}
  ${text("正在构建", 42, 56, 31, "paper", 'font-weight="800"')}${text(" / BUILDING NOW", 206, 56, 16, "red mono", 'font-weight="700"')}
  ${text("把公开仓库当作持续交付的工作台。", 42, 92, 19, "#D9DDE3", 'font-weight="500"')}
  ${rounded(42, 124, 316, 76, "#17191C", 6, 'stroke="#34383E"')}${text("Open_GGOO", 60, 156, 20, "paper", 'font-weight="800"')}${text("SHELL · ★ 1", 60, 182, 15, "#A9AFB8 mono")}${text("↗", 324, 170, 22, "red", 'font-weight="700"')}
  ${rounded(392, 124, 316, 76, "#17191C", 6, 'stroke="#34383E"')}${text("ZeroWalk", 410, 156, 20, "paper", 'font-weight="800"')}${text("CSS · ★ 0", 410, 182, 15, "#A9AFB8 mono")}${text("↗", 674, 170, 22, "red", 'font-weight="700"')}
  ${rounded(742, 124, 316, 76, "#17191C", 6, 'stroke="#34383E"')}${text("Tooken", 760, 156, 20, "paper", 'font-weight="800"')}${text("PYTHON · ★ 0", 760, 182, 15, "#A9AFB8 mono")}${text("↗", 1024, 170, 22, "red", 'font-weight="700"')}
`;

await write("assets/repositories/building-now.svg", svg("0 0 1100 240", repoBody(), { animated: true }));
await write("assets/repositories/building-now-mobile.svg", svg("0 0 720 520", repoBody(true), { animated: true }));

const activityBody = (mobile = false) => {
  const width = mobile ? 720 : 1100;
  const height = mobile ? 430 : 300;
  const cols = mobile ? 18 : 32;
  const rows = 7;
  const cell = mobile ? 21 : 22;
  const startX = mobile ? 34 : 54;
  const startY = mobile ? 142 : 128;
  const cells = [];
  for (let c = 0; c < cols; c += 1) {
    for (let r = 0; r < rows; r += 1) {
      const level = (c * 7 + r * 3 + (c % 4)) % 5;
      const fill = ["#E9EBEF", "#C8D5FF", "#88A5FF", "#4D75F2", "#F1281B"][level];
      cells.push(`<rect x="${startX + c * (cell + 4)}" y="${startY + r * (cell + 4)}" width="${cell}" height="${cell}" rx="4" fill="${fill}" opacity="${level === 0 ? .65 : 1}"/>`);
    }
  }
  const routeEnd = startX + (cols - 1) * (cell + 4) + cell / 2;
  return `
    ${rounded(0, 0, width, height, "#F7F8FA", 8, 'stroke="#D9DDE3" stroke-width="2"')}
    ${text("江湖行迹", mobile ? 34 : 46, mobile ? 58 : 48, mobile ? 38 : 31, "ink", 'font-weight="800"')}
    ${text(" / REAL CONTRIBUTION ROUTE", mobile ? 218 : 190, mobile ? 58 : 48, mobile ? 22 : 16, "red mono", 'font-weight="700"')}
    ${text("过去一年真实发生过的每一步", mobile ? 34 : 46, mobile ? 104 : 84, mobile ? 26 : 19, "muted", 'font-weight="500"')}
    <g>${cells.join("")}</g>
    <path d="M ${startX + cell / 2} ${startY + cell / 2} C ${startX + 180} ${startY - 72}, ${routeEnd - 160} ${startY + 176}, ${routeEnd} ${startY + cell / 2}" fill="none" stroke="#F1281B" stroke-width="3" stroke-dasharray="12 16" class="route" opacity=".9"/>
    <circle cx="${routeEnd}" cy="${startY + cell / 2}" r="8" class="red pulse"/>
    ${text("110 contributions", mobile ? 34 : 46, mobile ? 404 : 278, mobile ? 25 : 18, "ink mono", 'font-weight="700"')}
    ${text("snapshot · 2026-08-19", mobile ? 396 : 860, mobile ? 404 : 278, mobile ? 22 : 16, "muted mono", 'font-weight="700"')}
  `;
};

await write("assets/activity/contribution-route.svg", svg("0 0 1100 300", activityBody(), { animated: true }));
await write("assets/activity/contribution-route-mobile.svg", svg("0 0 720 430", activityBody(true), { animated: true }));

await write("assets/contact/contact-ggoo.svg", svg("0 0 250 72", `${rounded(0, 0, 250, 72, "#0A0A0B", 6)}${text("访问 GGOOAI  ↗", 34, 45, 22, "paper", 'font-weight="700"')}`, { animated: true }));
await write("assets/contact/contact-x.svg", svg("0 0 170 54", `${rounded(0, 0, 170, 54, "#F7F8FA", 6, 'stroke="#D9DDE3"')}${text("X / @GGOOAI", 25, 35, 16, "ink mono", 'font-weight="700"')}`, { animated: false }));
await write("assets/contact/contact-github.svg", svg("0 0 190 54", `${rounded(0, 0, 190, 54, "#F7F8FA", 6, 'stroke="#D9DDE3"')}${text("GitHub / MSNirvana", 18, 35, 15, "ink mono", 'font-weight="700"')}`, { animated: false }));

console.log("Generated GGOOAI V2 profile assets.");
