import {scrollUpWithOffset} from "./scrollUpWithOffset";

export function BackUp(){
    return(
        <>
            <br/>
            <div className="col" style={{display: "flex", alignItems: "right"}}>
                <button onClick={() => scrollUpWithOffset()} className="btn backtotop">
                    Back to Top &#8593;
                </button>
            </div>
        </>
    )
}