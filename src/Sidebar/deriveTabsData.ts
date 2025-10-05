import {SidebarContents} from "./definitions";
import {stringToSlug} from "../utils/stringToSlug";

export function deriveTabsData(sidebar_contents: SidebarContents[]) {
    const section_ids: string[] = [];
    const subsection_ids: string[] = [];

    sidebar_contents.forEach((sidebar_item: SidebarContents) => {
        let count = 1;
        // sectionTitle + "-" + title
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