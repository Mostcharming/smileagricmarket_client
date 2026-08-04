"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LogoIcon } from "@/components/icons"
import { Button, Typography, Input } from "@/components/ui"
import { useResetPassword } from "@/mutation"
import { toast } from "sonner"

const ResetPassword = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenParam = searchParams?.get("token") ?? ""
  const { mutate, isPending } = useResetPassword()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleLogin = () => {
    const payload = {
      resetToken: tokenParam,
      password,
      passwordConfirmation: confirmPassword,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Password has been successfully changed!");
        router.push('/login');
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to change password, please try again.");
      },
    });
  }

  return (
    <>
      <LogoIcon />

      <Typography variant="intro" className="w-full mt-10 mb-4">Reset Password</Typography>

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
        onClick={handleLogin}
        isLoading={isPending}
        disabled={!password || password !== confirmPassword}
      >
        Reset password
      </Button>
    </>
  )
}

export default ResetPassword