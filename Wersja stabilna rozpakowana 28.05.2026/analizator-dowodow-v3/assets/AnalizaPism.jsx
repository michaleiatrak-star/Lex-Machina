import React from "react";

export default function AnalizaPism() {
  const sections = [
    "Fakty",
    "Katalog prawny",
    "Sprzeczności",
    "Mocne/Słabe",
    "Atak/Odpowiedź",
    "Dowody",
    "Synteza",
    "Audyt"
  ];
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Analiza Pism Sądowych v3</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sections.map((s) => (
          <div key={s} className="rounded-2xl shadow p-4 border">
            <h2 className="text-lg font-medium">{s}</h2>
            <p className="text-sm opacity-75 mt-2">Sekcja raportu do wypełnienia wynikami modułów.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
