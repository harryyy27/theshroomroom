import {useState} from 'react';
interface props {
    dropList:any[],
    selected:string,
    setSelected:any
}
export default function Dropdown({dropList,selected,setSelected}:props){
    return(
        <div className="dropdown-container">
            <p id="dropdown-selected" aria-haspopup="true" role="button" onClick={(e)=>{
                    var wrapper = document.querySelector('.dropdown-wrapper')
                    if(wrapper){
                        if(wrapper.className.includes('dropdown-open')){
                            wrapper.classList.remove('dropdown-open')
                        }
                        else {
                            wrapper.classList.add('dropdown-open')
                        }
                    }
                }}>{selected}</p>
            <ul className="dropdown-wrapper">
                {
                    dropList.map((el:string,idx)=>{
                        console.log(idx)
                        return (
                            <li key={idx}className="dropdown-elements"onClick={(e:any)=>{
                                console.log(e.target.textContent)
                                console.log(selected)

                                setSelected(e.target.textContent)
                                var wrapper = document.querySelector('.dropdown-wrapper')
                                var elements = document.querySelectorAll('.dropdown-elements')
                                for(var i=0;i<elements.length;i++){
                                    elements[i]["ariaSelected"]="false"
                                }
                                e.target["ariaSelected"]="true"
                                if(wrapper){
                                    wrapper.classList.remove('dropdown-open')
                                    wrapper["ariaHidden"]="true"
                                }
                                console.log(e.target.textContent)
                                console.log(selected)


                                
                            }
                            }>{el}</li>
                        )
                    })
                }
            </ul>
        </div>
    )
}