

"use server"

import db from "@payvo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

const p2pTransfer = async(to:string,amount:number) => {

    const session= await getServerSession(authOptions)
     const from=session?.user?.id;
     if(!from){
        return{
            message:"Error While Sending"
        }
     }
     const toUser=await db.user.findFirst({
        where:{
            number:to
        }
     })
     if(!toUser){
        return {
            message:"User Not Found"
        }
     }
     await db.$transaction(async(tx)=>{
       await tx.$queryRaw`Select * From "Balance" where "userId"=${Number(from)} FOR UPDATE`
       
        const fromBalance=await tx.balance.findUnique({
            where:{
                userId:Number(from)
            }
        })
        
        if(!fromBalance || fromBalance.amount<amount){
            throw new Error("Insufficient Funds")
        }
        // console.log("before transaction")
        // await new Promise((resolve)=>setTimeout(resolve,4000))
        await tx.balance.update({
            where:{
                userId:Number(from)
            },
            data:{
                amount:{
                    decrement:amount
                }
            }
        }),
        // console.log("After transaction");
        await tx.balance.update({
            where:{
                userId:toUser.id
            },
            data:{
                amount:{
                    increment:amount
                }
            }
        })
     })
 
}

export default p2pTransfer