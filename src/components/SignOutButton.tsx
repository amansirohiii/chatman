"use client"
import React, {ButtonHTMLAttributes, FC, useState} from 'react'
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"
import { Loader2, LogOut } from "lucide-react"

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
const SignOutButton: FC<SignOutButtonProps> = ({...props}) => {
    const [isSigningOut, setIsSigningOut] = useState<boolean>(false)
  return (
    <Button {...props} variant="ghost" onClick={async()=>{
        setIsSigningOut(true)
        try{
            await signOut();
        }catch(err: any){
            toast({
                title:"Error",
                description:err.message,
            })
        }finally{
            setIsSigningOut(false)
        }
    }}>{isSigningOut ? (<Loader2 className="animate-spin size-4"/>):(<LogOut className="h-full aspect-square"/> ) }</Button>
  )
}

export default SignOutButton