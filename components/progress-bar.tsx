import {useState} from 'react'
import Image from 'next/image'
export default function ProgressBar(props:any){
    return(
        <div id="progressBar">
                <div className="progress-bar-wrap" >
                    <button className="progress-bar-phase"onClick={(e)=>props.handlePhaseChange(1)}>{props.phase>1?<Image alt="tick" width="48" height="48"src="/tick.png"/>:<span className="progress-bar-phase-number">1</span>}</button>
                    <span className="progress-bar-name">Delivery details</span>
                    <span className={`progress-bar-line ${props.phase>1?"green":''}`}></span>
                </div>
                <div className="progress-bar-wrap">
                    <button className="progress-bar-phase" onClick={(e)=>props.handlePhaseChange(2)} disabled={props.phase<2}>{props.phase>2?<Image alt="tick" width="48" height="48"src="/tick.png"/>:<span className="progress-bar-phase-number">2</span>}</button>
                    <span className="progress-bar-name">Shipping details</span>
                    <span className={`progress-bar-line ${props.phase>2?"green":''}`}></span>
                </div>
                <div className="progress-bar-wrap">
                    <span className="progress-bar-phase">{props.phase===666?<Image alt="tick" width="48" height="48"src="/tick.png"/>:<span className="progress-bar-phase-number">3</span>}</span>
                    <span className="progress-bar-name">Payment details</span>
                </div>
                    
            
                    
        </div>
    )
}