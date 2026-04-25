import { iconSizes } from "@/app/components/_shared/data";
import { PageHeader, PrimitiveTable } from "@/app/components/_shared/helpers";
import { loadDemoIconSvg, sizedIcon } from "@/app/components/_shared/icons";

export default function IconSizePage() {
  const demoSvg = loadDemoIconSvg();
  return (
    <>
      <PageHeader description="Icon size scale (xs–xl)." title="Icon Size" />
      <PrimitiveTable
        rows={iconSizes.map((s) => ({
          name: s.name,
          preview: (
            <div className="flex items-center gap-md">
              <div
                className="flex items-center justify-center"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Preview renders checked-in local SVG assets at different sizes.
                dangerouslySetInnerHTML={{ __html: sizedIcon(demoSvg, s.px) }}
                style={{ width: 32, height: 32 }}
              />
              <span className="text-13 text-foreground">{s.px}px</span>
            </div>
          ),
          usage: s.usage,
        }))}
      />
    </>
  );
}
