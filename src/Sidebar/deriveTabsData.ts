import {SidebarContents} from "./definitions";
import {stringToSlug} from "../utils/stringToSlug";

/**
 * Creates the ids used for highlighting and id-ing the sidebar tabs.
 * @param sidebar_contents ist of all the sections with their respective subsections
 */
export function deriveTabsData(sidebar_contents: SidebarContents[]) {
    /**
     * Initialise empty lists for all section ids and all subsection ids.
     */
    const section_ids: string[] = [];
    const subsection_ids: string[] = [];
    /**
     * Iterate through the whole list of sidebar contents.
     */
    sidebar_contents.forEach((sidebar_item: SidebarContents) => {
        let count = 1;
        const section_id = stringToSlug(sidebar_item.header);
        section_ids.push(section_id);
        if (sidebar_item.subheaders) {
            sidebar_item.subheaders.forEach((index) => {

                subsection_ids.push(stringToSlug(section_id + "-" + index));
                count += 1;
            });
        }
    });

    return { section_ids, subsection_ids };
}