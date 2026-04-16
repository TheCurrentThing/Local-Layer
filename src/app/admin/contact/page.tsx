import { AdminShell } from "@/components/admin/AdminShell";
import { ContactEditorClient } from "@/components/admin/ContactEditorClient";
import { getAdminSitePayload } from "@/lib/queries";

export default async function AdminContactPage() {
  const payload = await getAdminSitePayload();

  return (
    <AdminShell
      activeKey="contact"
      brandName={payload.brand.businessName}
      eyebrow="Contact"
      title="Contact"
      previewHref="/contact"
      contentClassName="min-h-0 flex flex-1 flex-col overflow-hidden"
    >
      <ContactEditorClient
        phone={payload.brand.phone ?? ""}
        email={payload.brand.email ?? ""}
        addressLine1={payload.brand.addressLine1 ?? ""}
        city={payload.brand.city ?? ""}
        state={payload.brand.state ?? ""}
        zip={payload.brand.zip ?? ""}
        facebook={payload.brand.socialLinks.facebook ?? ""}
        instagram={payload.brand.socialLinks.instagram ?? ""}
        tiktok={payload.brand.socialLinks.tiktok ?? ""}
        googleBusiness={payload.brand.socialLinks.googleBusiness ?? ""}
      />
    </AdminShell>
  );
}
