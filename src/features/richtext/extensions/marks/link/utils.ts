interface HttpLink {
  type: "http";
  url: string;
  title?: string;
  alt?: string;
}

interface EmailLink {
  type: "email";
  to: string;
  subject?: string;
  message?: string;
}

interface SmsLink {
  type: "sms";
  number: string;
  message?: string;
}

interface PhoneLink {
  type: "phone";
  number: string;
}

export type LinkProps = HttpLink | EmailLink | SmsLink | PhoneLink;

export interface LinkMarkAttributes {
  type: "http" | "email" | "sms" | "phone";
  // http
  url: string | null;
  title: string | null;
  alt: string | null;
  // email
  to: string | null;
  subject: string | null;
  // email + sms
  message: string | null;
  // sms + phone
  number: string | null;
}

export function buildLinkHref(attrs: Partial<LinkMarkAttributes>): string {
  switch (attrs.type) {
    case "email": {
      const params = new URLSearchParams();
      if (attrs.subject) params.set("subject", attrs.subject);
      if (attrs.message) params.set("body", attrs.message);
      const query = params.toString();
      return query ? `mailto:${attrs.to}?${query}` : `mailto:${attrs.to ?? ""}`;
    }
    case "sms": {
      const params = new URLSearchParams();
      if (attrs.message) params.set("body", attrs.message);
      const query = params.toString();
      return query
        ? `sms:${attrs.number}?${query}`
        : `sms:${attrs.number ?? ""}`;
    }
    case "phone":
      return `tel:${attrs.number ?? ""}`;
    case "http":
    default:
      return attrs.url ?? "";
  }
}

export function parseLinkHref(href: string): Partial<LinkMarkAttributes> {
  if (!href) return {};

  if (href.startsWith("mailto:")) {
    const [to, query] = href.slice("mailto:".length).split("?");
    const params = new URLSearchParams(query ?? "");
    return {
      type: "email",
      to,
      subject: params.get("subject") ?? null,
      message: params.get("body") ?? null,
    };
  }

  if (href.startsWith("sms:")) {
    const [number, query] = href.slice("sms:".length).split("?");
    const params = new URLSearchParams(query ?? "");
    return { type: "sms", number, message: params.get("body") ?? null };
  }

  if (href.startsWith("tel:")) {
    return { type: "phone", number: href.slice("tel:".length) };
  }

  return { type: "http", url: href };
}

export function linkToMarkAttributes(link: LinkProps): LinkMarkAttributes {
  switch (link.type) {
    case "http":
      return {
        type: "http",
        url: link.url,
        title: link.title ?? null,
        alt: link.alt ?? null,
        to: null,
        subject: null,
        message: null,
        number: null,
      };
    case "email":
      return {
        type: "email",
        url: null,
        title: null,
        alt: null,
        to: link.to,
        subject: link.subject ?? null,
        message: link.message ?? null,
        number: null,
      };
    case "sms":
      return {
        type: "sms",
        url: null,
        title: null,
        alt: null,
        to: null,
        subject: null,
        message: link.message ?? null,
        number: link.number,
      };
    case "phone":
      return {
        type: "phone",
        url: null,
        title: null,
        alt: null,
        to: null,
        subject: null,
        message: null,
        number: link.number,
      };
  }
}
