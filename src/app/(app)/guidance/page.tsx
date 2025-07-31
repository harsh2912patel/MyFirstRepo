import { GuidanceForm } from "@/components/guidance/guidance-form";

export default function GuidancePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Financial Guidance</h2>
      </div>
      <GuidanceForm />
    </div>
  );
}
