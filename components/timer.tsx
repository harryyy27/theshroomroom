import {useState,useEffect} from 'react';
export default function Timer(props:any){
    const [days,setDays]=useState('00');
    const [hours,setHours]=useState('00');
    const [minutes,setMinutes]=useState('00');
    const [seconds,setSeconds]=useState('00');
    function calculateTimeLeft(targetDate:Date){
        let dateTime= new Date()
        let dateTarget= targetDate
        const newTimeDifference = +dateTarget - +dateTime;
        if(newTimeDifference>0){
            let timeLeft={
                days:Math.floor(newTimeDifference/(24*60*60*1000)),
                hours:Math.floor((newTimeDifference/(1000*60*60))%24),
                minutes:Math.floor((newTimeDifference/(1000*60))%60),
                seconds:Math.floor((newTimeDifference/(1000))%60),
            }
            return timeLeft
        }
    }
    useEffect(()=>{
        const timer = setTimeout(() => {
            const secondElement = document.querySelector('.color-animate')
            if(secondElement){
                secondElement.classList.remove('color-animate')
            }
            const date = props.countdownDate
            const timeLeft=calculateTimeLeft(date);
            setDays(timeLeft?timeLeft.days<10?'0'+timeLeft?.days as string:String(timeLeft?.days):'00')
            setHours(timeLeft?timeLeft.hours<10?'0'+timeLeft?.hours as string:String(timeLeft?.hours):'00')
            setMinutes(timeLeft?timeLeft.minutes<10?'0'+timeLeft?.minutes as string:String(timeLeft?.minutes):'00')
            setSeconds(timeLeft?timeLeft.seconds<10?'0'+timeLeft?.seconds as string:String(timeLeft?.seconds):'00')

            if(secondElement){
                secondElement.classList.add('color-animate')
            }
            }, 1000);
        return () => clearTimeout(timer);
    },[seconds])
    
return(
    <>

    <div>
        <h2 className="timer-heading">Time Remaining</h2>
    </div>
    <div className="timer-wrapper">
        <div className="timer-divider">
        <span className="timer-interval-wrapper"><span className="timer-interval days">{days}</span><span className="timer-colon">:</span></span>
        <span className="timer-header days">Days</span>
        </div>
        <div className="timer-divider">
        <span className="timer-interval-wrapper"><span className="timer-interval hours">{hours}</span><span className="timer-colon">:</span></span>
        <span className="timer-header hours">Hours</span>
        </div>
        <div className="timer-divider">
        <span className="timer-interval-wrapper">
            <span className="timer-interval minutes">{minutes}</span>
            <span className="timer-colon">:</span>
        </span>
            <span className="timer-header minutes">Minutes</span>
        </div>
        <div className="timer-divider">
            <span className="timer-interval-wrapper">
                <span className="timer-interval seconds color-animate">{seconds}</span>

            </span>
        <span className="timer-header seconds">Seconds</span>
        </div>
        
    </div>
    </>
)

}