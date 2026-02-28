import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import type {
  Agent,
  Task,
  TasksGrouped,
  Comment,
  Document,
  Activity,
} from "./types";

let sql: NeonQueryFunction<false, false> | null = null;

function getDb() {
  if (!sql) {
    const url = process.env.NEON_DATABASE_URL;
    if (!url) throw new Error("NEON_DATABASE_URL not set");
    sql = neon(url);
  }
  return sql;
}

// ── Agents ──────────────────────────────────────────────

export async function getAllAgents(): Promise<Agent[]> {
  const db = getDb();
  const rows = await db`SELECT * FROM hq_agents ORDER BY name`;
  return rows as Agent[];
}

// ── Tasks ───────────────────────────────────────────────

export async function getTasksGrouped(): Promise<TasksGrouped> {
  const db = getDb();
  const rows = await db`
    SELECT t.*, g.title as goal_title, a.name as agent_name
    FROM hq_tasks t
    LEFT JOIN hq_goals g ON t.goal_id = g.id
    LEFT JOIN hq_agents a ON t.assigned_to = a.id
    ORDER BY t.updated_at DESC
  `;
  const tasks = rows as Task[];

  return {
    backlog: tasks.filter((t) => t.state === "backlog" || t.state === "todo"),
    inProgress: tasks.filter((t) => t.state === "in_progress"),
    review: tasks.filter(
      (t) => t.state === "peer_review" || t.state === "review"
    ),
    done: tasks.filter((t) => t.state === "approved" || t.state === "done"),
  };
}

export async function getActiveTask(): Promise<
  (Task & { activity: Activity[]; documents: Document[] }) | null
> {
  const db = getDb();
  const taskRows = await db`
    SELECT t.*, g.title as goal_title, a.name as agent_name
    FROM hq_tasks t
    LEFT JOIN hq_goals g ON t.goal_id = g.id
    LEFT JOIN hq_agents a ON t.assigned_to = a.id
    WHERE t.state IN ('in_progress', 'peer_review')
    ORDER BY t.updated_at DESC
    LIMIT 1
  `;
  if (taskRows.length === 0) return null;

  const task = taskRows[0] as Task;

  const [activityRows, documentRows] = await Promise.all([
    db`SELECT * FROM hq_activity WHERE task_id = ${task.id} ORDER BY created_at DESC LIMIT 8`,
    db`SELECT * FROM hq_documents WHERE task_id = ${task.id} ORDER BY created_at DESC`,
  ]);

  return {
    ...task,
    activity: activityRows as Activity[],
    documents: documentRows as Document[],
  };
}

export async function getTaskById(
  id: string
): Promise<
  | (Task & { comments: Comment[]; documents: Document[]; activity: Activity[] })
  | null
> {
  const db = getDb();
  const taskRows = await db`
    SELECT t.*, g.title as goal_title, a.name as agent_name
    FROM hq_tasks t
    LEFT JOIN hq_goals g ON t.goal_id = g.id
    LEFT JOIN hq_agents a ON t.assigned_to = a.id
    WHERE t.id = ${id}
  `;
  if (taskRows.length === 0) return null;

  const task = taskRows[0] as Task;

  const [commentRows, documentRows2, activityRows2] = await Promise.all([
    db`SELECT * FROM hq_comments WHERE task_id = ${id} ORDER BY created_at ASC`,
    db`SELECT * FROM hq_documents WHERE task_id = ${id} ORDER BY created_at DESC`,
    db`SELECT * FROM hq_activity WHERE task_id = ${id} ORDER BY created_at DESC`,
  ]);

  return {
    ...task,
    comments: commentRows as Comment[],
    documents: documentRows2 as Document[],
    activity: activityRows2 as Activity[],
  };
}

// ── Comments ────────────────────────────────────────────

export async function createComment(
  taskId: string,
  content: string,
  mentions: string[] = []
): Promise<Comment> {
  const db = getDb();
  const rows = await db`
    INSERT INTO hq_comments (task_id, author, content, mentions)
    VALUES (${taskId}, 'Eduard', ${content}, ${mentions})
    RETURNING *
  `;
  return rows[0] as Comment;
}
