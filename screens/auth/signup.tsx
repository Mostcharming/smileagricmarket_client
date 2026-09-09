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
  const [contact, setContact] = useState("")
  const { mutate, isPending } = useRequestOtp()

  const handleContinue = () => {
    const normalizedInput = contact.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+?\d{7,15}$/

    const isEmail = emailRegex.test(normalizedInput)
    const isPhone = phoneRegex.test(normalizedInput.replace(/[\s\-\(\)]/g, ""))

    if (!isEmail && !isPhone) {
      toast.error("Please enter a valid email address or phone number.")
      return
    }

    const payload = isEmail
      ? { email: normalizedInput }
      : { phoneNumber: normalizedInput }

    mutate(payload, {
      onSuccess: () => {
        toast.success(`Signup successful! OTP has been sent to your ${isEmail ? "email address" : "phone number"}.`)
        sessionStorage.setItem("otp_contact", normalizedInput)
        sessionStorage.setItem("otp_contact_type", isEmail ? "email" : "phone")
        sessionStorage.setItem("otp_phone", isEmail ? "" : normalizedInput)
        sessionStorage.setItem("otp_email", isEmail ? normalizedInput : "")
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
        label="Enter your email address or phone number"
        id="contact"
        type="text"
        value={contact}
        onChange={e => setContact(e.target.value)}
        bottomText="Only Nigerian phone numbers are supported. Use email if you don't have a Nigerian phone number."
      />
      <div className="w-full text-left text-xs md:text-sm mt-2">You will receive an OTP code via SMS/Email</div>

      <Button
        variant="primary"
        className="w-full uppercase mt-4 mb-3"
        size="large"
        onClick={handleContinue}
        isLoading={isPending}
        disabled={!contact.trim()}
      >
        Submit
      </Button>

      <Typography variant="normal" className="text-center">
        Already have an account? <Link href="/login" className="text-primary font-medium">Log in</Link>
      </Typography>
    </>
  )
}

export default Signup