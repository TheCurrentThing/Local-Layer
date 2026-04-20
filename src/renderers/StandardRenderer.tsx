// Contract-driven section dispatch. This is the ONLY place sections get
// composed from a contract. No category branching, no food-special-casing.
//
// Flow:
//   1. resolveRenderContract(payload) returns an ordered, filtered list.
//   2. Walk the list, look each type up in SECTION_COMPONENT_MAP, render.
//   3. Unknown types warn in dev, silently skip in prod.

import { Fragment } from "react";
import type { SiteRendererProps } from "@/types/renderer";
import { resolveRenderContract } from "@/lib/rendering/resolve-render-contract";
import { SECTION_COMPONENT_MAP } from "@/lib/rendering/section-component-map";

export function StandardRenderer({ payload }: SiteRendererProps) {
  const contract = resolveRenderContract(payload);

  return (
    <main
      data-family={payload.kitFamily}
      data-category={payload.kitCategory}
      data-renderer="standard"
    >
      {contract.sections.map((section) => {
        const SectionComponent = SECTION_COMPONENT_MAP[section.type];

        if (!SectionComponent) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              `[StandardRenderer] No component registered for section "${section.type}"`,
            );
          }
          return null;
        }

        return (
          <Fragment key={section.type}>
            <SectionComponent payload={payload} />
          </Fragment>
        );
      })}
    </main>
  );
}
