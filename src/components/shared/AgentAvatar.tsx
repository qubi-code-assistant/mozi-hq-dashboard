import { getAgentAccent } from "@/lib/agents";

const SIZES = {
  sm: "size-6 text-[10px]",
  md: "size-10 text-sm",
  lg: "size-16 text-2xl",
} as const;

export function AgentAvatar({
  agentId,
  name,
  size = "md",
  className = "",
}: {
  agentId: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const accent = getAgentAccent(agentId);
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={`${SIZES[size]} rounded-full flex items-center justify-center font-display font-bold text-white avatar-ring shrink-0 ${className}`}
      style={{ backgroundColor: accent }}
      title={name}
    >
      {initial}
    </div>
  );
}
