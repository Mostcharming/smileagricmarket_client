"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogoIcon } from "@/components/icons"
import { Button, Typography, Input } from "@/components/ui"
import { useAdminLogin } from "@/mutation"
import { setCookie } from "@/utils"
import { toast } from "sonner"

const Login = () => {
  const router = useRouter()
  const { mutate, isPending } = useAdminLogin()

  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    const payload = {
      phoneNumber: phone,
      password,
    };

    mutate(payload, {
      onSuccess: async (response) => {
        toast.success("Login successful!");
        setCookie(response.data.token);
        router.push('/admin/dashboard');
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to login, please try again.");
      },
    });
  }

  return (
    <>
      <LogoIcon />

      <Typography variant="intro" className="mt-10 mb-4">Admin Login</Typography>

      <Input
        label="Enter your email address or username"
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

      <Button
        variant="primary"
        className="w-full uppercase mt-3"
        size="large"
        onClick={handleLogin}
        isLoading={isPending}
        disabled={!phone}
      >
        Log in
      </Button>
    </>
  )
}

export default Login