"use client"

import { useState } from "react"
import { Button, Typography, Input } from "@/components/ui"
import { LogoIcon } from "@/components/icons"

const Onboarding = () => {
  const [phone, setPhone] = useState("")

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
        className="w-full uppercase mt-4"
        size="large"
        type="submit"
        disabled={!phone}
      >
        Submit phone number
      </Button>
    </>
  )
}

export default Onboarding