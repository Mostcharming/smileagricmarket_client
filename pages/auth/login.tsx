"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogoIcon } from "@/components/icons"
import { Button, Typography, Input } from "@/components/ui"
import { useRequestOtp } from "@/mutation"
import { toast } from "sonner"

const Login = () => {
  const router = useRouter()
  const { mutate, isPending } = useRequestOtp()

  const [phone, setPhone] = useState("")

  const handleLogin = () => {
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    const payload = {
      phoneNumber: phone,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Login successful! OTP has been sent to your phone number.");
        router.push(`/verify-otp?phone=${phone}`);
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to login, please try again.");
      },
    });
  }

  return (
    <>
      <LogoIcon />

      <Typography variant="intro" className="mt-10 mb-4">Welcome to SmileAgrimarket</Typography>

      <Input
        label="Enter your phone number"
        id="phone"
        type="text"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        bottomText="You will receive an OTP code as SMS / Whatsapp"
      />

      <Button
        variant="primary"
        className="w-full uppercase mt-4"
        size="large"
        onClick={handleLogin}
        isLoading={isPending}
        disabled={!phone}
      >
        Submit phone number
      </Button>
    </>
  )
}

export default Login