const quotes = [
  "The best among you are those who learn the Quran and teach it. — Prophet Muhammad (PBUH)",
  "Indeed, Allah is with the patient. — Quran 2:153",
  "Kindness is a mark of faith, and whoever is not kind has no faith. — Prophet Muhammad (PBUH)",
  "Do good deeds properly, sincerely, and moderately. — Quran 2:110",
  "The strong person is not the one who throws people down, but the one who controls himself. — Prophet Muhammad (PBUH)"
];

export default function handler(req, res) {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  res.status(200).json({ quote: quotes[randomIndex] });
}
