import { getServerSession } from "next-auth";


import { authOptions } from "../../lib/auth";
import db from "@payvo/db/client";
import AddMoneyCard from "../../../Components/AddMoneyCard";
import BalanceCard from "../../../Components/BalanceCard";
import OnRampTransaction from "../../../Components/OnRampTransaction";


async function getBalance() {
  const session= await getServerSession(authOptions)
  const Balance=await db.balance.findFirst({
       where:{
        userId:Number(session?.user?.id)
       }
  })
  if(!Balance){
    const Balance=await db.balance.create({
      data:{
        userId:Number(session?.user?.id),
        amount:0,
        locked:0
      }
 })
  }
  return {
    amount:Balance?.amount || 0,
    locked:Balance?.locked||0
  }
}
async function getOnRampTransaction(){
  const session= await getServerSession(authOptions)
  const trxns=await db.onRampTransaction.findMany({
    where:{
      userId:Number(session?.user?.id)
    }
  })
  return trxns.map(t=>({
    time:t.startTime,
    amount:t.amount,
    status:t.status,
    provider:t.provider
  }))
}


const Transfer = async () => {
  const balance=await getBalance();
  const transaction=await getOnRampTransaction();
  
  return (
    <div className="w-full">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transfer
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <AddMoneyCard/>
        </div>
        <div>
          <BalanceCard amount={balance.amount} locked={balance.locked}/>
          <div className="pt-4">
            <OnRampTransaction transaction={transaction}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transfer