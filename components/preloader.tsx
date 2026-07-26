"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(() => {
    const heroTitleWrap = document.querySelector<HTMLElement>(".hero-title-wrap");
    const heroWords = document.querySelectorAll<HTMLElement>(".hero-word");
    const overlay = overlayRef.current;
    if (!heroTitleWrap || !heroWords.length || !overlay) return;

    const isScrolled = window.scrollY > 0;

    if (!isScrolled) {
      const isMobile = window.innerWidth < 1024;
      const firstWord = heroWords[0];
      const secondWord = heroWords[1];
      const titleRect = heroTitleWrap.getBoundingClientRect();
      const titleHeight = titleRect.height;

      gsap.set(heroTitleWrap, { position: "relative", zIndex: 10000 });

      if (isMobile) {
        const pushDown = window.innerHeight - titleRect.top - titleHeight;
        gsap.set(heroTitleWrap, { y: pushDown });
        gsap.set(firstWord, { x: -80, opacity: 0 });
        gsap.set(secondWord, { x: 80, opacity: 0 });
      } else {
        const pushDown = window.innerHeight - titleRect.top - titleHeight;
        const wordExtra = firstWord.offsetHeight * 1.2;
        gsap.set(heroTitleWrap, { y: pushDown });
        gsap.set(firstWord, { y: wordExtra, opacity: 0 });
        gsap.set(secondWord, { y: wordExtra, opacity: 0 });
      }
    }

    if (isScrolled) {
      startCounter();
    } else {
      const isMobile = window.innerWidth < 1024;
      const firstWord = heroWords[0];
      const secondWord = heroWords[1];

      const entranceTl = gsap.timeline({ onComplete: startCounter });
      entranceTl.set(heroWords, { opacity: 1 });

      if (isMobile) {
        entranceTl.to(firstWord, { x: 0, duration: 1, ease: "power3.out" }, 0);
        entranceTl.to(secondWord, { x: 0, duration: 1, ease: "power3.out" }, 0);
      } else {
        entranceTl.to(firstWord, { y: 0, duration: 1, ease: "power3.out" });
        entranceTl.to(secondWord, { y: 0, duration: 1, ease: "power3.out" }, "-=0.5");
      }
    }

    let counterDone = false;
    let pageLoaded = document.readyState === "complete";

    function startCounter() {
      const counterObj = { value: 0 };
      gsap.to(counterObj, {
        value: 100,
        duration: 2.5,
        ease: "power2.out",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = `${Math.round(counterObj.value)}%`;
          }
        },
        onComplete: () => {
          counterDone = true;
          tryReveal();
        },
      });
    }

    function tryReveal() {
      if (!counterDone || !pageLoaded) return;

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(heroTitleWrap, { clearProps: "all" });
          window.dispatchEvent(new CustomEvent("preloader:done"));
          setDone(true);
        },
      });

      tl.to(counterRef.current, { opacity: 0, duration: 0.15 });
      tl.to(heroWords, { x: 0, y: 0, duration: 0.8, ease: "power3.inOut" }, 0);
      tl.to(heroTitleWrap, { y: 0, duration: 0.8, ease: "power3.inOut" }, 0);
      tl.to(overlay, { opacity: 0, duration: 0.6, ease: "power2.inOut" });
    }

    function onPageLoad() {
      pageLoaded = true;
      tryReveal();
    }

    if (document.readyState !== "complete") {
      window.addEventListener("load", onPageLoad);
    }

    return () => window.removeEventListener("load", onPageLoad);
  }, []);

  if (done) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-background" />
      <div className="relative flex items-center justify-center h-full z-10">
        <span
          ref={counterRef}
          className="font-clash-grotesk-semibold tabular-nums text-[clamp(2rem,6vw,5rem)]"
        >
          0%
        </span>
      </div>
    </div>
  );
}
