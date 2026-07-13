"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Lang = "ja" | "en";
type LangCtx = { lang: Lang; toggle: () => void };

const Ctx = createContext<LangCtx>({ lang: "ja", toggle: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ja");

  useEffect(() => {
    const saved = (localStorage.getItem("habibi_lang") as Lang) || "ja";
    setLang(saved);
    document.body.classList.toggle("lang-en", saved === "en");
    document.documentElement.lang = saved;
  }, []);

  function toggle() {
    const next: Lang = lang === "ja" ? "en" : "ja";
    setLang(next);
    localStorage.setItem("habibi_lang", next);
    document.body.classList.toggle("lang-en", next === "en");
    document.documentElement.lang = next;
  }

  return <Ctx.Provider value={{ lang, toggle }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

/** Renders both language variants; CSS (.ja/.en + body.lang-en) controls visibility.
 *  This avoids SSR/client text mismatches since both are always in the DOM. */
export function Bi({ ja, en }: { ja: ReactNode; en: ReactNode }) {
  return (
    <>
      <span className="ja">{ja}</span>
      <span className="en">{en}</span>
    </>
  );
}
