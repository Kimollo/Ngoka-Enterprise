import { site, telHref, whatsappGreeting, whatsappHref } from "@/data/site";
import SectionHeading from "@/components/SectionHeading";
import { PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import { btnLeaf, btnOutline } from "@/components/styles";

export default function Contact() {
  const sameEveryDay = site.hours.every((row) => row.hours === site.hours[0].hours);

  return (
    <section id="contact" className="border-t border-sand bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeading eyebrow="Semorishi" title="Visit, call, or WhatsApp">
          Call or WhatsApp to place an order.
        </SectionHeading>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-ink">Address</h3>
              <address className="mt-2 not-italic leading-relaxed text-bark">
                {site.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={telHref(site.phones.call.e164)} className={btnLeaf}>
                <PhoneIcon />
                Call {site.phones.call.display}
              </a>
              <a href={telHref(site.phones.whatsapp.e164)} className={btnOutline}>
                <PhoneIcon />
                Call {site.phones.whatsapp.display}
              </a>
            </div>
            <a
              href={whatsappHref(whatsappGreeting)}
              className={`${btnLeaf} w-full sm:w-auto`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              WhatsApp {site.phones.whatsapp.display}
            </a>
            <p className="text-sm leading-relaxed text-bark">
              {site.phones.call.display} is the shop phone. {site.phones.whatsapp.display} is
              for WhatsApp and calls.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-ink">Opening hours</h3>
            {sameEveryDay ? (
              <p className="mt-2 text-lg leading-relaxed text-bark">
                Open every day, {site.hours[0].hours}
              </p>
            ) : (
              <table className="mt-3 w-full text-left">
                <caption className="sr-only">Opening hours for Ngoka Enterprise</caption>
                <tbody>
                  {site.hours.map((row) => (
                    <tr key={row.day} className="border-b border-sand">
                      <th scope="row" className="py-2 pr-4 font-semibold text-ink">
                        {row.day}
                      </th>
                      <td className="py-2 text-bark">{row.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-sand bg-sand">
          <iframe
            src={site.mapEmbedUrl}
            title={`Map showing ${site.name} in ${site.city}`}
            className="block h-72 w-full sm:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="flex flex-col gap-3 bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-ink">{site.name}</p>
              <p className="text-sm text-bark">
                {site.city}, {site.postalCode}
              </p>
            </div>
            <a
              href={site.directionsUrl}
              className={btnLeaf}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
