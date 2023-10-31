import styles from '../styles/Components/Form.module.css'

export default function FormComponent(props:any){
    return(
        <div className={styles["form-element-wrapper"]}>
                    <label className={styles["form-label"]} htmlFor={props.variableName+props.page}>{props.labelName}</label>
                    <input className={styles["form-element"]} autoComplete="fuck-off" type={props.inputType} required={props.required} id={props.variableName+props.page} value={props.variable||''} 
                        onBlur={(e)=>{
                            if(props.required){
                                if(e.target.checkValidity()){
                                    props.setVariableVal(true)
                                }
                                else {
                                    props.setVariableVal(false)
                                }
                            }
                            

                        }}
                        onChange={(e)=>{
                            props.setVariable(e.target.value)
                            if(props.required&&typeof props.variableVal==="boolean"){
                                if(e.target.checkValidity()){
                                    props.setVariableVal(true)
                                }
                                else {
                                    props.setVariableVal(false)
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