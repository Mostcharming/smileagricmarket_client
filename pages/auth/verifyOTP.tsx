"use client"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { LogoIcon } from "@/components/icons"
import { Button, Typography, Input } from "@/components/ui"
import { useVerifyOtp, useRequestOtp } from "@/mutation"
import { setCookie } from "@/utils"
import { toast } from "sonner"

const VerifyOTP = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [otp, setOtp] = useState("")

  const { mutate: verifyMutate, isPending } = useVerifyOtp()
  const { mutate: resendMutate, isPending: isResending } = useRequestOtp()

  const maskPhone = (num: string) => {
    const s = num.trim()
    if (s.length <= 4) return s
    const first = s.slice(0, 2)
    const last = s.slice(-2)
    const stars = "*".repeat(Math.max(0, s.length - 4))
    return `${first}${stars}${last}`
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(cleaned)
  }

  const phoneParam = searchParams?.get("phone") ?? ""
  const maskedPhone = useMemo(() => (phoneParam ? maskPhone(phoneParam) : ""), [phoneParam])

  const handleVerify = () => {
    if (!phoneParam) {
      toast.error("Missing phone number.")
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

    const payload = {
      phoneNumber: phoneParam,
      otp,
    }

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
    if (!phoneParam) {
      toast.error("Missing phone number.")
      return
    }
    resendMutate(
      { phoneNumber: phoneParam },
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
          We sent an OTP code to your number {maskedPhone || ""}.
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