import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Lock, Mail, Phone, Eye, EyeOff, UserPlus, Flame, Copy, X } from "lucide-react"
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
import { registerFormSchema, type TRegister } from "@/schemas/Auth"
import { registerAction } from '@/lib/actions'
import { toast } from 'sonner'
import { type TRegisterResponse } from '@/schemas/Auth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [credentials, setCredentials] = useState<TRegisterResponse | null>(null)
  const form = useForm<TRegister>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!', {
      style: {
        background: "linear-gradient(90deg, #38A169, #2F855A)",
        color: "white",
        fontWeight: "bolder",
        fontSize: "13px",
        letterSpacing: "1px",
      }
    })
  }

  const registerMutation = useMutation({
    mutationFn: registerAction,
    onSuccess: async (data) => {
      if (data) {
        setCredentials(data)
        setShowCredentials(true)
      }
    },
    onError: () => {
      toast.error('Registration failed', {
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

  const handleCloseDialog = () => {
    setShowCredentials(false)
    navigate({ to: '/auth/login' })
  }

  const onSubmit = (data: TRegister) => {
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
                            type="number"
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

      <Dialog
        open={showCredentials}
        onOpenChange={(open) => {
          if (!open) return;
          setShowCredentials(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registration Successful!</DialogTitle>
            <DialogDescription>
              Please save these credentials. You will need them to login.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Username</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => credentials && copyToClipboard(credentials.username)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  value={credentials?.username || ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => credentials && copyToClipboard(credentials.password)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="password"
                  value={credentials?.password || ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleCloseDialog}>
              Close and Login
              <X className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
