import {stringToSlug} from "../utils/stringToSlug";

export function Subesection({title, children}: {title: string, children: React.ReactNode}){
    let id = stringToSlug(title);
    return(
        <section id={id} className="subsection">
            <h2 id={id + "H"} className="subsection-header">{title}</h2>
            {children}
        </section>
    )
}