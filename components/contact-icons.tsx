import { Mail } from "lucide-react";
import { brand, socialLinks } from "@/lib/site";

function TelegramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M21.8 4.4 18.5 20c-.2 1-.8 1.2-1.6.8l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.4 13.7 1.7 12.2c-1-.3-1-1 0-1.4L20.2 3.7c.9-.3 1.7.2 1.6.7Z" />
    </svg>
  );
}

function VkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M3.2 7.2c.1 5.8 3.1 9.3 8.5 9.3h.3v-3.3c2 .2 3.5 1.7 4.1 3.3h2.8c-.8-2.4-2.7-4-3.9-4.6 1.2-.8 2.9-2.6 3.3-4.7h-2.6c-.5 1.7-2.2 3.5-3.7 3.7V7.2H9.4v6.4c-1.6-.4-3.6-2.3-3.7-6.4H3.2Z" />
    </svg>
  );
}

function MaxIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 6.2h3.2l3.8 5.1 3.8-5.1H19v11.6h-3.2v-6.4l-3 4h-1.6l-3-4v6.4H5V6.2Z" />
    </svg>
  );
}

export function ContactIcons() {
  return (
    <div className="contact-icons" aria-label="Способы связи">
      <a className="contact-icon contact-icon--telegram" href={socialLinks[0].href} rel="noreferrer" target="_blank" aria-label="Telegram">
        <TelegramIcon />
      </a>
      <a className="contact-icon contact-icon--vk" href={socialLinks[1].href} rel="noreferrer" target="_blank" aria-label="ВКонтакте">
        <VkIcon />
      </a>
      <a className="contact-icon contact-icon--max" href={socialLinks[2].href} rel="noreferrer" target="_blank" aria-label="MAX">
        <MaxIcon />
      </a>
      <a className="contact-icon contact-icon--email" href={`mailto:${brand.email}`} aria-label="Email">
        <Mail size={34} strokeWidth={2.1} />
      </a>
    </div>
  );
}
