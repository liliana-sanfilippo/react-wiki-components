export function highlightSection({section_html}: {section_html: HTMLElement | null}, {sidebar_section_element}:{sidebar_section_element: HTMLElement | null}){
    let TopDistance = 195;
    if (section_html != null && sidebar_section_element != null){
        if (section_html.getBoundingClientRect().top < TopDistance + 1 && section_html.getBoundingClientRect().bottom > TopDistance){
            (sidebar_section_element.childNodes[0] as HTMLElement).classList.add("active-sideitem");
            if(sidebar_section_element.childNodes[0].childNodes[1] != undefined){
                (sidebar_section_element.childNodes[0].childNodes[1] as HTMLElement).style.display = "block";
            }
        } else {
            (sidebar_section_element.childNodes[0] as HTMLElement).classList.remove("active-sideitem");
            if(sidebar_section_element.childNodes[0] != undefined){
                (sidebar_section_element.childNodes[0] as HTMLElement).classList.remove("active-sideitem");
                if(sidebar_section_element.childNodes[0].childNodes[1] != undefined){
                    (sidebar_section_element.childNodes[0].childNodes[1] as HTMLElement).style.display = "none";
                }
            }
        }
    } else {
        console.error("Element oder Subtitle nicht gefunden:", section_html, sidebar_section_element);
    }
}