"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from "@/components/icons"
import { Button, Typography, Input, Select } from "@/components/ui"
import { useCompleteUserProfile, useSetPassword } from "@/mutation"
import { setCookie } from "@/utils"
import { SelectOptions } from "@/types"
import { toast } from "sonner"

const Onboarding = () => {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState("")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const { mutate, isPending } = useCompleteUserProfile()
  const { mutate: mutateComplete, isPending: isPendingComplete } = useSetPassword()

  const genderOptions: SelectOptions[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]

  const handleContinue = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const payload = {
      fullName: name,
      gender,
      email,
    };

    mutate(payload, {
      onSuccess: () => {
        if (step === 1) setStep(2)
      },
      onError: (error) => {
        toast.error(error?.message || "An Error occured, please try again.");
      },
    });
  }

  const handleComplete = () => {
    const payload = {
      fullName: name,
      gender,
      email,
      password,
      passwordConfirmation: confirmPassword,
    };

    mutateComplete(payload, {
      onSuccess: async (response) => {
        setCookie(response.data.token);
        router.push("/dashboard");
      },
      onError: (error) => {
        toast.error(error?.message || "An Error occured, please try again.");
      },
    });
  }

  const handleBack = () => {
    if (step === 2) setStep(1)
    // otherwise navigate back in app if needed
  }

  return (
    <>
      <div className="w-full flex items-center gap-2 mb-7">
        <div onClick={handleBack} className="w-fit cursor-pointer">
          <ArrowLeftIcon size={20} />
        </div>
        <div className="flex-1">
          <div className="h-1 bg-primary/30 rounded-full overflow-hidden">
            <div
              className={`h-full bg-primary rounded-full transition-all`}
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>
      </div>

      <Typography variant="intro" className="w-full mb-4">Sign up on Smile Agrimarket</Typography>

      {step === 1 ? (
        <>
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
            className="w-full uppercase mt-4 mb-3"
            size="large"
            onClick={handleContinue}
            isLoading={isPending}
            disabled={!name || !email || !gender}
          >
            Continue
          </Button>      
        </>
      ) : (
        <>
          <Input
            label="Enter your password"
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            containerClassName="mb-4"
          />

          <Input
            label="Enter your password again"
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />

          <Button
            variant="primary"
            className="w-full uppercase mt-4 mb-3"
            size="large"
            disabled={!password || password !== confirmPassword}
            isLoading={isPendingComplete}
            onClick={handleComplete}
          >
            Complete signup
          </Button>
        </>
      )}

      <Typography variant="normal" className="text-center">
        Already have an account? <Link href="/login" className="text-primary font-medium">Log in</Link>
      </Typography>
    </>
  )
}

export default Onboarding