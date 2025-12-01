"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LogoIcon } from "@/components/icons"
import { Button, Typography, Input, Select } from "@/components/ui"
import { useCompleteUserProfile } from "@/mutation"
import { SelectOptions } from "@/types"
import { toast } from "sonner"

const Signup = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phoneParam = searchParams?.get("phone") ?? ""

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState("")

  const { mutate, isPending } = useCompleteUserProfile()

  const genderOptions: SelectOptions[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]

  const handleContinue = () => {
    if (!phoneParam) {
      toast.error("Missing phone number.")
      return
    }
    if (!name.trim()) {
      toast.error("Please enter your full name.")
      return
    }
    if (!email.trim()) {
      toast.error("Please enter your email.")
      return
    }

    const payload = {
      phoneNumber: phoneParam,
      fullName: name.trim(),
      gender,
      email: email.trim().toLowerCase(),
    }

    mutate(payload, {
      onSuccess: () => {
        toast.success("Profile completed.")
        router.push("/onboarding")
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to complete profile.")
      },
    })
  }

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

      <Button
        variant="primary"
        className="w-full uppercase mt-4"
        size="large"
        onClick={handleContinue}
        isLoading={isPending}
        disabled={isPending}
      >
        continue
      </Button>
    </>
  )
}

export default Signup