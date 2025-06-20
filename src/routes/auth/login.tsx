import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Lock, LogIn, Flame, Eye, EyeOff } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Helmet } from "react-helmet"
import { useEffect, useState } from "react"
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
import { loginFormSchema, type TLogin } from "@/schemas/Auth"
import { checkAuthTypeByEmail, loginAction } from '@/lib/actions'
import { authService } from '@/lib/auth'
import { toast } from 'sonner'
import axios from 'axios'
import { app } from "@/util/firebaseConfig"
import { getAuth, signInWithPopup, GoogleAuthProvider, deleteUser } from "firebase/auth"

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()

  const [loginGoogle, setLoginGoogle] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await authService.isLoggedIn()
      if (isLoggedIn) {
        navigate({ to: '/app/dashboard' })
      }
    }
    checkAuth()
  }, [navigate])

  const form = useForm<TLogin>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })


  const loginMutation = useMutation({
    mutationFn: loginAction,
    onSuccess: async (data) => {
      if (data) {
        await authService.setTokens(data)

        toast.success('Login Successful', {
          description: "Welcome back! Redirecting to dashboard...",
          style: {
            background: "linear-gradient(90deg, #38A169, #2F855A)",
            color: "white",
            fontWeight: "bolder",
            fontSize: "13px",
            letterSpacing: "1px",
          }
        })

        navigate({ to: '/app/account' })
      }
    },
    onError: (error) => {
      console.error('Login error:', error)

      toast.error('Invalid credentials. Login Failed!', {
        description: getErrorMessage(),
        style: {
          background: "linear-gradient(90deg, #E53E3E, #C53030)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })
    },
  })

  const checkAuthTypeMutation = useMutation({
    mutationFn: checkAuthTypeByEmail,
    onSuccess: async (data) => {
      if (data === "normal") {

        try {
          const userId = localStorage.getItem("app-userId")
          if (userId) {
            const auth = getAuth(app)
            const user = auth.currentUser

            if (!user) {
              throw new Error("No user is currently logged in")
            }
            await deleteUser(user)
            localStorage.clear()
            navigate({ to: "/auth/login" })
            toast.error("User is registered with username and password. Please use it to login in.", {
              style: {
                background: "linear-gradient(90deg, #E53E3E, #C53030)",
                color: "white",
                fontWeight: "bolder",
                fontSize: "13px",
                letterSpacing: "1px",
              }
            })
          } else {
            throw new Error("Error while cleaning up Google account")
          }
        } catch (error: any) {
          toast.error("Error while cleaning up google account", {
            description: "Try again please ...",
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
    },
    onError: (error: any) => {
      toast.error(error.message, {
        description: "Please try logging in again",
        style: {
          background: "linear-gradient(90deg, #E53E3E, #C53030)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })
      localStorage.clear()
      navigate({ to: "/auth/login" })
    }
  })

  const onSubmit = (data: TLogin) => {
    loginMutation.mutate(data)
  }

  const getErrorMessage = () => {
    if (!loginMutation.error) return null

    if (axios.isAxiosError(loginMutation.error) && loginMutation.error.response) {
      return loginMutation.error.response.data.message || 'Login failed. Please check your credentials.'
    }

    return 'Unable to connect to the server. Please try again later.'
  }

  const loginWithGoogle = () => {
    setLoginGoogle(true)
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider).then((userCredentials) => {
      if (userCredentials.user) {
        const user = userCredentials.user

        toast.success('Login Successful', {
          description: "Welcome back! Redirecting to dashboard...",
          style: {
            background: "linear-gradient(90deg, #38A169, #2F855A)",
            color: "white",
            fontWeight: "bolder",
            fontSize: "13px",
            letterSpacing: "1px",
          }
        })
        user.getIdToken().then((token) => {
          localStorage.setItem("app-accessToken", token)
          localStorage.setItem("app-refreshToken", user.refreshToken)
          if (user.email && user.metadata.creationTime && user.displayName) {
            localStorage.setItem("app-email", user.email)
            localStorage.setItem("app-iat", user.metadata.creationTime)
          }
          localStorage.setItem("app-userId", user.uid)
          checkAuthTypeMutation.mutate()
          navigate({ to: "/app/dashboard" })
        })
      } else {
        toast.error("Error while logging in via Google!", {
          description: "Please Login again. Logging out ...",
          style: {
            background: "linear-gradient(90deg, #E53E3E, #C53030)",
            color: "white",
            fontWeight: "bolder",
            fontSize: "13px",
            letterSpacing: "1px",
          }
        })
        localStorage.clear()
        navigate({ to: "/auth/login" })
      }
    }).catch((error) => {
      toast.error("Account not found!", error.message)
      throw new Error("Error while logging in via Google!", error.message)
    })
  }

  return (
    <>
      <Helmet>
        <title>Login - RitualPlanner</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md bg-white text-black shadow-lg">
          <CardHeader className="space-y-1 flex flex-col items-center justify-center">
            <Flame className='w-14 h-14 text-black border-1 p-1 rounded-full' />
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-gray-900">
              Enter your username and password to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <User className="absolute left-3 top-2 h-5 w-5 text-black" />
                        <FormControl>
                          <Input
                            placeholder="Username"
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
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="pl-10 placeholder:text-black"
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
                <span className='flex items-center justify-center gap-2'>
                  <hr className='w-40' />
                  <span className='text-black'>OR</span>
                  <hr className='w-40' />
                </span>
                <Button variant='outline' onClick={loginWithGoogle} className='w-full cursor-pointer' disabled={loginMutation.isPending}>
                  {loginGoogle ? "Logging in..." : "Login With Google"} <img src="https://img.icons8.com/win10/512/google-logo.png" className='w-6 h-6 mt-0.5' alt='Google' />
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
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
