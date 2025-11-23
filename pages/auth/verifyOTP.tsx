/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState } from "react"
import { Button, Typography, Input } from "@/components/ui"
import { LogoIcon } from "@/components/icons"

const VerifyOTP = () => {
  const [phone, setPhone] = useState("")

  return (
    <>
        <LogoIcon />

        <div className="w-full flex flex-col">
            <Typography variant="intro" className="mt-10">Verify OTP</Typography>
            <Typography className="mb-4">We sent an OTP code to your number 08*******90.</Typography>
        </div>

        <div className="w-full flex flex-col gap-2">
            <Input
                label="Enter OTP code here"
                id="name"
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
            />
            <Typography variant="normal" className="text-primary font-medium">I didn't get the code</Typography>
        </div>

        <Button
            variant="primary"
            className="w-full uppercase mt-4"
            size="large"
            type="submit"
            disabled={!phone}
        >
            verify
        </Button>
    </>
  )
}

export default VerifyOTP