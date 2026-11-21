// Usage: node validate2.js dayNN.js [...]
const fs = require("fs"), vm = require("vm");
let bad = 0;
for (const f of process.argv.slice(2)) {
  const w = {};
  try { vm.runInNewContext(fs.readFileSync(f, "utf8"), { window: w }); }
  catch (e) { console.log(f, "SYNTAX", e.message); bad++; continue; }
  const D = Object.values(w.VSTEP_DAYS || {})[0];
  const P = [];
  const err = m => P.push(m);
  const strip = s => s.replace(/<[^>]+>/g, "");
  const checkGloss = (g, texts, where) => {
    if (!Array.isArray(g) || !g.length) return err(where + ": missing gloss");
    const joined = texts.join("\n");
    g.forEach((e, i) => {
      if (!Array.isArray(e) || e.length < 2) return err(`${where} gloss[${i}] malformed`);
      if (!texts.some(t => t.includes(e[0]))) err(`${where} gloss not found exactly: "${e[0]}"`);
      g.forEach((o, j) => { if (i !== j && o[0].includes(e[0])) err(`${where} gloss overlap: "${e[0]}" inside "${o[0]}"`); });
    });
    return joined;
  };
  const checkBank = (b, where) => {
    if (!Array.isArray(b) || b.length < 3) return err(where + ": bank missing or < 3 groups");
    b.forEach((g, i) => { if (!g.h || !Array.isArray(g.items) || g.items.length < 2) err(`${where} bank[${i}] needs h and >=2 items`);
      else g.items.forEach((x, j) => { if (!Array.isArray(x) || x.length < 2) err(`${where} bank[${i}].items[${j}] malformed`); }); });
  };
  for (const S of D.sections) {
    if (S.type === "listening") S.items.forEach((it, i) => { if (!it.tip) err(`listening item ${i + 1} missing tip`); });
    if (S.type === "reading") { checkGloss(S.gloss, S.text, "reading"); if (S.gloss && S.gloss.length < 14) err("reading gloss < 14 entries"); }
    if (S.type === "writing") { checkGloss(S.gloss, S.model, "writing"); checkBank(S.bank, "writing"); }
    if (S.type === "speaking") { checkBank(S.bank, "speaking"); S.tasks.forEach((t, i) => checkGloss(t.gloss, t.model, `speaking task ${i + 1}`)); }
  }
  if (P.length) { bad++; console.log(f); P.forEach(p => console.log("  -", p)); } else console.log(f, "OK");
}
process.exitCode = bad ? 1 : 0;
