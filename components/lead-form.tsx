"use client";

import { Send } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import type { BikeModel } from "@/lib/catalog";
import { formatPrice, getFrameOptionsForModel, groupsetOptions, handlebarOptions, wheelOptions } from "@/lib/inventory";
import { trackSiteEvent } from "@/components/site-analytics";

type OptionChoice = {
  brand?: string | null;
  name: string;
  price: number;
  isPreorder?: boolean;
  availability?: string;
  ridingStyle?: string;
};

type LeadFormProps = {
  model: BikeModel;
  frameOptions?: Array<{
    model: string;
    color: string;
    size: string;
    cockpit: string;
    price: number;
  }>;
  groupsets?: OptionChoice[];
  wheels?: OptionChoice[];
  handlebars?: OptionChoice[];
};

function optionLabel(option: OptionChoice) {
  const status = option.availability === "in_stock" ? " / в наличии" : option.isPreorder || option.availability === "preorder" ? " / предзаказ" : "";
  return `${option.brand ? `${option.brand} ` : ""}${option.name} - ${formatPrice(option.price)}${status}`;
}

export function LeadForm({
  model,
  frameOptions: dbFrameOptions,
  groupsets: dbGroupsets,
  wheels: dbWheels,
  handlebars: dbHandlebars
}: LeadFormProps) {
  const [status, setStatus] = useState("");
  const [selectedColorSlug, setSelectedColorSlug] = useState(model.heroColorSlug);
  const [formStartedAt] = useState(() => Date.now());
  const [isPending, startTransition] = useTransition();
  const frameOptions = dbFrameOptions ?? getFrameOptionsForModel(model.slug);
  const availableGroupsets = dbGroupsets ?? groupsetOptions;
  const availableWheels = dbWheels ?? wheelOptions;
  const availableHandlebars = dbHandlebars ?? handlebarOptions;

  useEffect(() => {
    trackSiteEvent({ type: "form_open", target: model.name });
  }, [model.name]);

  useEffect(() => {
    function handleColorSelected(event: Event) {
      const customEvent = event as CustomEvent<{ modelSlug: string; colorSlug: string }>;

      if (customEvent.detail?.modelSlug === model.slug) {
        setSelectedColorSlug(customEvent.detail.colorSlug);
      }
    }

    window.addEventListener("seka:color-selected", handleColorSelected);
    return () => window.removeEventListener("seka:color-selected", handleColorSelected);
  }, [model.slug]);

  function submit(formData: FormData) {
    setStatus("");
    startTransition(async () => {
      const response = await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        trackSiteEvent({ type: "form_submit", target: model.name });
        setStatus("Заявка сохранена. Мы свяжемся с вами после проверки наличия.");
        return;
      }

      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      setStatus(payload?.message ?? "Не удалось отправить заявку. Проверьте данные и попробуйте еще раз.");
    });
  }

  return (
    <form className="form" action={submit}>
      <input type="hidden" name="modelSlug" value={model.slug} />
      <input type="hidden" name="formStartedAt" value={formStartedAt} />
      <label className="bot-field" aria-hidden="true">
        <span>Сайт</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {frameOptions.length ? (
        <label className="field">
          <span>Фрейм из наличия</span>
          <select name="frameOption">
            <option value="">Подобрать вручную</option>
            {frameOptions.map((item, index) => (
              <option key={`${item.color}-${item.size}-${item.cockpit}-${index}`} value={`${item.model} / ${item.color} / ${item.size} / ${item.cockpit} / ${formatPrice(item.price)}`}>
                {item.color}, {item.size}, {item.cockpit} - {formatPrice(item.price)}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="field">
        <span>Система</span>
        <select name="groupsetOption">
          <option value="">Без выбора</option>
          {availableGroupsets.map((option) => (
            <option key={option.name} value={optionLabel(option)}>
              {optionLabel(option)}
            </option>
          ))}
        </select>
      </label>
      {availableHandlebars.length ? (
        <label className="field">
          <span>Руль / кокпит</span>
          <select name="handlebarOption">
            <option value="">Без выбора</option>
            {availableHandlebars.map((option) => (
              <option key={option.name} value={optionLabel(option)}>
                {optionLabel(option)}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="field">
        <span>Колеса</span>
        <select name="wheelOption">
          <option value="">Без выбора</option>
          {availableWheels.map((option) => (
            <option key={option.name} value={optionLabel(option)}>
              {optionLabel(option)}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Цвет</span>
        <select name="colorSlug" value={selectedColorSlug} onChange={(event) => setSelectedColorSlug(event.target.value)}>
          {model.colors.map((color) => (
            <option key={color.slug} value={color.slug}>
              {color.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Размер</span>
        <select name="sizeLabel" defaultValue={model.sizes[0]}>
          {model.sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Имя</span>
        <input name="name" autoComplete="name" required />
      </label>
      <label className="field">
        <span>Телефон</span>
        <input name="phone" autoComplete="tel" inputMode="tel" />
      </label>
      <label className="field">
        <span>Email</span>
        <input name="email" autoComplete="email" inputMode="email" />
      </label>
      <label className="field">
        <span>Комментарий</span>
        <textarea name="message" placeholder="Например: интересует фреймсет или сборка с колесами" />
      </label>
      <button className="button button--dark" type="submit" disabled={isPending} data-track data-track-label="Оставить заявку">
        {isPending ? "Отправка..." : "Оставить заявку"} <Send size={17} />
      </button>
      <p className="form-status" role="status">
        {status}
      </p>
    </form>
  );
}
