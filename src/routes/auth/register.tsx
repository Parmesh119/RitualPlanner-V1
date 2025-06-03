import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Lock, Mail, Phone, Eye, EyeOff, UserPlus, Flame } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Helmet } from "react-helmet"
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
import { registerFormSchema, type RegisterFormData } from "@/schemas/Auth"

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Replace with your actual API endpoint
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Registration failed")
      }
      return response.json()
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data)
  }

  return (
    <>
      <Helmet>
        <title>Register - RitualPlanner</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md bg-white shadow-lg text-black">
          <CardHeader className="space-y-1 flex flex-col items-center justify-center">
            <Flame className='w-14 h-14 text-black border-1 p-1 rounded-full' />
            <CardTitle className="text-2xl font-bold text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center text-gray-900">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <User className="absolute left-3 top-2 h-5 w-5 text-black" />
                        <FormControl>
                          <Input
                            placeholder="Full Name"
                            className="pl-10 placeholder:text-black"
                            {...field}
                            autoFocus
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            placeholder="Email"
                            className="pl-10 placeholder:text-black"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2 h-5 w-5 text-black" />
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Phone Number"
                            className="pl-10 placeholder:text-black"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2 h-5 w-5 text-black" />
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="pl-10 pr-10 placeholder:text-black"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2 text-black hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2 h-5 w-5 text-black" />
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="pl-10 pr-10 placeholder:text-black"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2 text-black hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 cursor-pointer"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create Account
                      <UserPlus className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <span className='flex items-center justify-center gap-2'>
                  <hr className='w-40' />
                  <span className='text-black'>OR</span>
                  <hr className='w-40' />
                </span>
                <Button variant='outline' className='w-full cursor-pointer'>Sign Up With Google <img src="https://img.icons8.com/win10/512/google-logo.png" className='w-6 h-6 mt-0.5' alt='Google' /></Button>
                {registerMutation.isError && (
                  <p className="text-sm text-red-600 text-center mt-2">
                    Registration failed. Please try again.
                  </p>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-black">
              Already have an account?{" "}
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
    </>
  )
}
