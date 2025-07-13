export const KnowledgePanel = ({ active, setActive }:
  { active: "instructions" | "knowledge" | "", setActive: (x: "instructions" | "knowledge" | "") => void }) => {
  return (
    <div className={`relative border border-foreground/20 rounded-sm w-full bg-background 
          duration-700 ease-in-out transition-all overflow-y-scroll 
          ${active === "knowledge" ? "flex-4" : "flex-1 hover:flex-4"}`}
      onClick={() => setActive("knowledge")}>
      <h1 className="font-semibold text-emerald-700 dark:text-emerald-300 px-1">
        external knowledge
      </h1>
    </div>
  );
}
