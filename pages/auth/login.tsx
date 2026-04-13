/* eslint-disable react/no-unescaped-entities */
"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogoIcon } from "@/components/icons"
import { Button, Typography, Input } from "@/components/ui"
import { useLoginPassword } from "@/mutation"
import { setCookie, setStoredUser } from "@/utils"
import { toast } from "sonner"

const Login = () => {
  const router = useRouter()
  const { mutate, isPending } = useLoginPassword()

  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    const normalizedInput = phone.trim();
    const isEmailInput = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedInput);

    const payload = isEmailInput
      ? {
          email: normalizedInput,
          password,
        }
      : {
          phoneNumber: normalizedInput,
          password,
        };

    mutate(payload, {
      onSuccess: async (response) => {
        toast.success("Login successful!");
        setCookie(response.data.token);
        setStoredUser(response.data.user);
        router.push('/dashboard');
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to login, please try again.");
      },
    });
  }

  return (
    <>
      <LogoIcon />

      <Typography variant="intro" className="mt-10 mb-4">Welcome to SmileAgrimarket</Typography>

      <Input
        label="Enter your email address or phone number"
        id="phone"
        type="text"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />

      <Input
        label="Enter your password"
        id="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        containerClassName="mt-4 mb-2"
      />

      <div className="w-full">
        <Link href="/forgot-password">
          <Typography variant="normal" className="text-primary font-medium">Forgot Password</Typography>
        </Link>
      </div>

      <Button
        variant="primary"
        className="w-full uppercase mt-4 mb-3"
        size="large"
        onClick={handleLogin}
        isLoading={isPending}
        disabled={!phone}
      >
        Log in
      </Button>

      <Typography variant="normal" className="text-center">
        Don't have an account? <Link href="/signup" className="text-primary font-medium">Sign up</Link>
      </Typography>
    </>
  )
}

export default Login