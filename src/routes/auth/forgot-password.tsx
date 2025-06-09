import { createFileRoute, Link } from '@tanstack/react-router'
import { Send, Flame, KeyRound } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { forgotPasswordAction, verifyOTPAction } from '@/lib/actions'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const navigate = useNavigate()
  localStorage.clear()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)

  const forgotPasswordMutation = useMutation({
    mutationFn: () => forgotPasswordAction(email),
    onSuccess: async (data) => {
      if (data) {
        toast.success("OTP has been sent successfully", {
          style: {
            background: "linear-gradient(90deg, #38A169, #2F855A)",
            color: "white",
            fontWeight: "bolder",
            fontSize: "13px",
            letterSpacing: "1px",
          }
        })
        setShowOtpInput(true)
      }
    },
    onError: () => {
      toast.error("Error while sending OTP", {
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
  })

  const handleSendOTP = () => {
    if (!email) {
      toast.error("Please enter your email address")
      return
    }
    setShowConfirmDialog(true)
  }

  const confirmSendOTP = () => {
    setShowConfirmDialog(false)
    forgotPasswordMutation.mutate()
  }

  const cancelSendOTP = () => {
    setShowConfirmDialog(false)
    setEmail("")
  }

  const handleVerifyOTP = () => {
    if (!otp) {
      toast.error("Please enter the OTP")
      return
    }
    verifyOTPMutation.mutate()
  }

  const verifyOTPMutation = useMutation({
    mutationFn: () => verifyOTPAction(otp, email),
    onSuccess: async (data) => {
      if (data) {
        toast.success("OTP verified successfully", {
          description: 'You can now enter new password.',
          style: {
            background: "linear-gradient(90deg, #38A169, #2F855A)",
            color: "white",
            fontWeight: "bolder",
            fontSize: "13px",
            letterSpacing: "1px",
          }
        })
        localStorage.setItem("email", email)
        navigate({ to: "/auth/reset-password" })
      } else {
        toast.error("OTP has been not verified", {
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
      toast.error("Error while verifying OTP", {
        description: "Please try again.",
        style: {
          background: "linear-gradient(90deg, #E53E3E, #C53030)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white shadow-lg text-black">
        <CardHeader className="space-y-1 flex flex-col items-center justify-center">
          <Flame className='w-14 h-14 text-black border-1 p-1 rounded-full' />
          <CardTitle className="text-2xl font-bold text-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center text-gray-800">
            You forgot your account password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full placeholder:text-black"
                disabled={showOtpInput}
              />
            </div>
            {showOtpInput && (
              <div className="space-y-2">
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2 h-5 w-5 text-black" />
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 placeholder:text-black"
                  />
                </div>
                <Button
                  onClick={handleVerifyOTP}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  Verify OTP
                </Button>
              </div>
            )}
            {!showOtpInput && (
              <div className="flex justify-between gap-2">
                <Link to="/auth/login" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-black text-black hover:bg-gray-100"
                    disabled={forgotPasswordMutation.isPending}
                  >
                    Back to Login
                  </Button>
                </Link>
                <Button
                  onClick={handleSendOTP}
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending ? (
                    "Sending OTP..."
                  ) : (
                    <>
                      Send OTP
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {forgotPasswordMutation.isSuccess && !showOtpInput && (
            <p className="text-sm text-green-600 text-center mt-4">
              OTP has been sent to your email address
            </p>
          )}

          {forgotPasswordMutation.isError && (
            <p className="text-sm text-red-600 text-center mt-4">
              Failed to send OTP. Please try again.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-black">
            {showOtpInput
              ? "Enter the OTP sent to your email address"
              : "Send OTP to your email address which you used to create account."
            }
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="w-full bg-white text-black">
          <DialogHeader>
            <DialogTitle>Confirm Send OTP</DialogTitle>
            <DialogDescription className='text-black text-md'>
              Are you sure you want to send OTP to {email}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={cancelSendOTP}
              className="flex-1 text-black"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSendOTP}
              className="flex-1 bg-black text-white hover:bg-gray-800"
            >
              Yes, Send OTP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
