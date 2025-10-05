import {stringToSlug} from "../utils/stringToSlug";
import {SidebarContents} from "./definitions";
import {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import {useNavigation} from "@liliana-sanfilippo/react-link";
import {deriveTabsData} from "./deriveTabsData";
import {hightlightSubsection} from "./highlightSubsections";
import {highlightSection} from "./highlightSections";

/**
 * Function that creates the contents of the sidebar from a list of all the sections with their respective subsections.
 * @param sidebarContents  list of all the sections titles with their respective subsection titles
 * @constructor
 */
export function SidebarContent({sidebarContents }: { sidebarContents: SidebarContents[]}) {
    /**
     * Get current location (page/path).
     */
    const location  = useLocation();
    /**
     * Get current url based on current location.
     */
    let url: string = `/${location.pathname.startsWith("/") ? location.pathname.slice(1) : location.pathname}`;
    /**
     * Use {@goToPlace} for linking.
     */
    const {goToPlace} = useNavigation();
    /**
     * Get a list of all the section IDs and the IDs of their respective subsections.
     */
    const {section_ids, subsection_ids } = deriveTabsData(sidebarContents);

    const [activeSidebarSection, setActiveSidebarSection] = useState<string | null>(null);


    useEffect(() => {
        const handleScroll = () => {
            section_ids.forEach((section_id, section_id_index) => {
                const html_section_element = document.getElementById(section_id);
                const sidebar_section_element = document.getElementById(`sidebar-section${section_id_index}`);

                if (html_section_element && sidebar_section_element) {

                    highlightSection({ section_html: html_section_element }, {sidebar_section_element: sidebar_section_element });
                }
            });

            subsection_ids.forEach((subsection_id, subsection_id_index) => {
                const html_subsection_element = document.getElementById(subsection_id);

                const sidebar_subsection_element = document.getElementById(`sidebar-subsection${subsection_id_index}`);
                if (html_subsection_element && sidebar_subsection_element) {
                    hightlightSubsection({ subsection_html: html_subsection_element }, { sidebar_subsection_element: sidebar_subsection_element });
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [section_ids, subsection_ids, activeSidebarSection]);

    const toggleSidebarSection = (sb_sec: string) => {
        setActiveSidebarSection(activeSidebarSection === sb_sec ? null : sb_sec);
    };

    let subsection_number = 0;


    return (
        <>
            <br/>
        <nav className="sidebar">
            {sidebarContents.map((content: SidebarContents, content_index: number) => {
                    let content_header_slug: string = stringToSlug(content.header);
                    const sidebar_tabId = `tab-${content_header_slug}`;
                    const sidebar_parentId = `parent-${content_header_slug}`;
                    const sidebar_sectionId = `sidebar-section${content_index}`;

                    return (
                        <div key={content_index}>

                        <div id={sidebar_sectionId} className="detail-sideitem">
                    <div id={sidebar_parentId} className="sideitem">
                    <a
                        onClick={() => {
                        toggleSidebarSection(content_header_slug);
                        goToPlace({path: url, scrollToId: `${content_header_slug}H`});
                        sidebarContents.forEach((sb_content: SidebarContents) => {
                            let sb_content_slug: string = stringToSlug(sb_content.header);
                            if (sb_content_slug !== content_header_slug) {
                                document.getElementById(`tab-${sb_content_slug}`)!.style.display = "none";

                                document.getElementById(`parent-${sb_content_slug}`)!.classList.remove("active-sideitem");
                            }
                        });
                    }}
                >
                    <summary>{content.header}</summary>
                    </a>
                    {content.subheaders && (
                        <span
                            id={sidebar_tabId}
                        className="sidesubtab"
                        style={{ display: activeSidebarSection === content_header_slug ? "block" : "none" }}
                    >
                        <ul>
                            {content.subheaders.map((subheader: string) => {
                                    const sidebar_subheader_id = `sidebar-subsection${subsection_number}`;
                                    subsection_number = subsection_number + 1;
                                    let subheader_slug: string = `${stringToSlug(content_header_slug + "-" + subheader)}H`;
                                    return (
                                        <li key={subsection_number} id={sidebar_subheader_id}>
                                    <a
                                        onClick={() => {
                                        goToPlace({path: url, scrollToId: subheader_slug});
                                    }}>
                                    {subheader}
                                    </a>
                                    </li>
                                );
                                })}
                        </ul>
                        </span>
                    )}
                    </div>
                    </div>
                    </div>
                );
                })}
            </nav>
            </>
    );
}