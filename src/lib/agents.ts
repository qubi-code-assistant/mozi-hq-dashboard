export interface AgentMeta {
  id: string;
  name: string;
  accent: string;
  icon: string;
  order: number;
}

export const AGENT_META: Record<string, AgentMeta> = {
  mozi: { id: "mozi", name: "Mozi", accent: "#10B981", icon: "apartment", order: 0 },
  woz: { id: "woz", name: "Woz", accent: "#F59E0B", icon: "code", order: 1 },
  holmes: { id: "holmes", name: "Holmes", accent: "#60A5FA", icon: "search", order: 2 },
  napoleon: { id: "napoleon", name: "Napoleon", accent: "#8B5CF6", icon: "campaign", order: 3 },
  harvey: { id: "harvey", name: "Harvey", accent: "#6366F1", icon: "gavel", order: 4 },
  shakespeare: { id: "shakespeare", name: "Shakespeare", accent: "#EC4899", icon: "edit_note", order: 5 },
  oracle: { id: "oracle", name: "Oracle", accent: "#14B8A6", icon: "monitoring", order: 6 },
  gordon: { id: "gordon", name: "Gordon", accent: "#EF4444", icon: "local_fire_department", order: 7 },
  alfred: { id: "alfred", name: "Alfred", accent: "#6B7280", icon: "rocket_launch", order: 8 },
  gucci: { id: "gucci", name: "Gucci", accent: "#D946EF", icon: "palette", order: 9 },
  warren: { id: "warren", name: "Warren", accent: "#F59E0B", icon: "attach_money", order: 10 },
  jordan: { id: "jordan", name: "Jordan", accent: "#10B981", icon: "storefront", order: 11 },
};

export const AGENT_ORDER = Object.values(AGENT_META).sort((a, b) => a.order - b.order);

export function getAgentAccent(agentId: string): string {
  return AGENT_META[agentId]?.accent ?? "#6B7280";
}

export function getAgentIcon(agentId: string): string {
  return AGENT_META[agentId]?.icon ?? "person";
}
