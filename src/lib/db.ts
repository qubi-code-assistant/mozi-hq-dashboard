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
    const url = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
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

export async function ensureTables(): Promise<void> {
  const db = getDb();
  try {
    await db`
      CREATE TABLE IF NOT EXISTS hq_agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        specialisation TEXT,
        status TEXT DEFAULT 'idle',
        last_heartbeat TIMESTAMPTZ,
        soul_md TEXT,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await db`
      CREATE TABLE IF NOT EXISTS hq_goals (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        title TEXT NOT NULL,
        description TEXT,
        assigned_agents TEXT[] DEFAULT '{}',
        tasks_per_day INTEGER DEFAULT 1,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await db`
      CREATE TABLE IF NOT EXISTS hq_tasks (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        goal_id TEXT,
        title TEXT NOT NULL,
        description TEXT,
        assigned_to TEXT,
        created_by TEXT DEFAULT 'mozi',
        state TEXT DEFAULT 'backlog',
        priority TEXT DEFAULT 'should',
        peer_approvals TEXT[] DEFAULT '{}',
        result_doc_id TEXT,
        blocked_reason TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await db`
      CREATE TABLE IF NOT EXISTS hq_comments (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        task_id TEXT,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        mentions TEXT[] DEFAULT '{}',
        notified BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await db`
      CREATE TABLE IF NOT EXISTS hq_documents (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        task_id TEXT,
        author TEXT NOT NULL,
        title TEXT,
        content TEXT NOT NULL,
        version INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await db`
      CREATE TABLE IF NOT EXISTS hq_activity (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        agent TEXT NOT NULL,
        action TEXT NOT NULL,
        task_id TEXT,
        detail TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    // Seed agents if empty
    await db`
      INSERT INTO hq_agents (id, name, role, specialisation) VALUES
        ('mozi','Mozi','Orchestrator','Coordination, task management, escalation'),
        ('woz','Woz','Senior Coder','React Native, Rails, Python, Next.js, Docker'),
        ('holmes','Holmes','Researcher','Web research, competitor analysis, market data, clinical'),
        ('napoleon','Napoleon','Strategist','GTM, positioning, campaigns, pricing, partnerships'),
        ('harvey','Harvey','Legal','GDPR, contracts, compliance, app store policies'),
        ('shakespeare','Shakespeare','Content Writer','Blog, SEO, email, hooks, landing copy, social'),
        ('oracle','Oracle','Data Analyst','Metrics, cohort analysis, unit economics, dashboards'),
        ('gordon','Gordon','Devil''s Advocate','Quality gate, assumption challenging, brutal feedback'),
        ('alfred','Alfred','Executor','Publishing, automation, deployment, follow-through'),
        ('gucci','Gucci','Designer','UI/UX briefs, brand consistency, design specs, Stitch prompts'),
        ('warren','Warren','Finance','Unit economics, P&L, pricing validation, runway, investor financials'),
        ('jordan','Jordan','Sales','Dentist outreach, cold email, clinic onboarding, pipeline, follow-up')
      ON CONFLICT (id) DO NOTHING
    `;
  } catch (e) {
    console.error("ensureTables error:", e);
  }
}
