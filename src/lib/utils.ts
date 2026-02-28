export function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "never";
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

export interface ChecklistItem {
  text: string;
  checked: boolean;
}

export interface ChecklistSection {
  header: string | null;
  items: ChecklistItem[];
}

export function parseChecklist(markdown: string | null): ChecklistSection[] {
  if (!markdown) return [];
  const lines = markdown.split("\n");
  const sections: ChecklistSection[] = [];
  let current: ChecklistSection = { header: null, items: [] };

  for (const line of lines) {
    const headerMatch = line.match(/^##\s+(.+)/);
    if (headerMatch) {
      if (current.items.length > 0 || current.header) {
        sections.push(current);
      }
      current = { header: headerMatch[1], items: [] };
      continue;
    }
    const checkMatch = line.match(/^-\s+\[([ xX])\]\s+(.+)/);
    if (checkMatch) {
      current.items.push({
        checked: checkMatch[1] !== " ",
        text: checkMatch[2],
      });
    }
  }
  if (current.items.length > 0 || current.header) {
    sections.push(current);
  }
  return sections;
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "...";
}
