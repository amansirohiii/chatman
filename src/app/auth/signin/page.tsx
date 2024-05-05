"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {FaGithub} from 'react-icons/fa'
import { signIn } from "next-auth/react";

const Signin = () => {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);
  const [isLoadingGithub, setIsLoadingGithub] = useState<boolean>(false);
  async function loginWithGoogle() {
    setIsLoadingGoogle(true);
    try{
      await signIn('google')

    }catch(err){
      console.log(err)
    }finally{
      setIsLoadingGoogle(false)
    }

  }
  function loginWithGithub() {
    setIsLoadingGithub(true);
    // await signIn()
    setIsLoadingGithub(false);
  }
  return (
    <>
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8">
          <div className="flex flex-col items-center gap-8">
            logo
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your Account
            </h2>
          </div>
          <Button
            isLoading={isLoadingGoogle}
            type="button"
            className="max-w-sm mx-auto w-full"
            onClick={loginWithGoogle}
          >
            {isLoadingGoogle ? null : (
         <FcGoogle className="mr-2"/>
            )}
            Google
          </Button>

              <Button
              isLoading={isLoadingGithub}
              type="button"
              className="max-w-sm mx-auto w-full"
              onClick={loginWithGithub}
            >
              {isLoadingGithub ? null : (
               <FaGithub className="mr-2"/>
              )}
              Github
            </Button>
        </div>
      </div>
    </>
  );
};

export default Signin;
