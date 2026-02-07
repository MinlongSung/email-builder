import { type LinkData } from "../types";

export function buildLinkHref(data: LinkData): string {
  switch (data.protocol) {
    case "mailto": {
      const params = new URLSearchParams();
      if (data.subject) params.set("subject", data.subject);
      if (data.body) params.set("body", data.body);
      return `mailto:${data.address}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
    }
    case "tel":
      return `tel:${data.address}`;
    default:
      // http, https, ftp u otros
      return `${data.protocol}://${data.address}`;
  }
}
