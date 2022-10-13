import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"



export default function Checkout(){
    const [dFirstName,setDFirstName]=useState('');
    const [dSurname,setDSurname]=useState('');
    const [dFirstLine,setDFirstLine]=useState('');
    const [dSecondLine,setDSecondLine]=useState('');
    const [dCity,setDCity]=useState('');
    const [dPostcode,setBPostcode]=useState('');
    const [bFirstName,setBFirstName]=useState('');
    const [bSurname,setBSurname]=useState('');
    const [bFirstLine,setBFirstLine]=useState('');
    const [bSecondLine,setBSecondLine]=useState('');
    const [bCity,setBCity]=useState('');
    const [bPostcode,setDPostcode]=useState('');
    const [user,setUser]=useState({})
    useEffect(()=>{
        const initiate = async()=>{
            const session = await getSession()
            if(session){
                fetch(`http://localhost:3000/api/getUser/email=${session.user.email}`)
                .then((res)=>{
                    return res.json()
                })
                .then((res)=>{
                        console.log(res)
                        // for(var i:Number=0;i<objkeys.length;i++){
                        //     console.log(document.getElementById(objkeys[i]))
                        //     console.log(document.getElementById(objkeys[i]).value)
                        //     document.getElementById(objkeys[i]).value=res.user.address[objkeys[i]]
                        // }
                        setUser(res.user)
                        setDFirstName(res.user.dAddress.surname);
                        setDSurname(res.user.dAddress.surname);
                        setDFirstLine(res.user.dAddress.firstLine);
                        setDSecondLine(res.user.dAddress.secondLine);
                        setDCity(res.user.dAddress.city);
                        setDPostcode(res.user.dAddress.postcode);
                        setBFirstName(res.user.bAddress.surname);
                        setBSurname(res.user.bAddress.surname);
                        setBFirstLine(res.user.bAddress.firstLine);
                        setBSecondLine(res.user.bAddress.secondLine);
                        setBCity(res.user.bAddress.city);
                        setBPostcode(res.user.bAddress.postcode);
                })
            }
        }
        initiate()
    },[])
    
    return(
        <div>
            <h1>CHECK ME OUT</h1>
            <form action="">
                <h2>Delivery Address</h2>
                <label htmlFor="dFirstName">First Name</label>
                <input  id="dFirstName" value={dFirstName} onChange={(e)=>setDFirstName(e.target.value)}/>
                <label htmlFor="dSurname">Surname</label>
                <input id="dSurname" value={dSurname} onChange={(e)=>setDSurname(e.target.value)}/>
                <label htmlFor="dFirstLine">Street name and number</label>
                <input id="dFirstLine1" value={dFirstLine} onChange={(e)=>setDFirstLine(e.target.value)}/>
                <label htmlFor="dSecondLine">2nd Line of address</label>
                <input id="dSecondLine" value={dSecondLine} onChange={(e)=>setDSecondLine(e.target.value)}/>
                <label htmlFor="dCity">City</label>
                <input id="dCity" value={dCity} onChange={(e)=>setDCity(e.target.value)}/>
                <label htmlFor="dPostcode">Postcode</label>
                <input id="dPostcode" value={dPostcode} onChange={(e)=>setDPostcode(e.target.value)}/>
                <label htmlFor="updates">Receive updates</label>
                <input id="updates" type="checkbox" onChange={(e)=>setUpdates(e.target.checked)}/>
                <h2>Billing Address</h2>
                <label htmlFor="bFirstName">First Name</label>
                <input  id="bFirstName" value={bFirstName} onChange={(e)=>setBFirstName(e.target.value)}/>
                <label htmlFor="bSurname">Surname</label>
                <input id="bSurname" value={bSurname} onChange={(e)=>setBSurname(e.target.value)}/>
                <label htmlFor="bFirstLine">Street name and number</label>
                <input id="bFirstLine1" value={bFirstLine} onChange={(e)=>setBFirstLine(e.target.value)}/>
                <label htmlFor="bSecondLine">2nd Line of address</label>
                <input id="bSecondLine" value={bSecondLine} onChange={(e)=>setBSecondLine(e.target.value)}/>
                <label htmlFor="bCity">City</label>
                <input id="bCity" value={bCity} onChange={(e)=>setBCity(e.target.value)}/>
                <label htmlFor="bPostcode">Postcode</label>
                <input id="bPostcode" value={bPostcode} onChange={(e)=>setBPostcode(e.target.value)}/>
                <button type="submit" onClick={(e)=>placeOrder(e)}>Submit</button>
            </form>
        </div>



    )
}