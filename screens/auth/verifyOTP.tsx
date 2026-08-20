"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogoIcon } from "@/components/icons"
import { Button, Typography, Input } from "@/components/ui"
import { useVerifyOtp, useRequestOtp } from "@/mutation"
import { setCookie } from "@/utils"
import { toast } from "sonner"

const VerifyOTP = () => {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [contactParam] = useState(() => {
    if (typeof window === "undefined") return ""
    return (
      sessionStorage.getItem("otp_contact") ||
      sessionStorage.getItem("otp_phone") ||
      sessionStorage.getItem("otp_email") ||
      ""
    )
  })

  const [contactType] = useState(() => {
    if (typeof window === "undefined") return "phone"
    const storedType = sessionStorage.getItem("otp_contact_type")
    if (storedType) return storedType
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactParam) ? "email" : "phone"
  })

  const { mutate: verifyMutate, isPending } = useVerifyOtp()
  const { mutate: resendMutate, isPending: isResending } = useRequestOtp()

  useEffect(() => {
    if (!contactParam) {
      toast.error("Contact information not found. Please sign up again.")
      router.push("/signup")
    }
  }, [contactParam, router])

  const maskContact = (val: string, type: string) => {
    const s = val.trim()
    if (!s) return ""
    if (type === "email") {
      const parts = s.split("@")
      if (parts.length !== 2) return s
      const [user, domain] = parts
      if (user.length <= 2) return `${user[0]}*@${domain}`
      return `${user[0]}${"*".repeat(Math.max(1, user.length - 2))}${user[user.length - 1]}@${domain}`
    } else {
      if (s.length <= 4) return s
      const first = s.slice(0, 2)
      const last = s.slice(-2)
      const stars = "*".repeat(Math.max(0, s.length - 4))
      return `${first}${stars}${last}`
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(cleaned)
  }

  const maskedContact = useMemo(() => (contactParam ? maskContact(contactParam, contactType) : ""), [contactParam, contactType])

  const isEmailType = contactType === "email"

  const handleVerify = () => {
    if (!contactParam) {
      toast.error("Missing contact information.")
      return
    }
    if (!otp) {
      toast.error("Please enter the OTP.")
      return
    }
    if (otp.length !== 6) {
      toast.error("OTP must be exactly 6 digits.")
      return
    }

    const payload = isEmailType
      ? { email: contactParam, otp }
      : { phoneNumber: contactParam, otp }

    verifyMutate(payload, {
      onSuccess: (response) => {
        toast.success("OTP verified.")
        setCookie(response.data.token);
        router.push("/onboarding")
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to verify OTP.")
      },
    })
  }

  const handleResend = () => {
    if (!contactParam) {
      toast.error("Missing contact information.")
      return
    }
    const payload = isEmailType
      ? { email: contactParam }
      : { phoneNumber: contactParam }

    resendMutate(
      payload,
      {
        onSuccess: () => {
          toast.success("OTP resent.")
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to resend OTP.")
        },
      }
    )
  }

  return (
    <>
        <LogoIcon />

        <Typography variant="intro" className="w-full mt-10">Verify OTP</Typography>
        <Typography className="w-full mb-4">
          We sent an OTP code to your {isEmailType ? "email address" : "number"} {maskedContact || ""}.
        </Typography>

        <div className="w-full flex flex-col gap-2">
            <Input
                label="Enter OTP code here"
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={otp}
                onChange={handleOtpChange}
            />
            <Typography
              variant="normal"
              className="text-primary font-medium cursor-pointer select-none"
              role="button"
              onClick={handleResend}
              aria-disabled={isResending}
            >
              {isResending ? "Resending..." : "I didn't get the code"}
            </Typography>
        </div>

        <Button
            variant="primary"
            className="w-full uppercase mt-4"
            size="large"
            onClick={handleVerify}
            isLoading={isPending}
            disabled={otp.length !== 6}
        >
            verify
        </Button>
    </>
  )
}

export default VerifyOTP