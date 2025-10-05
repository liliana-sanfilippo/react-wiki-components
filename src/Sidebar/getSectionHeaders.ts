import {SidebarContents} from "./definitions";

export function getSectionHeaders(): SidebarContents[] {
    /**
     * Initialise empty list of SidebarContents.
     */
    let elements: SidebarContents[] = new Array<SidebarContents>;
    /**
     * Get all Section-HTML-Elements from the page.
     */
    const section_html_elements: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('.section');
    /**
     * Iterate through all Section-HTML-Elements of the page
     */
    section_html_elements.forEach( (section: HTMLElement) => {
        /**
         * Initialise an empty list to collect the subheader titles.
         */
        let subheader_text_list: string[] = []
        const header_text: string = section.querySelector<HTMLElement>(".section-header")?.id ?? "UNDEFINED";
        const subsection_html_elements = section.querySelectorAll<HTMLElement>(".subsection");
        subsection_html_elements.forEach((subsection) => {
            const subheader_text: string = subsection.querySelector<HTMLElement>(".subsection-header")?.id ?? "UNDEFINED";
            subheader_text_list.push(subheader_text);
        });
        let sidebar_content: SidebarContents;
        if(subheader_text_list.length > 0){
            sidebar_content = {
                header: header_text,
                subheaders: subheader_text_list
            };
        } else if  (header_text.length > 0){
            sidebar_content = {
                header: header_text
            };
        } else {
            return null;
        }
        elements.push(sidebar_content);
    });

    return elements;
}
