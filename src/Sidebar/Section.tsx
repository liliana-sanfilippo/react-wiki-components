import {stringToSlug} from "../utils/stringToSlug";
import {SectionContext} from "./SectionContext";

export function Section({title, children}: {title: string, children: React.ReactNode}){
    let id = stringToSlug(title);
    return(
            <div className="section-box">
                <section id={id} className="section">
                    <h1 id={`${id}H`} className="section-header">{title}</h1>
                    <SectionContext.Provider value={{ sectionId: id, sectionTitle: title }}>
                    {children}
                    </SectionContext.Provider>
                </section>
            </div>
    )
}