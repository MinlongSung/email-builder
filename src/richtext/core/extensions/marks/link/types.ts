export type Protocol = "https" | "mailto" | "tel" | "ftp";

export type LinkData = {
  protocol: Protocol | string;
  address: string;
  subject?: string;
  body?: string;
  tel?: string;
};
