import { Card } from "@repo/ui/card"

const OnRampTransaction = ({transaction}:{transaction:{
    time:Date,
    amount:number,
    status:"Success"|"Failure"|"Processing",
    provider:string
}[]}) => {
    
    if(!transaction.length){
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent Transactions
            </div>
        </Card>
    }
  return (
    <Card title="Recent Transctions">
        <div className="pt-2">
      {transaction.map(t=><div className="flex justify-between">
        <div>
            <div className="text-sm">
                Received INR
            </div>
            <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
            </div>
        </div>
        <div className="flex flex-col justify-center">
            +Rs{t.amount/100}
        </div>
        </div>)}
        </div>
    </Card>
  )
}

export default OnRampTransaction