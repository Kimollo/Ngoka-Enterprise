export const site = {
  name: "Ngoka Enterprise",
  tagline: "Fresh eggs, chicken, and daily groceries in Semorishi.",
  since: 2009,
  city: "Semorishi",
  area: "Ga-Seema, Limpopo",
  postalCode: "0836",
  country: "South Africa",
  addressLines: ["Semorishi", "Ga-Seema, Limpopo", "0836, South Africa"],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Ngoka+Enterprise+Semorishi",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=-23.621342,28.952067",
  mapEmbedUrl: "https://maps.google.com/maps?q=-23.621342,28.952067&z=15&output=embed",
  coordinates: { lat: -23.621342, lng: 28.952067 },
  phones: {
    call: { display: "073 471 6535", e164: "+27734716535" },
    whatsapp: {
      display: "072 951 6927",
      e164: "+27729516927",
      wa: "27729516927",
    },
  },
  hours: [
    { day: "Monday", hours: "7:00 AM – 6:00 PM", opens: "07:00", closes: "18:00" },
    { day: "Tuesday", hours: "7:00 AM – 6:00 PM", opens: "07:00", closes: "18:00" },
    { day: "Wednesday", hours: "7:00 AM – 6:00 PM", opens: "07:00", closes: "18:00" },
    { day: "Thursday", hours: "7:00 AM – 6:00 PM", opens: "07:00", closes: "18:00" },
    { day: "Friday", hours: "7:00 AM – 6:00 PM", opens: "07:00", closes: "18:00" },
    { day: "Saturday", hours: "7:00 AM – 6:00 PM", opens: "07:00", closes: "18:00" },
    { day: "Sunday", hours: "7:00 AM – 6:00 PM", opens: "07:00", closes: "18:00" },
  ],
  delivery:
    "We deliver to neighbouring villages. Tell us which village when you call or send a WhatsApp.",
  payments: "Pay with cash, card, or instant EFT.",
  leadTime: "Order eggs 3 to 5 days before you need them.",
} as const;

export function telHref(e164: string) {
  return `tel:${e164}`;
}

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${site.phones.whatsapp.wa}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const whatsappGreeting =
  "Hello Ngoka Enterprise, I would like to ask about an order.";
