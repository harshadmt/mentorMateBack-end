const errorHandling = (err,req,res,next)=>{
    const StatusCode  = err.StatusCode||500;
    const message  = err.message ||"Internal Server Error";


    res.status(StatusCode).json({
        success:false,
        status:StatusCode,
        message:message
    })
}

module.exports = errorHandling