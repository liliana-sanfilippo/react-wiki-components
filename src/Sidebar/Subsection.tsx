import {stringToSlug} from "../utils/stringToSlug";
import {useSection} from "./SectionContext";

export function Subesection({title, children}: {title: string, children: React.ReactNode}){
    const { sectionTitle } = useSection();
    let id = stringToSlug(sectionTitle + "-" + title);
    return(
        <section id={id} className="subsection">
            <h2 id={id + "H"} className="subsection-header">{title}</h2>
            {children}
        </section>
    )
}