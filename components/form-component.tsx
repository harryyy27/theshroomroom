import styles from '../styles/Components/Form.module.css'
import {useState} from 'react';
export default function FormComponent(props:any){
    const [customVal,setCustomVal]=useState<string | null>(null)
    return(
        <div className={styles["form-element-wrapper"]}>
                    <label className={styles["form-label"]} htmlFor={props.variableName+(props.page?props.page:'')}>{props.labelName}</label>
                    <input className={styles["form-element"]} autoComplete={props.autoComplete} type={props.inputType} required={props.required} id={props.variableName+(props.page?props.page:'')} value={props.variable||'' } disabled={props.disabled}
                        onBlur={async(e)=>{
                            if(props.required){
                                if(props.callback){
                                    if(await props.callback(e.target.value,props.params,setCustomVal)){
                                        if(e.target.checkValidity()){
                                            props.setVariableVal(true)
                                        }
                                        else {
                                            props.setVariableVal(false)
                                        }

                                    }
                                    else {
                                        props.setVariableVal(false)
                                    }
                                }
                                else {
                                    if(e.target.checkValidity()){
                                        props.setVariableVal(true)
                                    }
                                    else {
                                        props.setVariableVal(false)
                                    }
                                }
                                
                            }
                            

                        }}
                        onChange={async(e)=>{
                            props.setVariable(e.target.value)
                            if(e.target!==document.activeElement){
                                e.target.focus()
                            }
                            if(props.required&&typeof props.variableVal==="boolean"){
                                if(props.callback){
                                    if(await props.callback(e.target.value,props.params,setCustomVal)){
                                        if(e.target.checkValidity()){
                                            props.setVariableVal(true)
                                        }
                                        else {
                                            props.setVariableVal(false)
                                        }
                                    }
                                    else {
                                        props.setVariableVal(false)
                                    }
                                }
                                    else{
                                        if(e.target.checkValidity()){
                                            props.setVariableVal(true)
                                        }
                                        else {
                                            props.setVariableVal(false)
                                        }
                                    }

                            }
                        }
                        }/>
                    
                {
                    props.variableVal===false?
                    <p className={"error-text"}>{customVal!==null? customVal :`Please enter valid ${props.labelName.toLowerCase()}`+`${props.alternative?' or '+props.alternative:''}`}</p>
                    :
                    null

                }
                </div>
    )
}