import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Lock, Mail, Phone, Eye, EyeOff, UserPlus, Flame, X } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { app } from '@/util/firebaseConfig'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [terms, setTerms] = useState(false)
  const [signupMethod, setSignupMethod] = useState<"normal" | "google">("normal")
  const [showGoogleForm, setShowGoogleForm] = useState(false)
  const [googleFormStep, setGoogleFormStep] = useState<'phone' | 'password'>('phone')
  const [googleUserData, setGoogleUserData] = useState<{
    name: string;
    email: string;
    phone?: string;
  } | null>(null)

  const form = useForm<TRegister>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      signin: ""
    },
    mode: "onChange"
  })

  const googleForm = useForm<TRegister>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      signin: "google"
    },
    mode: "onChange"
  })

  const registerMutation = useMutation({
    mutationFn: registerAction,
    onSuccess: async () => {
      setShowSuccessDialog(true)
    },
    onError: () => {
      toast.error('Registration failed. Please try again.', {
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
    setShowSuccessDialog(false)
    navigate({ to: '/auth/login' })
  }

  const onSubmit = async (data: TRegister) => {
    const registerData: TRegister = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirmPassword: data.confirmPassword,
      signin: "normal"
    }
    setSignupMethod("normal")
    try {
      await registerMutation.mutateAsync(registerData)
      setShowSuccessDialog(true)
    } catch (error) {
      toast.error('Registration failed. Please try again.', {
        style: {
          background: "linear-gradient(90deg, #E53E3E, #C53030)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })
    }
  }

  const onSubmitGoogleForm = async (data: TRegister) => {
    if (!googleUserData) return

    const registerData: TRegister = {
      name: googleUserData.name,
      email: googleUserData.email,
      phone: data.phone,
      password: data.password,
      confirmPassword: data.confirmPassword,
      signin: "google"
    }
    setSignupMethod("google")
    try {
      await registerMutation.mutateAsync(registerData)
      setShowSuccessDialog(true)
    } catch (error) {
      toast.error('Registration failed. Please try again.', {
        style: {
          background: "linear-gradient(90deg, #E53E3E, #C53030)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })
    }
  }

  const handleGoogleFormClose = () => {
    setShowGoogleForm(false)
    setGoogleFormStep('phone')
    setGoogleUserData(null)
  }

  const handleNextStep = () => {
    setGoogleFormStep('password')
  }

  const handlePreviousStep = () => {
    setGoogleFormStep('phone')
  }

  const signUpWithGoogle = () => {
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider).then((userCredential) => {
      const user = userCredential.user
      if (user) {
        if (user.displayName && user.email) {
          const userData = {
            name: user.displayName,
            email: user.email,
            phone: user.phoneNumber || undefined
          }
          if (!userData.phone) {
            setGoogleUserData(userData)
            setShowGoogleForm(true)
            googleForm.setValue("name", userData.name)
            googleForm.setValue("email", userData.email)
          } else {
            const registerData: TRegister = {
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              password: user.uid,
              confirmPassword: user.uid,
              signin: "google"
            }
            setSignupMethod("google")
            registerMutation.mutate(registerData)
            setShowSuccessDialog(true)
          }
        } else {
          toast.error('Registration failed. Please try again.', {
            style: {
              background: "linear-gradient(90deg, #E53E3E, #C53030)",
              color: "white",
              fontWeight: "bolder",
              fontSize: "13px",
              letterSpacing: "1px",
            }
          })
        }
      }
    }).catch(() => {
      toast.error('Registration failed. Please try again.', {
        style: {
          background: "linear-gradient(90deg, #E53E3E, #C53030)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })
    })
  }

  return (
    <>
      <Helmet>
        <title>Register - RitualPlanner</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md bg-white shadow-lg text-black">
          <CardHeader className="space-y-1 flex flex-col items-center justify-center">
            <Flame className='w-14 h-14 text-black p-1 rounded-full' />
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
                <div className="flex items-center space-x-2">
                  <input
                    type='checkbox'
                    id="terms"
                    className='w-4 h-4'
                    checked={terms}
                    onChange={() => setTerms(!terms)}
                  />
                  <label htmlFor="terms" className="text-sm text-black font-semibold tracking-wide">
                    I agree to the Terms and Conditions
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 cursor-pointer"
                  disabled={registerMutation.isPending || !terms}
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
                <Button disabled={!terms || registerMutation.isPending} onClick={signUpWithGoogle} variant='outline' className='w-full cursor-pointer'>
                  {registerMutation.isPending ? "Creating account..." : "Sign Up With Google"} <img src="https://img.icons8.com/win10/512/google-logo.png" className='w-6 h-6 mt-0.5' alt='Google' />
                </Button>
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
        open={showSuccessDialog}
        onOpenChange={(open) => {
          if (!open) return;
          setShowSuccessDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-md bg-gray-200 dark:bg-gray-200 text-black">
          <DialogHeader>
            <DialogTitle className="text-black">Registration Successful!</DialogTitle>
            <DialogDescription className="text-black">
              {signupMethod === "normal" ? (
                "Your login credentials have been sent to your email address. Please check your inbox to access your account details."
              ) : (
                "Your account has been successfully created with Google. You can now log in using your Google account."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleCloseDialog} className="bg-black text-white hover:bg-gray-800">
              Close and Login
              <X className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showGoogleForm}
        onOpenChange={(open) => {
          if (!open) {
            handleGoogleFormClose()
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-gray-200 dark:bg-gray-200 text-black">
          <DialogHeader>
            <DialogTitle className="text-black">
              {googleFormStep === 'phone' ? 'Step 1: Phone Number' : 'Step 2: Set Password'}
            </DialogTitle>
            <DialogDescription className="text-black">
              {googleFormStep === 'phone'
                ? 'Please provide your phone number to continue.'
                : 'Please set a password for your account.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...googleForm}>
            <form onSubmit={googleForm.handleSubmit(onSubmitGoogleForm)} className="space-y-4">
              {googleFormStep === 'phone' ? (
                <>
                  <FormField
                    control={googleForm.control}
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
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleFormClose}
                      className="border-black text-black hover:bg-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <FormField
                    control={googleForm.control}
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
                    control={googleForm.control}
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

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="border-black text-black hover:bg-gray-300"
                    >
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      {registerMutation.isPending ? "Creating account..." : "Complete Registration"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
