export function hightlightSubsection({subsection_html}: {subsection_html: HTMLElement | null}, {sidebar_subsection_element}:{sidebar_subsection_element: HTMLElement | null}){
    let TopDistance = 195;
    if (subsection_html != null && sidebar_subsection_element != null){
        if (subsection_html.getBoundingClientRect().top < TopDistance + 1 && subsection_html.getBoundingClientRect().bottom > TopDistance){
            (sidebar_subsection_element.childNodes[0] as HTMLElement).classList.add("active-subsideitem");
        }
        else{
            (sidebar_subsection_element.childNodes[0] as HTMLElement).classList.remove("active-subsideitem");
        }
    }

}