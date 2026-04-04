"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogoIcon } from "@/components/icons"
import { Button, Typography, Input } from "@/components/ui"
import { useAdminLogin } from "@/mutation"
import { setCookie, setStoredUser } from "@/utils"
import { toast } from "sonner"

const Login = () => {
  const router = useRouter()
  const { mutate, isPending } = useAdminLogin()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    const payload = {
      email,
      password,
    };

    mutate(payload, {
      onSuccess: async (response) => {
        toast.success("Login successful!");
        setCookie(response.data.token);
        setStoredUser(response.data.admin);
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
        id="email"
        type="text"
        value={email}
        onChange={e => setEmail(e.target.value)}
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
        disabled={!email}
      >
        Log in
      </Button>
    </>
  )
}

export default Login