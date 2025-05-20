import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Lock, LogIn } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"

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
import { loginFormSchema, type LoginFormData } from "@/schemas/Auth"

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })


  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      // Replace with your actual API endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Login failed")
      }
      return response.json()
    },
  })

  const onSubmit = (data: LoginFormData) => {
    navigate({ to: "/app/dashboard" })
    // loginMutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white text-black shadow-lg">
        <CardHeader className="space-y-1 flex flex-col items-center justify-center">
          <img src="https://i.ibb.co/wS8fFBn/logo-color.png" alt="RitualPlanner" className="w-22 h-16" />
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center text-gray-900">
            Enter your username/email and password to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <User className="absolute left-3 top-2 h-5 w-5 text-black" />
                      <FormControl>
                        <Input
                          placeholder="Username or Email"
                          autoFocus
                          className="pl-10 placeholder:text-black"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <span className='flex justify-between flex-col gap-2'><FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2 h-5 w-5 text-black" />
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          className="pl-10 placeholder:text-black"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
                />
                <Link to="/auth/forgot-password" className='text-sm text-blue-500 hover:text-blue-600 font-semibold text-right cursor-pointer'>Forgot Password?</Link></span>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  "Logging in..."
                ) : (
                  <>
                    Sign In
                    <LogIn className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {loginMutation.isError && (
                <p className="text-sm text-red-600 text-center mt-2">
                  Invalid credentials. Please try again.
                </p>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-black">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="font-semibold text-blue-500 hover:text-blue/80"
            >
              Sign up
            </Link>
          </div>
          <Link
            to="/auth/forgot-password"
            className="text-sm text-center text-primary hover:text-primary/80"
          >
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
