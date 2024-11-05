const logic:{[key:string]:{
    newTotal:Function,
    description:string}} = {
    "D_TESTTESTTEST": {
        newTotal:function(total:number){
        return Number(total)*(1-0.25)
        },
        description:"25% off"
    },
    '': {
        newTotal:function(total:number){
        return total
    },
    
    description:"NILSCH"},

    "D_TEST": {
        newTotal:function(total:number,params:any){
        return Number(total)*(1-0.25)
        },
        description:"25% off your first order!"
    },

    "DC_TrustMega25": {
        newTotal:function(total:number,params:any){
        return Number(total)*(1-0.25)
        },
        description:"25% off your first order!"
    },
    "DC_BR3_25OFF":{
        newTotal:function(total:number,params:any){
            console.log(params.dPostcode.slice(0,3).toLowerCase())
            if(params.dPostcode.trim().slice(0,3).toLowerCase()==="br3"){
                return Number(total)*(1-0.25)
            }
        },
            description:"25% off for all Beckenham based orders"
        }
    }

export default logic