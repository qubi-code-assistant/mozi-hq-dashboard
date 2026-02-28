import { parseChecklist } from "@/lib/utils";
import type { Document } from "@/lib/types";

export function ChecklistTab({
  description,
  documents,
}: {
  description: string | null;
  documents: Document[];
}) {
  const allContent = [
    description ?? "",
    ...documents.map((d) => d.content),
  ].join("\n");

  const sections = parseChecklist(allContent);
  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);
  const checkedItems = sections.reduce(
    (sum, s) => sum + s.items.filter((i) => i.checked).length,
    0
  );
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  if (totalItems === 0) {
    return (
      <div className="p-6 text-center text-slate-400">
        <p>No checklist items found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>Progress</span>
          <span>
            {checkedItems}/{totalItems} ({Math.round(progress)}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-exec-accent h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-4">
        {sections.map((section, si) => (
          <div key={si}>
            {section.header && (
              <h4 className="text-sm font-bold text-slate-700 mb-2">
                {section.header}
              </h4>
            )}
            <div className="space-y-2">
              {section.items.map((item, ii) => (
                <label
                  key={ii}
                  className="flex items-center gap-3 text-sm text-slate-600 py-1"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    className="rounded border-slate-300 w-4 h-4"
                  />
                  <span
                    className={
                      item.checked ? "line-through text-slate-400" : ""
                    }
                  >
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
