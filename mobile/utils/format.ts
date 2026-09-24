export function formatDate(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "TBA";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateLong(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "TBA";
  }

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function isValidImageUrl(url?: string): boolean {
  return typeof url === "string" && /^https?:\/\/.+/i.test(url);
}

export function getInitials(name?: string): string {
  if (!name) {
    return "NA";
  }

  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";

  return (first + last).toUpperCase() || "NA";
}