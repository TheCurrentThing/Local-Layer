import {
  saveBrandingAction,
  saveBusinessInfoAction,
  saveSetupHoursAction,
  saveSetupMenuAction,
  saveSetupSpecialsAction,
} from "@/app/admin/actions";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminShell } from "@/components/admin/AdminShell";
import { SetupWizardSteps } from "@/components/admin/SetupWizard";
import {
  AdminCard,
  AdminFileInput,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  HiddenField,
  PageLink,
  PreviewLink,
  SaveButton,
} from "@/components/admin/FormPrimitives";
import { getAdminSitePayload } from "@/lib/queries";

const stepOptions = new Set(["1", "2", "3", "4", "5", "6"]);
const scheduleDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type AdminPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getStepValue(searchParams?: Record<string, string | string[] | undefined>) {
  const rawStep = Array.isArray(searchParams?.step)
    ? searchParams?.step[0]
    : searchParams?.step;

  return rawStep && stepOptions.has(rawStep) ? rawStep : "1";
}

export default async function AdminSetupPage({ searchParams }: AdminPageProps) {
  const payload = await getAdminSitePayload();
  const step = getStepValue(searchParams);

  const content = (() => {
    if (step === "1") {
      return (
        <AdminCard
          title="Step 1: Business Info"
          description="Start with the details customers trust most: name, phone, address, and tagline."
        >
          <form action={saveBusinessInfoAction} className="space-y-4">
            <HiddenField name="redirect_to" value="/admin/setup?step=1" />
            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput
                label="Business Name"
                name="business_name"
                defaultValue={payload.brand.businessName}
                required
              />
              <AdminInput
                label="Tagline"
                name="tagline"
                defaultValue={payload.brand.tagline}
                required
              />
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
            </div>
            <div className="flex flex-wrap gap-3">
              <SaveButton label="Save Business Info" />
              <PageLink href="/admin/setup?step=2" label="Continue to Branding" />
            </div>
          </form>
        </AdminCard>
      );
    }

    if (step === "2") {
      return (
        <AdminCard
          title="Step 2: Branding"
          description="Choose the brand colors, logo URL, upload a logo if you have one, and set the fonts that shape the restaurant's visual style."
        >
          <form action={saveBrandingAction} className="space-y-4">
            <HiddenField name="redirect_to" value="/admin/setup?step=2" />
            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput
                label="Business Name"
                name="business_name"
                defaultValue={payload.brand.businessName}
                required
              />
              <AdminInput
                label="Tagline"
                name="tagline"
                defaultValue={payload.brand.tagline}
                required
              />
              <AdminInput
                label="Logo Image URL"
                name="logo_url"
                defaultValue={payload.brand.logoUrl}
              />
              <AdminFileInput
                label="Upload Logo"
                name="logo_file"
                accept=".png,.jpg,.jpeg,.webp,.svg"
                helperText="Upload a logo file here to use it instead of a direct URL."
              />
              <AdminInput
                label="Background Color"
                name="background_color"
                defaultValue={payload.brand.backgroundColor}
                required
              />
              <AdminInput
                label="Text Color"
                name="foreground_color"
                defaultValue={payload.brand.foregroundColor}
                required
              />
              <AdminInput
                label="Box / Card Color"
                name="card_color"
                defaultValue={payload.brand.cardColor}
                required
              />
              <AdminInput
                label="Alternate Section Color"
                name="muted_section_color"
                defaultValue={payload.brand.mutedSectionColor}
                required
              />
              <AdminInput
                label="Featured Section Color"
                name="highlight_section_color"
                defaultValue={payload.brand.highlightSectionColor}
                required
              />
              <AdminInput
                label="Header Bar Color"
                name="header_background_color"
                defaultValue={payload.brand.headerBackgroundColor}
                required
              />
              <AdminInput
                label="Announcement Bar Color"
                name="announcement_background_color"
                defaultValue={payload.brand.announcementBackgroundColor}
                required
              />
              <AdminInput
                label="Announcement Text Color"
                name="announcement_text_color"
                defaultValue={payload.brand.announcementTextColor}
                required
              />
              <AdminInput
                label="Border Color"
                name="border_color"
                defaultValue={payload.brand.borderColor}
                required
              />
              <AdminInput
                label="Primary Color"
                name="primary_color"
                defaultValue={payload.brand.primaryColor}
                required
              />
              <AdminInput
                label="Secondary Color"
                name="secondary_color"
                defaultValue={payload.brand.secondaryColor}
                required
              />
              <AdminInput
                label="Accent Color"
                name="accent_color"
                defaultValue={payload.brand.accentColor}
                required
              />
              <AdminInput
                label="Heading Font"
                name="heading_font"
                defaultValue={payload.brand.headingFont}
                required
              />
              <AdminInput
                label="Body Font"
                name="body_font"
                defaultValue={payload.brand.bodyFont}
                required
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <SaveButton label="Save Branding" />
              <PageLink href="/admin/setup?step=3" label="Continue to Hours" />
            </div>
          </form>
        </AdminCard>
      );
    }

    if (step === "3") {
      return (
        <AdminCard
          title="Step 3: Hours"
          description="Set the weekly business hours and the short summary line that appears in key spots on the site."
        >
          <form action={saveSetupHoursAction} className="space-y-4">
            <HiddenField name="redirect_to" value="/admin/setup?step=3" />
            <AdminInput
              label="Quick Hours Summary"
              name="quick_info_hours_label"
              defaultValue={payload.settings.quickInfoHoursLabel}
              required
            />
            <div className="space-y-3">
              {scheduleDays.map((day, index) => {
                const existing = payload.hours[index];
                return (
                  <div
                    key={day}
                    className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/35 p-4 md:grid-cols-[180px_1fr]"
                  >
                    <input type="hidden" name="day_label" value={day} />
                    <div className="font-semibold text-[var(--color-foreground)]">{day}</div>
                    <AdminInput
                      label="Open Hours"
                      name="open_text"
                      defaultValue={existing?.openText ?? "Closed"}
                      required
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3">
              <SaveButton label="Save Hours" />
              <PageLink href="/admin/setup?step=4" label="Continue to Menu Setup" />
            </div>
          </form>
        </AdminCard>
      );
    }

    if (step === "4") {
      return (
        <AdminCard
          title="Step 4: Menu Setup"
          description="Create the first menu section and optionally add a starter item inside it."
        >
          <form action={saveSetupMenuAction} className="space-y-4">
            <HiddenField name="redirect_to" value="/admin/setup?step=4" />
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_180px_120px]">
              <AdminInput label="Menu Section Name" name="name" required />
              <AdminInput label="Section Slug" name="slug" placeholder="optional" />
              <AdminSelect
                label="Menu Timing"
                name="service_window"
                defaultValue="all-day"
                options={[
                  { value: "all-day", label: "All day" },
                  { value: "breakfast", label: "Breakfast" },
                  { value: "lunch", label: "Lunch" },
                  { value: "dinner", label: "Dinner" },
                ]}
              />
              <AdminInput label="Order" name="sort_order" type="number" />
            </div>
            <AdminTextarea
              label="Section Description"
              name="description"
              rows={3}
            />
            <div className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/35 p-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <AdminInput label="Starter Item Name" name="item_name" />
                <AdminTextarea label="Starter Item Description" name="item_description" rows={3} />
              </div>
              <div className="space-y-4">
                <AdminInput
                  label="Starter Item Price"
                  name="item_price"
                  type="number"
                  step="0.01"
                  min="0"
                />
                <AdminInput
                  label="Starter Item Tags"
                  name="item_tags"
                  placeholder="Popular, House Favorite"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <SaveButton label="Save Starter Menu" />
              <PageLink href="/admin/setup?step=5" label="Continue to Specials" />
            </div>
          </form>
        </AdminCard>
      );
    }

    if (step === "5") {
      return (
        <AdminCard
          title="Step 5: Specials"
          description="Create the first featured special and set the top announcement banner."
        >
          <form action={saveSetupSpecialsAction} className="space-y-4">
            <HiddenField name="redirect_to" value="/admin/setup?step=5" />
            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput
                label="Announcement Label"
                name="announcement_title"
                defaultValue={payload.meta.announcementTitle}
                required
              />
              <AdminInput
                label="Announcement Text"
                name="announcement_body"
                defaultValue={payload.meta.announcementBody}
                required
              />
              <AdminInput
                label="Featured Special Name"
                name="title"
                required
              />
              <AdminInput
                label="Special Label"
                name="label"
                defaultValue="Today's Special"
                required
              />
              <AdminInput
                label="Special Price"
                name="price"
                type="number"
                step="0.01"
                min="0"
              />
            </div>
            <AdminTextarea label="Special Description" name="description" required />
            <div className="flex flex-wrap gap-3">
              <SaveButton label="Save Featured Special" />
              <PageLink href="/admin/setup?step=6" label="Continue to Review" />
            </div>
          </form>
        </AdminCard>
      );
    }

    return (
      <AdminCard
        title="Step 6: Review"
        description="Review the key information collected so far, then jump into the dashboard or preview the public site."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/35 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
              Business
            </p>
            <p className="mt-2 font-semibold text-[var(--color-foreground)]">
              {payload.brand.businessName}
            </p>
            <p className="mt-1 text-sm text-[var(--color-foreground)]/70">
              {payload.brand.phone}
            </p>
            <p className="mt-1 text-sm text-[var(--color-foreground)]/70">
              {payload.brand.addressLine1}, {payload.brand.city}, {payload.brand.state}{" "}
              {payload.brand.zip}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/35 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
              Today
            </p>
            <p className="mt-2 text-sm text-[var(--color-foreground)]/70">
              Announcement:{" "}
              {payload.meta.announcementIsActive && payload.meta.announcementBody
                ? payload.meta.announcementBody
                : "None"}
            </p>
            <p className="mt-2 text-sm text-[var(--color-foreground)]/70">
              Menu Sections: {payload.menuCategories.length}
            </p>
            <p className="mt-2 text-sm text-[var(--color-foreground)]/70">
              Specials: {payload.specials.length}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <PageLink href="/admin" label="Finish and Go to Overview" />
          <PreviewLink href="/" label="Preview Website" />
          <PageLink href="/admin/menu" label="Open Menu Manager" />
        </div>
      </AdminCard>
    );
  })();

  return (
    <AdminShell
      activeKey="setup"
      brandName={payload.brand.businessName}
      title="Setup Wizard"
      description="Use this guided setup to get the core restaurant website ready without digging through the full admin."
    >
      <AdminFeedback searchParams={searchParams} />
      <SetupWizardSteps currentStep={step} />
      {content}
    </AdminShell>
  );
}
