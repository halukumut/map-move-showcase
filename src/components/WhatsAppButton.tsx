import React from "react";
import { toast } from "sonner";

// Floating WhatsApp button. Reads link from Vite env variable `VITE_WHATSAPP_LINK`.
// Renders bottom-left. If link is not set, clicking shows a toast informing the admin to set the env var.

const WhatsAppButton: React.FC = () => {
  const link = (import.meta.env.VITE_WHATSAPP_LINK as string) || "";

  const handleClick = (e: React.MouseEvent) => {
    if (!link) {
      e.preventDefault();
      toast("WhatsApp link is not configured yet.", { duration: 4000 });
      return;
    }
    // otherwise let the anchor follow
  };

  return (
    <a
      href={link || "#"}
      onClick={handleClick}
      target={link ? "_blank" : undefined}
      rel={link ? "noopener noreferrer" : undefined}
      aria-label="Open WhatsApp"
      className="fixed left-5 bottom-5 z-50 inline-flex items-center rounded-full shadow-lg text-white bg-[#25D366] hover:brightness-95 active:scale-95 transition-all group overflow-hidden h-14 min-w-[56px]"
      title="WhatsApp ile iletişime geç"
    >
      <div className="flex items-center px-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M20.52 3.48A11.88 11.88 0 0012 0a11.9 11.9 0 00-10.52 6.48A11.74 11.74 0 001 12c0 2.08.54 4.16 1.59 6.01L0 24l6.17-1.61A11.9 11.9 0 0012 24c6.63 0 12-5.37 12-12 0-1.96-.51-3.79-1.48-5.52zM12 21.5c-1.55 0-3.06-.4-4.39-1.15l-.32-.18-3.66.95.98-3.57-.21-.36A9.5 9.5 0 012.5 12 9.5 9.5 0 1112 21.5zm5.12-7.63c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.52-.45-.45-.61-.46l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.98 2.68 1.12 2.86.14.18 1.93 3.02 4.67 4.23 3.23 1.43 3.23 0 3.61-.17.37-.17 1.2-.49 1.37-.97.18-.48.18-.88.12-.97-.06-.09-.27-.14-.55-.28z" />
        </svg>
        <span className="ml-2 text-sm font-medium max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-200 whitespace-nowrap">Bize ulaşın</span>
      </div>
    </a>
  );
};

export default WhatsAppButton;
