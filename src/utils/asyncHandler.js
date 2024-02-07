import {z} from "zod"
const asyncHandler = (fun) => {
    return async (req, res, next) => {
      try {
        await fun(req, res, next);
      } catch (error) {
        // Ensure error object has a valid HTTP status code
        let code = typeof error.statusCode === 'number' && error.statusCode >= 400 && error.statusCode < 600
          ? error.statusCode
          : 500;
          let message=""
        if(error instanceof z.ZodError)
         {
               code=400;
                message=error.issues;
         }
        res.status(code).json({
          success: false,
          message: message||error.message,
        });
      }
    };
  };
  
  export default asyncHandler;

