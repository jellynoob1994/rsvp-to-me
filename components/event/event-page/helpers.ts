import {
  MapPin,
  Shirt,
  UtensilsCrossed,
  ParkingCircle,
  Link2,
  FileText,
  Info,
  Music,
  Gift,
  Bed,
  Calendar,
  Sparkles,
  Camera,
  Phone,
  DollarSign,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────────

export function formatDate(d: Date, tz: string) {
  return new Date(d).toLocaleDateString("nl-NL", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: tz,
  });
}
export function formatTime(d: Date, tz: string) {
  return new Date(d).toLocaleTimeString("nl-NL", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  });
}
export function timeAgo(d: Date) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "zojuist";
  if (s < 3600) return `${Math.floor(s / 60)} min geleden`;
  if (s < 86400) return `${Math.floor(s / 3600)} uur geleden`;
  return `${Math.floor(s / 86400)} dagen geleden`;
}

// Convert a UTC Date to a "YYYY-MM-DDTHH:MM" string in the given timezone
export function toDateTimeLocal(d: Date, tz: string): string {
  const parts: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(d))) {
    parts[p.type] = p.value;
  }
  const h = parts.hour === "24" ? "00" : parts.hour;
  return `${parts.year}-${parts.month}-${parts.day}T${h}:${parts.minute}`;
}

// Convert "YYYY-MM-DDTHH:MM" in timezone tz back to a UTC Date (mirrors server logic)
export function tzLocalToUtcClient(localStr: string, tz: string): Date {
  const asIfUtc = new Date(localStr + ":00Z");
  const parts: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(asIfUtc)) {
    parts[p.type] = p.value;
  }
  const h = parts.hour === "24" ? "00" : parts.hour;
  const localAsUtc = new Date(
    `${parts.year}-${parts.month}-${parts.day}T${h}:${parts.minute}:${parts.second}Z`
  );
  return new Date(2 * asIfUtc.getTime() - localAsUtc.getTime());
}

export const ICON_SET: { key: string; icon: React.ElementType; label: string }[] = [
  { key: "shirt", icon: Shirt, label: "Kledingvoorschrift" },
  { key: "utensils", icon: UtensilsCrossed, label: "Eten en drinken" },
  { key: "parking", icon: ParkingCircle, label: "Parkeren" },
  { key: "link", icon: Link2, label: "Link" },
  { key: "info", icon: Info, label: "Info" },
  { key: "music", icon: Music, label: "Muziek" },
  { key: "gift", icon: Gift, label: "Cadeaulijst" },
  { key: "bed", icon: Bed, label: "Overnachting" },
  { key: "mappin", icon: MapPin, label: "Routebeschrijving" },
  { key: "calendar", icon: Calendar, label: "Programma" },
  { key: "sparkles", icon: Sparkles, label: "Sfeer" },
  { key: "filetext", icon: FileText, label: "Notities" },
  { key: "camera", icon: Camera, label: "Foto's" },
  { key: "phone", icon: Phone, label: "Contact" },
  { key: "zelle", icon: DollarSign, label: "Zelle" },
  { key: "venmo", icon: DollarSign, label: "Venmo" },
];

export const PRESET_CHIPS = [
  { key: "link", label: "Link", icon: Link2 },
  { key: "gift", label: "Cadeaulijst", icon: Gift },
  { key: "shirt", label: "Kledingvoorschrift", icon: Shirt },
  { key: "utensils", label: "Eten en drinken", icon: UtensilsCrossed },
  { key: "parking", label: "Parkeren", icon: ParkingCircle },
  { key: "bed", label: "Overnachting", icon: Bed },
  { key: "info", label: "Aanvullende informatie", icon: Info },
  { key: "zelle", label: "Zelle", icon: DollarSign },
  { key: "venmo", label: "Venmo", icon: DollarSign },
];

// Maps legacy enum type values to new icon keys
const LEGACY_ICON_MAP: Record<string, string> = {
  DRESS_CODE: "shirt",
  FOOD: "utensils",
  PARKING: "parking",
  LINK: "link",
  CUSTOM: "filetext",
};

export function resolveIconKey(stored: string): string {
  return LEGACY_ICON_MAP[stored] ?? stored;
}

export function getIconItem(stored: string) {
  const key = resolveIconKey(stored);
  return ICON_SET.find((i) => i.key === key) ?? ICON_SET.find((i) => i.key === "filetext")!;
}

export function buildMapUrl(address: string) {
  const encoded = encodeURIComponent(address);
  if (typeof navigator !== "undefined" && /iPhone|iPad|iPod|Mac/.test(navigator.userAgent)) {
    return `https://maps.apple.com/?q=${encoded}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
}

export function getPlaceholder(key: string) {
  switch (key) {
    case "link":
      return "Linkgegevens (bijv. groepschat of afspeellijst)…";
    case "gift":
      return "Cadeaulijstgegevens (bijv. winkel of webshop)…";
    case "shirt":
      return "Kledingvoorschrift (bijv. cocktail, casual of feestelijk)…";
    case "utensils":
      return "Eten en drinken (bijv. zelf drank meenemen, diner inbegrepen of gezamenlijke maaltijd)…";
    case "parking":
      return "Parkeerinformatie (bijv. parkeren op straat of op de oprit)…";
    case "bed":
      return "Overnachting (bijv. hotelafspraken of verblijfadres)…";
    case "info":
      return "Aanvullende informatie…";
    case "zelle":
      return "Zelle-gegevens (bijv. telefoonnummer, e-mailadres of naam)…";
    case "venmo":
      return "Venmo-gebruikersnaam (bijv. @gebruikersnaam)…";
    default:
      return "Details…";
  }
}
