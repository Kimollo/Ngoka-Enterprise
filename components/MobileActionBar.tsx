import { site, telHref, whatsappGreeting, whatsappHref } from "@/data/site";
import { PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import { btnLeaf, btnOutline } from "@/components/styles";

export default function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-cream px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a href={telHref(site.phones.call.e164)} className={btnOutline}>
          <PhoneIcon />
          Call
        </a>
        <a
          href={whatsappHref(whatsappGreeting)}
          className={btnLeaf}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
