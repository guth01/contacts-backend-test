const {constants}=require("../constants");
const errorHandler=(err,req,res,next)=>{
    const statusCode=res.statusCode?res.statusCode:500;
    switch(statusCode){
        case constants.NOT_FOUND:
            res.json({title:"not found",message:err.message,stackTrace:err.stack});
            break;

        case constants.VALIDATION_ERROR:
        res.json({title:"validation",message:err.message,stackTrace:err.stack});
        default:
            console.log("no  error");
            break
            
    }
    
    
    
}
module.exports=errorHandler;