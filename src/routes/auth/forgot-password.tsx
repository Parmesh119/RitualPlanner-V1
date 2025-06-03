import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Send, Flame } from "lucide-react"
import { useMutation } from "@tanstack/react-query"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/schemas/Auth"

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      // Replace with your actual API endpoint
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Failed to send OTP")
      }
      return response.json()
    },
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white shadow-lg text-black">
        <CardHeader className="space-y-1 flex flex-col items-center justify-center">
          <Flame className='w-14 h-14 text-black border-1 p-1 rounded-full' />
          <CardTitle className="text-2xl font-bold text-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you an OTP to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2 h-5 w-5 text-black" />
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email Address"
                          className="pl-10 placeholder:text-black"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800"
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

              {forgotPasswordMutation.isSuccess && (
                <p className="text-sm text-green-600 text-center mt-2">
                  OTP has been sent to your email address
                </p>
              )}

              {forgotPasswordMutation.isError && (
                <p className="text-sm text-red-600 text-center mt-2">
                  Failed to send OTP. Please try again.
                </p>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-black">
            Remember your password?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
