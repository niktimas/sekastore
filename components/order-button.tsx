"use client";

import { MessageCircle } from "lucide-react";
import { useOrderModal } from "@/components/order-modal";

type OrderButtonProps = {
  title: string;
  details?: string;
  status?: string;
  price?: string;
  actionLabel?: string;
  className?: string;
};

export function OrderButton({ title, details, status, price, actionLabel, className = "button button--dark" }: OrderButtonProps) {
  const { openOrder } = useOrderModal();

  return (
    <button className={className} type="button" onClick={() => openOrder({ title, details, status, price, actionLabel })}>
      {actionLabel ?? "Оставить заявку"} <MessageCircle size={18} />
    </button>
  );
}
