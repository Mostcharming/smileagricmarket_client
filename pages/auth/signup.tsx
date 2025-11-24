"use client"

import Link from "next/link"
import { useState } from "react"
import { LogoIcon } from "@/components/icons"
import { Button, Typography, Input, Select } from "@/components/ui"
import { SelectOptions } from "@/types"

const Signup = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const [gender, setGender] = useState("")
  const genderOptions: SelectOptions[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]

  return (
    <>
      <LogoIcon />

      <Typography variant="intro" className="mt-10 mb-4">Sign up on Smile Agrimarket</Typography>

      <Input
        label="Enter your Fullname"
        id="name"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        className="mb-4"
      />

      <Select
        options={genderOptions}
        value={genderOptions.find(opt => opt.value === gender) ? gender : ''}
        onChange={e => setGender(e.target.value as string)}
        placeholder="Select your Gender"
        label="Select your Gender"
        className="w-full mb-4"
      />

      <Input
        label="Enter your email address"
        id="email"
        type="text"
        value={email}
        onChange={e => setEmail(e.target.value)}
        bottomText="Please confirm that your email address is valid"
      />

      <Link href="/onboarding" className="w-full">
        <Button
          variant="primary"
          className="w-full uppercase mt-4"
          size="large"
          type="submit"
          disabled={!email}
        >
          continue
        </Button>
      </Link>
    </>
  )
}

export default Signup