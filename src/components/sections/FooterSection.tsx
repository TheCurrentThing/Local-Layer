// Site footer. Business name, address, phone, copyright.

import type { SitePayload } from "@/types/site";
import { getBusinessAddress } from "@/lib/brand";

export function FooterSection({ payload }: { payload: SitePayload }) {
  const year = new Date().getFullYear();

  return (
    <footer
      data-section="footer"
      className="border-t border-zinc-800 bg-zinc-950 px-6 py-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              {payload.brand.businessName}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {getBusinessAddress(payload.brand)}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-xs text-zinc-500">
            {payload.brand.phone && <span>{payload.brand.phone}</span>}
            {payload.brand.email && <span>{payload.brand.email}</span>}
          </div>
        </div>
        <p className="mt-8 text-xs text-zinc-600">
          © {year} {payload.brand.businessName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
