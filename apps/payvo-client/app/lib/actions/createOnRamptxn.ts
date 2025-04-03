"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import db from "@payvo/db/client"

const createOnRamptxn = async (amount:number,provider:string) => {
    const session=await getServerSession(authOptions);
    const token=Math.random().toString();
    if( !session?.user|| !session?.user?.id){
        return {
            message:"User NOt authenticated"
        }
    }
    await db.onRampTransaction.create({
        data:{
           userId:Number(session?.user?.id),
           amount:amount*100,
           status:"Processing",
           provider,
           startTime:new Date(),
           token:token
        }
    })
  return ({
      message:"OnRampTransaction Added"
})
}

export default createOnRamptxn