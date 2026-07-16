"use client";

import { X } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState, useTransition } from "react";

type OrderPayload = {
  title: string;
  details?: string;
  status?: string;
  price?: string;
  actionLabel?: string;
};

type OrderModalContextValue = {
  openOrder: (payload: OrderPayload) => void;
};

const OrderModalContext = createContext<OrderModalContextValue | null>(null);

export function useOrderModal() {
  const context = useContext(OrderModalContext);

  if (!context) {
    throw new Error("useOrderModal must be used inside OrderModalProvider");
  }

  return context;
}

export function OrderModalProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<OrderPayload | null>(null);
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();
  const value = useMemo(
    () => ({
      openOrder: (nextPayload: OrderPayload) => {
        setStatus("");
        setPayload(nextPayload);
      }
    }),
    []
  );

  useEffect(() => {
    document.body.style.overflow = payload ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [payload]);

  function submit(formData: FormData) {
    setStatus("");
    startTransition(async () => {
      const response = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        setStatus("Заявка отправлена. Мы свяжемся с вами для подтверждения.");
        return;
      }

      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setStatus(body?.message ?? "Не удалось отправить заявку. Проверьте данные и попробуйте еще раз.");
    });
  }

  return (
    <OrderModalContext.Provider value={value}>
      {children}
      {payload ? (
        <div className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
          <button className="order-modal__backdrop" type="button" aria-label="Закрыть форму" onClick={() => setPayload(null)} />
          <form className="order-modal__panel" action={submit}>
            <div className="order-modal__head">
              <div>
                <p className="eyebrow">{payload.status ?? "Заявка"}</p>
                <h2 id="order-modal-title">{payload.actionLabel ?? "Оформить заявку"}</h2>
              </div>
              <button className="order-modal__close" type="button" aria-label="Закрыть форму" onClick={() => setPayload(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="order-modal__summary">
              <strong>{payload.title}</strong>
              {payload.details ? <span>{payload.details}</span> : null}
              {payload.price ? <b>{payload.price}</b> : null}
            </div>

            <input name="itemTitle" type="hidden" value={payload.title} />
            <input name="itemDetails" type="hidden" value={payload.details ?? ""} />
            <input name="itemStatus" type="hidden" value={payload.status ?? ""} />
            <input name="itemPrice" type="hidden" value={payload.price ?? ""} />

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
              <textarea name="message" placeholder="Удобное время связи, доставка, вопросы по комплектации" />
            </label>

            <button className="button button--dark" type="submit" disabled={isPending}>
              {isPending ? "Отправка..." : "Отправить заявку"}
            </button>
            <p className="form-status" role="status">
              {status}
            </p>
          </form>
        </div>
      ) : null}
    </OrderModalContext.Provider>
  );
}
