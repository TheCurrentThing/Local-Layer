import { saveFeatureSettingsAction } from "@/app/admin/actions";
import {
  AdminCard,
  AdminCheckbox,
  HiddenField,
  SaveButton,
} from "@/components/admin/FormPrimitives";
import type { FeatureFlags } from "@/types/site";

export function SectionVisibilityEditor({
  title,
  description,
  features,
  redirectPath,
  includeMenuTiming = true,
  includeUtilityOptions = true,
}: {
  title: string;
  description: string;
  features: FeatureFlags;
  redirectPath: string;
  includeMenuTiming?: boolean;
  includeUtilityOptions?: boolean;
}) {
  return (
    <AdminCard title={title} description={description}>
      <form action={saveFeatureSettingsAction} className="space-y-4">
        <HiddenField name="redirect_to" value={redirectPath} />

        {includeMenuTiming ? (
          <div className="grid gap-3 md:grid-cols-3">
            <AdminCheckbox
              label="Show Breakfast Menu"
              name="show_breakfast_menu"
              defaultChecked={features.showBreakfastMenu}
            />
            <AdminCheckbox
              label="Show Lunch Menu"
              name="show_lunch_menu"
              defaultChecked={features.showLunchMenu}
            />
            <AdminCheckbox
              label="Show Dinner Menu"
              name="show_dinner_menu"
              defaultChecked={features.showDinnerMenu}
            />
          </div>
        ) : (
          <>
            <HiddenField
              name="show_breakfast_menu"
              value={features.showBreakfastMenu ? "on" : ""}
            />
            <HiddenField
              name="show_lunch_menu"
              value={features.showLunchMenu ? "on" : ""}
            />
            <HiddenField
              name="show_dinner_menu"
              value={features.showDinnerMenu ? "on" : ""}
            />
          </>
        )}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <AdminCheckbox
            label="Show Daily Specials"
            name="show_specials"
            defaultChecked={features.showSpecials}
          />
          <AdminCheckbox
            label="Show Photo Gallery"
            name="show_gallery"
            defaultChecked={features.showGallery}
          />
          <AdminCheckbox
            label="Show Testimonials"
            name="show_testimonials"
            defaultChecked={features.showTestimonials}
          />
          <AdminCheckbox
            label="Show Map in Contact Section"
            name="show_map"
            defaultChecked={features.showMap}
          />
          {includeUtilityOptions ? (
            <>
              <AdminCheckbox
                label="Show Online Ordering Links"
                name="show_online_ordering"
                defaultChecked={features.showOnlineOrdering}
              />
              <AdminCheckbox
                label="Show Mobile Action Buttons"
                name="show_sticky_mobile_bar"
                defaultChecked={features.showStickyMobileBar}
              />
            </>
          ) : (
            <>
              <HiddenField
                name="show_online_ordering"
                value={features.showOnlineOrdering ? "on" : ""}
              />
              <HiddenField
                name="show_sticky_mobile_bar"
                value={features.showStickyMobileBar ? "on" : ""}
              />
            </>
          )}
        </div>

        <SaveButton label="Save Section Visibility" />
      </form>
    </AdminCard>
  );
}
