export type TaskState =
  | "backlog"
  | "todo"
  | "in_progress"
  | "peer_review"
  | "review"
  | "approved"
  | "done";

export type Priority = "must" | "should" | "could";

export interface Agent {
  id: string;
  name: string;
  role: string;
  specialisation: string | null;
  status: string;
  last_heartbeat: string | null;
  soul_md: string | null;
  updated_at: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  assigned_agents: string[];
  tasks_per_day: number;
  status: string;
  created_at: string;
}

export interface Task {
  id: string;
  goal_id: string | null;
  title: string;
  description: string | null;
  assigned_to: string | null;
  created_by: string;
  state: TaskState;
  priority: Priority;
  peer_approvals: string[];
  result_doc_id: string | null;
  blocked_reason: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  goal_title?: string;
  agent_name?: string;
}

export interface Comment {
  id: string;
  task_id: string;
  author: string;
  content: string;
  mentions: string[];
  notified: boolean;
  created_at: string;
}

export interface Document {
  id: string;
  task_id: string;
  author: string;
  title: string | null;
  content: string;
  version: number;
  created_at: string;
}

export interface Activity {
  id: string;
  agent: string;
  action: string;
  task_id: string | null;
  detail: string | null;
  created_at: string;
}

export interface TasksGrouped {
  backlog: Task[];
  inProgress: Task[];
  review: Task[];
  done: Task[];
}

export interface TaskDetail extends Task {
  comments: Comment[];
  documents: Document[];
  activity: Activity[];
}
