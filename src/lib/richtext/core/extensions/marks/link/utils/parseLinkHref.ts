import { type LinkData } from "../types";

export function parseLinkHref(href: string): LinkData | null {
  try {
    if (href.startsWith("mailto:")) {
      const mail = href.slice(7);
      const [address, query] = mail.split("?");
      const params = new URLSearchParams(query);
      return {
        protocol: "mailto",
        address,
        subject: params.get("subject") || undefined,
        body: params.get("body") || undefined,
      };
    }

    if (href.startsWith("tel:")) {
      return { protocol: "tel", address: href.slice(4) };
    }

    const url = new URL(href);
    return {
      protocol: url.protocol.replace(":", ""),
      address: url.host + url.pathname,
    };
  } catch {
    return null;
  }
}