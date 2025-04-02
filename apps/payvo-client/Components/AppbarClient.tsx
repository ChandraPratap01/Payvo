"use client"
import {signIn,signOut,useSession} from "next-auth/react"
import { Appbar } from "@repo/ui/Appbar"
import { useRouter } from "next/navigation"

const AppbarClient = () => {
    const router=useRouter();
    const session=useSession();
  return (
    <div>
        <Appbar onSignin={signIn} onSignout={async ()=>{
            await signOut()
            router.push("api/auth/sigin")
        }} user={session.status=="authenticated"?"authenticated":"unauthenticated"}/>
    </div>
  )
}

export default AppbarClient