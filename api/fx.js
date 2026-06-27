// Backend (Vercel) — historyczny kurs USD/PLN z NBP.
// /api/fx?start=2025-01-01&end=2026-06-01  ->  { rates: { "2025-01-02": 4.05, ... } }
// NBP zwraca tylko dni robocze; brakujące dni uzupełniamy po stronie aplikacji (najbliższy wcześniejszy).

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=21600");
  const start = (req.query.start || "").toString();
  const end = (req.query.end || "").toString();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
    return res.status(400).json({ error: "Podaj start i end w formacie YYYY-MM-DD." });
  }
  try {
    const rates = await nbpRange(start, end);
    return res.status(200).json({ rates });
  } catch (e) {
    return res.status(502).json({ error: "NBP: " + e.message });
  }
}

function addDays(s, n) {
  const d = new Date(s + "T12:00:00Z");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

async function nbpRange(start, end) {
  const out = {};
  let cur = start;
  // NBP pozwala max ~367 dni na zapytanie; idziemy kawałkami po 180 dni
  let guard = 0;
  while (cur <= end && guard < 40) {
    guard++;
    let to = addDays(cur, 180);
    if (to > end) to = end;
    const url = "https://api.nbp.pl/api/exchangerates/rates/a/usd/" + cur + "/" + to + "/?format=json";
    const r = await fetch(url);
    if (r.ok) {
      const j = await r.json();
      (j.rates || []).forEach((x) => { out[x.effectiveDate] = x.mid; });
    }
    if (to === end) break;
    cur = addDays(to, 1);
  }
  return out;
}
