import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff, Flame, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { resetPasswordAction } from '@/lib/actions'

export const Route = createFileRoute('/auth/reset-password')({
  component: RouteComponent,

})

function RouteComponent() {
  const email = localStorage.getItem("email")

  const navigate = useNavigate()

  const resetPasswordMutation = useMutation({
    mutationFn: () => resetPasswordAction(email, newPassword, confirmPassword),
    onSuccess: async (data) => {
      if (data) {
        toast.success("Password updated successfully", {
          description: "You can now login using that password.",
          style: {
            background: "linear-gradient(90deg, #38A169, #2F855A)",
            color: "white",
            fontWeight: "bolder",
            fontSize: "13px",
            letterSpacing: "1px",
          }
        })
        localStorage.clear()
        navigate({ to: "/auth/login" })
      } else {
        toast.error("Password not updated successfully", {
          description: "Please try again.",
          style: {
            background: "linear-gradient(90deg, #E53E3E, #C53030)",
            color: "white",
            fontWeight: "bolder",
            fontSize: "13px",
            letterSpacing: "1px",
          }
        })
        navigate({ to: "/auth/forgot-password" })
      }
    },
    onError: () => {
      toast.error("Error while updating password")
      navigate({ to: "/auth/forgot-password" })
    }
  })
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const isLongEnough = password.length >= 8

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough
  }

  const isFormValid = () => {
    return (
      newPassword &&
      confirmPassword &&
      newPassword === confirmPassword &&
      validatePassword(newPassword)
    )
  }

  const handleUpdatePassword = () => {
    if (!isFormValid()) {
      toast.error("Please check your password requirements", {
        description: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.",
        style: {
          background: "linear-gradient(90deg, #E53E3E, #C53030)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })
      return
    }

    resetPasswordMutation.mutate()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white shadow-lg text-black">
        <CardHeader className="space-y-1 flex flex-col items-center justify-center">
          <Flame className='w-14 h-14 text-black border-1 p-1 rounded-full' />
          <CardTitle className="text-2xl font-bold text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center text-gray-800">
            Enter your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <KeyRound className="absolute left-3 top-2 h-5 w-5 text-black" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 placeholder:text-black"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <KeyRound className="absolute left-3 top-2 h-5 w-5 text-black" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 placeholder:text-black"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button
              onClick={handleUpdatePassword}
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={!isFormValid()}
            >
              Update Password
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-black">
            Password must be at least 8 characters long and contain:
            <ul className="list-disc list-inside mt-2 text-left">
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character</li>
            </ul>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
