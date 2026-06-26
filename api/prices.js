// Backend (Vercel Serverless Function).
// Dostepny pod adresem /api/prices?symbol=CRWD&country=US
// Pobiera dane PO STRONIE SERWERA - nie ma tu ograniczen CORS ani CSP.

export default async function handler(req, res) {
  // pozwol frontendowi czytac odpowiedz
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600");

  const symbol = (req.query.symbol || "").toString().trim().toUpperCase();
  const country = (req.query.country || "US").toString().toUpperCase();

  if (!symbol) {
    return res.status(400).json({ error: "Brak symbolu (parametr 'symbol')." });
  }

  // dla GPW Yahoo uzywa suffixu .WA (np. CDR.WA)
  let yahooSym = symbol;
  if (country === "PL" && !symbol.includes(".")) yahooSym = symbol + ".WA";

  // 1) probujemy Yahoo Finance
  try {
    const prices = await fromYahoo(yahooSym);
    return res.status(200).json({ source: "yahoo", symbol: yahooSym, prices });
  } catch (eYahoo) {
    // 2) fallback: Stooq
    try {
      const prices = await fromStooq(symbol, country);
      return res.status(200).json({ source: "stooq", symbol, prices });
    } catch (eStooq) {
      return res.status(502).json({
        error:
          "Nie udalo sie pobrac danych dla " + symbol + ". " +
          "Sprawdz ticker i kraj. (" + eYahoo.message + " | " + eStooq.message + ")",
      });
    }
  }
}

async function fromYahoo(sym) {
  const url =
    "https://query1.finance.yahoo.com/v8/finance/chart/" +
    encodeURIComponent(sym) +
    "?interval=1d&range=10y";
  const r = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfelApp/1.0)" },
  });
  if (!r.ok) throw new Error("Yahoo HTTP " + r.status);
  const j = await r.json();
  const result = j && j.chart && j.chart.result && j.chart.result[0];
  if (!result) {
    const desc = j && j.chart && j.chart.error && j.chart.error.description;
    throw new Error(desc || "Yahoo: brak danych");
  }
  const ts = result.timestamp || [];
  const q = result.indicators && result.indicators.quote && result.indicators.quote[0];
  const closes = (q && q.close) || [];
  const out = [];
  for (let i = 0; i < ts.length; i++) {
    const c = closes[i];
    if (c === null || c === undefined) continue;
    out.push({
      date: new Date(ts[i] * 1000).toISOString().slice(0, 10),
      close: Math.round(c * 10000) / 10000,
    });
  }
  if (!out.length) throw new Error("Yahoo: pusty szereg");
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

async function fromStooq(ticker, country) {
  // Stooq: US ma suffix .us, GPW bez suffixu (np. cdr)
  const s = country === "US" ? ticker.toLowerCase() + ".us" : ticker.toLowerCase();
  const url = "https://stooq.com/q/d/l/?s=" + encodeURIComponent(s) + "&i=d";
  const r = await fetch(url);
  if (!r.ok) throw new Error("Stooq HTTP " + r.status);
  const text = await r.text();
  // format CSV: Date,Open,High,Low,Close,Volume
  const lines = text.trim().split(/\r?\n/);
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 5) continue;
    const date = cols[0];
    const close = parseFloat(cols[4]);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(close)) {
      out.push({ date, close });
    }
  }
  if (!out.length) throw new Error("Stooq: brak/niepoprawny CSV");
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}
