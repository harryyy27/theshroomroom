import styles from '../styles/Components/Form.module.css'

export default function FormComponent(props:any){
    return(
        <div className={styles["form-element-wrapper"]}>
                    <label className={styles["form-label"]} htmlFor={props.variableName+(props.page?props.page:'')}>{props.labelName}</label>
                    <input className={styles["form-element"]} autoComplete="autocomplete" type={props.inputType} required={props.required} id={props.variableName+(props.page?props.page:'')} value={props.variable||''} 
                        onBlur={(e)=>{
                            if(props.required){
                                if(props.callback){
                                    if(props.callback(e.target.value,props.params)){
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
                        onChange={(e)=>{
                            props.setVariable(e.target.value)
                            if(props.required&&typeof props.variableVal==="boolean"){

                                if(props.callback){
                                    if(props.callback(e.target.value,props.params)){
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
                    <p className={"error-text"}>{`Please enter valid ${props.labelName.toLowerCase()}`+`${props.alternative?' or '+props.alternative:''}`}</p>
                    :
                    null

                }
                </div>
    )
}