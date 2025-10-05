import {SidebarContents} from "./definitions";
import {stringToSlug} from "../utils/stringToSlug";

export function deriveTabsData(sidebar_contents: SidebarContents[]) {
    const section_ids: string[] = [];
    const subsection_ids: string[] = [];

    sidebar_contents.forEach((sidebar_item: SidebarContents, i: number )=> {
        let count = 1;
        section_ids.push(stringToSlug(sidebar_item.header));
        if (sidebar_item.subheaders) {
            sidebar_item.subheaders.forEach((index) => {
                const id = "sec " + i.toString() + " " + index;
                subsection_ids.push(stringToSlug(id));
                count += 1;
            });
        }
    });

    return { section_ids, subsection_ids };
}