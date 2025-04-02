import { Button } from "./button";

interface AppbarProps {
    user:string,
    onSignin: ()=>void,
    onSignout: ()=>void
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return <div className="flex justify-between border-b px-4">
        <div className="text-lg flex flex-col justify-center">
            PayVo
        </div>
        <div className="flex flex-col justify-center pt-2">
            <Button onClick={user=="authenticated" ? onSignout : onSignin}>{user=="authenticated" ? "Logout" : "Login"}</Button>
        </div>
    </div>
}