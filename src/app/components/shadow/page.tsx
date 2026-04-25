import { shadows } from "@/app/components/_shared/data";
import { PageHeader, PrimitiveTable } from "@/app/components/_shared/helpers";

export default function ShadowPage() {
  return (
    <>
      <PageHeader description="Elevation shadows." title="Shadow" />
      <PrimitiveTable
        rows={shadows.map((s) => ({
          name: s.name,
          preview: (
            <div
              className="h-10 w-24 rounded-md bg-surface"
              style={{ boxShadow: s.cssVar }}
            />
          ),
          usage: s.usage,
        }))}
      />
    </>
  );
}
