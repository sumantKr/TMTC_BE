import { RequestHandler } from "express";


function catchAsync(fn:Function):RequestHandler{
    return (req,res,next,...args)=>{
        const fnReturn= fn(req,res,next,...args);
        return Promise.resolve(fnReturn).catch((err)=>{
            console.debug('🚀 ~ return ~ err:', err)
            console.dir(err,{depth:null})
            next(err);
        })
    }
}
export default catchAsync;
  