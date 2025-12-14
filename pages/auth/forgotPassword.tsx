"use client"

import Link from "next/link"
import { useState } from "react"
import { LogoIcon } from "@/components/icons"
import { Button, Typography, Input } from "@/components/ui"
import { useRequestOtp } from "@/mutation"
import { toast } from "sonner"

const ForgotPassword = () => {
  const { mutate, isPending } = useRequestOtp()
  const [phone, setPhone] = useState("")

  const handleLogin = () => {
    const phoneRegex = /^\d{10,15}$/;
    const isPhoneNumber = phoneRegex.test(phone);

    const payload = isPhoneNumber
      ? { phoneNumber: phone }
      : { email: phone };

    mutate(payload, {
      onSuccess: () => {
        toast.success("A reset link will be sent to you shortly.");
      },
      onError: (error) => {
        toast.error(error?.message || "Invalid phone number or email, please try again.");
      },
    });
  }

  return (
    <>
      <LogoIcon />

      <Typography variant="intro" className="w-full mt-10 mb-4">Forgot Password</Typography>

      <Input
        label="Enter your email address or phone number"
        id="phone"
        type="text"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />

      <Button
        variant="primary"
        className="w-full uppercase mt-4 mb-3"
        size="large"
        onClick={handleLogin}
        isLoading={isPending}
        disabled={!phone}
      >
        Submit
      </Button>

      <Link href="/login" className="text-primary text-xs md:text-sm font-medium">Go back to Login</Link>
    </>
  )
}

export default ForgotPassword