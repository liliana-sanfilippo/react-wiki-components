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
     * Iterate through all Section-HTML-Elements of the page.
     */
    section_html_elements.forEach( (section: HTMLElement) => {
        /**
         * Initialise an empty list to collect the subheader titles.
         */
        let subheader_text_list: string[] = []
        /**
         * Get the text of the section header.
         */
        const header_text: string = section.querySelector<HTMLElement>(".section-header")?.innerText ?? "UNDEFINED";
        /**
         * Get a list of all Subsection-HTML-Elements from the section.
         */
        const subsection_html_elements: NodeListOf<HTMLElement> = section.querySelectorAll<HTMLElement>(".subsection");
        /**
         * Iterate through all  Subsection-HTML-Elements of the section.
         */
        subsection_html_elements.forEach((subsection) => {
            /**
             * Get the subsection title.
             */
            const subheader_text: string = subsection.querySelector<HTMLElement>(".subsection-header")?.innerText ?? "UNDEFINED";
            /**
             * Put the subsection title in the list of all subsection titles.
             */
            subheader_text_list.push(subheader_text);
        });
        /**
         * Initialise empty SidebarContents;
         */
        let sidebar_content: SidebarContents;
        /**
         * If there are subsections with titles in the section, create SidebarContents with subheader title list.
         */
        if(subheader_text_list.length > 0){
            sidebar_content = {
                header: header_text,
                subheaders: subheader_text_list
            };
        }
        /**
         * If there are no subsections with titles in the section, create SidebarContents with just the section title.
         */
        else if  (header_text.length > 0){
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
