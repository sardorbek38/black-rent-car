"use client";
import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const current = images[i];
  const isPoster = current.endsWith("poster.webp");
  return (
    <div>
      <div className={`card relative overflow-hidden ${isPoster ? "aspect-[2/1] md:aspect-[16/9]" : "aspect-[2/1]"}`}>
        <Image src={current} alt={alt} fill priority sizes="(min-width:1024px) 60vw, 100vw" className={isPoster ? "object-contain bg-ink" : "object-cover"} />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 md:gap-3">
        {images.map((src, idx) => (
          <button
            key={src}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`${alt} ${idx + 1}`}
            className={`relative aspect-[16/10] overflow-hidden rounded-xl border transition ${idx === i ? "border-gold" : "border-line opacity-70 hover:opacity-100"}`}
          >
            <Image src={src} alt="" fill sizes="15vw" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
