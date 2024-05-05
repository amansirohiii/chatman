"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "./ui/use-toast";

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton = () => {
  const { toast } = useToast();

  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });
  const addFriend = async (email: string) => {

    try {
      const validatedEmail = addFriendValidator.parse({ email });
      const res = await axios.post("/api/friends/add", {
        data: {email: validatedEmail,}
      });
      setSuccessMessage(res.data.message);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError("email", {
          message: err.message,
        });
        return;
      }
      if (err instanceof AxiosError) {
        setError("email", { message: err.response?.data });
      }
      setError("email", { message: err.response.data.message });
      toast({
        variant: "destructive",
        title: err.response.data.message,
      });
    }
  };
  const handleChange = () => {
    setShowSuccessState(false);
    setSuccessMessage("");
  };
  function onSubmit(data: FormData) {
    addFriend(data.email);
    setShowSuccessState(true);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leadin-6 text-gray-900"
      >
        Add Friend by Email
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="aman@gmail.com"
          onChange={handleChange}
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-600">{successMessage}</p>
      ) : null}
    </form>
  );
};

export default AddFriendButton;
