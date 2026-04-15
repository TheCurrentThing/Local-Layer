import { saveContactInfoAction } from "@/app/admin/actions";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminCard,
  AdminInput,
  HiddenField,
  PreviewLink,
  SaveButton,
} from "@/components/admin/FormPrimitives";
import { getAdminSitePayload } from "@/lib/queries";

type AdminPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function AdminContactPage({ searchParams }: AdminPageProps) {
  const payload = await getAdminSitePayload();

  return (
    <AdminShell
      activeKey="contact"
      brandName={payload.brand.businessName}
      title="Contact Info"
      description="Keep the business phone number, address, email, and social links accurate. These are some of the most important trust signals on the site."
    >
      <AdminFeedback searchParams={searchParams} />

      <AdminCard
        title="Public business details"
        description="These details power the call button, directions link, footer, and local business information."
      >
        <form action={saveContactInfoAction} className="space-y-4">
          <HiddenField name="redirect_to" value="/admin/contact" />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput
              label="Phone Number"
              name="phone"
              defaultValue={payload.brand.phone}
              required
            />
            <AdminInput
              label="Email Address"
              name="email"
              defaultValue={payload.brand.email}
            />
            <AdminInput
              label="Street Address"
              name="address_line_1"
              defaultValue={payload.brand.addressLine1}
              required
            />
            <AdminInput
              label="City"
              name="city"
              defaultValue={payload.brand.city}
              required
            />
            <AdminInput
              label="State"
              name="state"
              defaultValue={payload.brand.state}
              required
            />
            <AdminInput
              label="ZIP Code"
              name="zip"
              defaultValue={payload.brand.zip}
              required
            />
            <AdminInput
              label="Facebook URL"
              name="facebook_url"
              defaultValue={payload.brand.socialLinks.facebook}
            />
            <AdminInput
              label="Instagram URL"
              name="instagram_url"
              defaultValue={payload.brand.socialLinks.instagram}
            />
            <AdminInput
              label="TikTok URL"
              name="tiktok_url"
              defaultValue={payload.brand.socialLinks.tiktok}
            />
            <AdminInput
              label="Google Business URL"
              name="google_business_url"
              defaultValue={payload.brand.socialLinks.googleBusiness}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <SaveButton label="Save Contact Info" />
            <PreviewLink href="/contact" label="Preview Contact Page" />
          </div>
        </form>
      </AdminCard>
    </AdminShell>
  );
}
