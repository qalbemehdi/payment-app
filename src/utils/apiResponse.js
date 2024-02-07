class ApiResponse{
    constructor(statusCode,message="success",data){
        this.statusCode=statusCode;
        this.message=message;
        this.data=data;
    }
    static send(res,statusCode=200,data=null,message="success"){
        const responseObject=new ApiResponse(statusCode,message,data)
         res.status(responseObject.statusCode).json(responseObject)
    }
}
export default ApiResponse;