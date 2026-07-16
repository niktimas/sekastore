"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { BikeModel } from "@/lib/catalog";

type ModelViewerProps = {
  model: BikeModel;
};

export function ModelViewer({ model }: ModelViewerProps) {
  const [selectedColorSlug, setSelectedColorSlug] = useState(model.heroColorSlug);
  const selectedColor = useMemo(
    () => model.colors.find((color) => color.slug === selectedColorSlug) ?? model.colors[0],
    [model.colors, selectedColorSlug]
  );

  function selectColor(slug: string) {
    setSelectedColorSlug(slug);
    window.dispatchEvent(new CustomEvent("seka:color-selected", { detail: { modelSlug: model.slug, colorSlug: slug } }));
  }

  return (
    <div className="viewer">
      <div className="viewer__stage">
        <Image
          key={selectedColor.slug}
          src={selectedColor.image}
          alt={`${model.name}, цвет ${selectedColor.name}`}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 720px"
        />
      </div>
      <div className="viewer__swatches" aria-label="Выбор цвета">
        {model.colors.map((color) => (
          <button
            className="color-button"
            data-active={color.slug === selectedColor.slug}
            key={color.slug}
            type="button"
            onClick={() => selectColor(color.slug)}
          >
            <span className="swatch" style={{ "--swatch": color.swatch } as React.CSSProperties} />
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
}
