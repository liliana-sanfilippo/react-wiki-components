import {SidebarContents} from "./definitions";

export function getSectionHeaders(): SidebarContents[] {
    let elements: SidebarContents[] = new Array<SidebarContents>;
    const section_html_elements = document.querySelectorAll<HTMLElement>('.section');
    console.log(section_html_elements.length)
    section_html_elements.forEach( (section) => {
        let subheader_text_list: string[] = []
        const header_text: string = section.querySelector<HTMLElement>(".section-header")?.innerText ?? "UNDEFINED";
        const subsection_html_elements = section.querySelectorAll<HTMLElement>(".subsection");
        subsection_html_elements.forEach((subsection) => {
            const subheader_text: string = subsection.querySelector<HTMLElement>(".subsection-header")?.innerText ?? "UNDEFINED";
            subheader_text_list.push(subheader_text);
        });
        let sidebar_content: SidebarContents;
        if(subheader_text_list.length > 0){
            sidebar_content = {
                header: header_text,
                subheaders: subheader_text_list
            };
        } else {
            sidebar_content = {
                header: header_text
            };
        };
        elements.push(sidebar_content);
    });

    return elements;
}
