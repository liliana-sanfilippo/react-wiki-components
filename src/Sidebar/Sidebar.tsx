import {useEffect, useState} from "react";
import {SidebarProps} from "../types";
import {SidebarContent} from "./SidebarContents";
import {getSectionHeaders} from "./getSectionHeaders";
import {BackUp} from "../BackToTopButton/BackToTopButton";
import {SidebarContents} from "./definitions";

export const Sidebar: React.FC<SidebarProps>= ({backToTopButton})=> {
    const [state_header, set_state_header] = useState<SidebarContents[]>([]);
    /**
     * Get a list of all the section headers and subsection headers to give to the {@SidebarContent} component.
     */
    useEffect(() => {
        set_state_header(getSectionHeaders())
    },  [])


    if (state_header && state_header.length > 0) {
        return(
            <div className="sticky-top" style={{top: "10%"}}>
                <SidebarContent sidebarContents={state_header}></SidebarContent>
                { backToTopButton && <BackUp/>}
            </div>
        )
    } else {
        return(
            <div>

            </div>
        )
    }
}