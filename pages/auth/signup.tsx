"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogoIcon } from "@/components/icons"
import { Button, Typography, Input } from "@/components/ui"
import { useRequestOtp } from "@/mutation"
import { toast } from "sonner"

const Signup = () => {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const { mutate, isPending } = useRequestOtp()

  const handleContinue = () => {
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    const payload = {
      phoneNumber: phone,
    }

    mutate(payload, {
      onSuccess: () => {
        toast.success("Signup successful! OTP has been sent to your phone number.")
        sessionStorage.setItem("otp_phone", phone)
        router.push(`/verify-otp`)
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to signup, please try again.")
      },
    })
  }

  return (
    <>
      <LogoIcon />

      <Typography variant="intro" className="mt-10 mb-4">Welcome to SmileAgrimarket</Typography>

      <Input
        label="Enter your phone number"
        id="name"
        type="text"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        bottomText="You will receive an OTP code as SMS / Whatsapp"
      />

      <Button
        variant="primary"
        className="w-full uppercase mt-4 mb-3"
        size="large"
        onClick={handleContinue}
        isLoading={isPending}
        disabled={!phone}
      >
        Submit phone number
      </Button>

      <Typography variant="normal" className="text-center">
        Already have an account? <Link href="/login" className="text-primary font-medium">Log in</Link>
      </Typography>
    </>
  )
}

export default Signup