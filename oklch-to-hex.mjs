import { readFileSync, writeFileSync } from "node:fs";

const file = "app/assets/css/main.css";
let css = readFileSync(file, "utf8");

// OKLCH -> linear sRGB (CSS Color 4 matrices)
function oklchToLinearSrgb(L, C, Hdeg) {
    const h = (Hdeg * Math.PI) / 180;
    const a = C * Math.cos(h);
    const b = C * Math.sin(h);

    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;

    const l = l_ ** 3;
    const m = m_ ** 3;
    const s = s_ ** 3;

    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
}

const inGamut = ([r, g, b]) =>
    r >= -1e-4 && r <= 1 + 1e-4 &&
    g >= -1e-4 && g <= 1 + 1e-4 &&
    b >= -1e-4 && b <= 1 + 1e-4;

function oklchToHex(L, C, H) {
    let [r, g, b] = oklchToLinearSrgb(L, C, H);
    if (!inGamut([r, g, b])) {
        // Reduce chroma until the color fits the sRGB gamut, keeping L and H
        let lo = 0;
        let hi = C;
        for (let i = 0; i < 30; i++) {
            const mid = (lo + hi) / 2;
            if (inGamut(oklchToLinearSrgb(L, mid, H))) lo = mid;
            else hi = mid;
        }
        [r, g, b] = oklchToLinearSrgb(L, lo, H);
    }
    const gamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
    const to8 = (c) => Math.round(Math.min(1, Math.max(0, gamma(c))) * 255);
    const hex = (n) => n.toString(16).padStart(2, "0");
    return `#${hex(to8(r))}${hex(to8(g))}${hex(to8(b))}`;
}

const mapping = new Map();

css = css.replace(
    /oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*(?:\/\s*([0-9.]+)%\s*)?\)/g,
    (match, L, C, H, alpha) => {
        let out = oklchToHex(parseFloat(L), parseFloat(C), parseFloat(H));
        if (alpha !== undefined) {
            out += Math.round((parseFloat(alpha) / 100) * 255).toString(16).padStart(2, "0");
        }
        if (!mapping.has(match)) mapping.set(match, out);
        return out;
    },
);

writeFileSync(file, css);
console.log([...mapping.entries()].map(([k, v]) => `${k}  ->  ${v}`).join("\n"));
