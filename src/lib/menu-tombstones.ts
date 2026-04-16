export const DELETED_MENU_SECTION_DESCRIPTION =
  "__branchkit_deleted_menu_section__";

export function isDeletedMenuSectionDescription(
  description: string | null | undefined,
) {
  return description === DELETED_MENU_SECTION_DESCRIPTION;
}
