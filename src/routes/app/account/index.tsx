import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Mail, Phone, MapPin, Calendar, Shield, Bell, CreditCard, Settings,
    Edit3, LogOut, Activity, Users,
    Eye, EyeOff, Smartphone, Lock, Key, Crown, ChevronRight,
    Globe, Moon, Download, User2, Upload, X
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useTheme } from '@/components/theme-provider'
import { getAccountDetails, sendOTPAction, verifyOTPAction, updatePasswordAction, deleteAccountAction, checkAuthTypeByEmail, updateAccountDetailsAction } from '@/lib/actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { jsPDF } from 'jspdf'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getAuth, deleteUser } from "firebase/auth"
import { app } from '@/util/firebaseConfig'
import { UpdateAccountDialog } from "@/components/account/update-account-dialog"

export const Route = createFileRoute('/app/account/')({
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { theme, setTheme } = useTheme()

    const getAccountDetailsMutation = useMutation({
        mutationFn: getAccountDetails,
        onSuccess: (data) => {
            if (data) {
                setUserData({
                    id: data.id || "",
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    createdAt: data.createdAt || 0,
                    state: data.state || "",
                    city: data.city || "",
                    zipcode: data.zipcode || ""
                })
            } else {
                toast.error("Error while fetching user details", {
                    style: {
                        background: "linear-gradient(90deg, #E53E3E, #C53030)",
                        color: "white",
                        fontWeight: "bolder",
                        fontSize: "13px",
                        letterSpacing: "1px",
                    }
                })
                throw new Error("Error while fetching user details")
            }
        },
        onError: () => {
            toast.error("Error while fetching user details", {
                style: {
                    background: "linear-gradient(90deg, #E53E3E, #C53030)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            })
            throw new Error("Error while fetching user details")
        }
    })

    const sendOTPMutaion = useMutation({
        mutationFn: sendOTPAction,
        onSuccess: async (data) => {
            if (data) {
                setShowOtpDialog(true)
                toast.success("OTP has been sent to your registered email address", {
                    style: {
                        background: "linear-gradient(90deg, #38A169, #2F855A)",
                        color: "white",
                        fontWeight: "bolder",
                        fontSize: "13px",
                        letterSpacing: "1px",
                    }
                })
            }
        },
        onError: () => {
            toast.error("Error while sending OTP to your email address", {
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

    const verifyOtpMutation = useMutation({
        mutationFn: () => verifyOTPAction(otp, userData.email),
        onSuccess: async (data) => {
            if (data) {
                toast.success("OTP verified successfully", {
                    description: 'You can now change the password.',
                    style: {
                        background: "linear-gradient(90deg, #38A169, #2F855A)",
                        color: "white",
                        fontWeight: "bolder",
                        fontSize: "13px",
                        letterSpacing: "1px",
                    }
                })
                setShowOtpDialog(false)
                setShowNewPasswordDialog(true)
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
                setShowOtpDialog(false)
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
            setShowOtpDialog(false)
        }
    })

    const updatePasswordMutation = useMutation({
        mutationFn: () => updatePasswordAction(userData.email, newPassword, confirmNewPassword),
        onSuccess: async (data) => {
            if (data) {
                toast.success("Password updated successfully", {
                    description: "You need to login again!",
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
            }
        },
        onError: () => {
            toast.error("Error while updating password", {
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

    const checkAuthTypeMutation = useMutation({
        mutationFn: checkAuthTypeByEmail,
        onSuccess: async (data) => {
            if (data != "normal") {
                const userId = localStorage.getItem("app-userId")
                if (userId) {
                    const auth = getAuth(app)
                    const user = auth.currentUser

                    if (!user) {
                        throw new Error("No user is currently logged in")
                    }
                    await deleteUser(user)
                }
            }
            deleteAccountMutation.mutate()
        },
        onError: (error: any) => {
            toast.error("Error while checking account type info", {
                description: error.message,
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

    const deleteAccountMutation = useMutation({
        mutationFn: deleteAccountAction,
        onSuccess: async (data) => {
            if (data) {
                toast.success("Account deleted successfully", {
                    description: "You need register again to get start.",
                    style: {
                        background: "linear-gradient(90deg, #38A169, #2F855A)",
                        color: "white",
                        fontWeight: "bolder",
                        fontSize: "13px",
                        letterSpacing: "1px",
                    }
                })
            }
            localStorage.clear()
            navigate({ to: "/auth/register" })
        },
        onError: (error: any) => {
            toast.error("Error while deleting account", {
                description: error.message,
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

    const updateAccountMutation = useMutation({
        mutationFn: updateAccountDetailsAction,
        onSuccess: (data) => {
            setUserData(prev => ({
                ...prev,
                ...data
            }))
            queryClient.invalidateQueries({ queryKey: ['accountDetails'] })
            toast.success("Account information updated successfully", {
                style: {
                    background: "linear-gradient(90deg, #38A169, #2F855A)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            })
        },
        onError: (error: any) => {
            toast.error("Error updating account information", {
                description: error.message,
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

    // Update darkMode when theme changes
    useEffect(() => {
        setDarkMode(theme === "dark")
    }, [theme])

    // Fetch user data only once
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            getAccountDetailsMutation.mutate()
        }
    }, [])

    const initialized = useRef(false)

    const [notifications, setNotifications] = useState(true)
    const [twoFactorAuth, setTwoFactorAuth] = useState(false)
    const [publicProfile, setPublicProfile] = useState(true)
    const [userData, setUserData] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        createdAt: 0,
        state: "",
        city: "",
        zipcode: ""
    })

    // Initialize darkMode state based on current theme
    const [darkMode, setDarkMode] = useState(theme === "dark")

    const [showOtpDialog, setShowOtpDialog] = useState(false)
    const [otp, setOtp] = useState("")
    const [showNewPasswordDialog, setShowNewPasswordDialog] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showUpdateDialog, setShowUpdateDialog] = useState(false)
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Handle dark mode toggle
    const handleDarkModeChange = (checked: boolean) => {
        setDarkMode(checked)
        setTheme(checked ? "dark" : "light")
    }

    // Static data for other fields
    const staticData = {
        role: "Free User",
        totalRituals: 24,
        activeRituals: 8,
        completedRituals: 16,
        lastActive: "2 hours ago"
    }

    // Calculate profile completion percentage
    const calculateProfileCompletion = () => {
        const requiredFields = ['name', 'email', 'phone', 'state']
        const totalFields = requiredFields.length
        const completedFields = requiredFields.filter(field => {
            const value = userData[field as keyof typeof userData]
            return value && value.toString().trim() !== ''
        }).length

        return Math.round((completedFields / totalFields) * 100)
    }

    // Format the creation date
    const formatCreationDate = (timestamp: number) => {
        if (!timestamp) return "N/A"
        // Convert milliseconds to seconds if needed
        const dateInSeconds = timestamp > 1000000000000 ? timestamp / 1000 : timestamp
        const date = new Date(dateInSeconds * 1000)
        return date.toLocaleDateString('en-IN', {
            month: 'long',
            year: 'numeric',
            timeZone: 'Asia/Kolkata'
        })
    }

    // Handle data download
    const handleDownloadData = () => {
        const doc = new jsPDF()

        // Add title
        doc.setFontSize(20)
        doc.text('Ritual Planner - Account Information', 20, 20)

        // Add date
        doc.setFontSize(12)
        doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Kolkata'
        })}`, 20, 30)

        // Personal Information Section
        doc.setFontSize(16)
        doc.text('Personal Information', 20, 45)
        doc.setFontSize(12)
        doc.text(`Name: ${userData.name}`, 20, 55)
        doc.text(`Email: ${userData.email}`, 20, 65)
        doc.text(`Phone: ${userData.phone}`, 20, 75)
        doc.text(`Location: ${userData.city}, ${userData.state} - ${userData.zipcode}`, 20, 85)
        doc.text(`Member Since: ${formatCreationDate(userData.createdAt)}`, 20, 95)

        // Account Settings Section
        doc.setFontSize(16)
        doc.text('Account Settings', 20, 115)
        doc.setFontSize(12)
        doc.text(`Notifications: ${notifications ? 'Enabled' : 'Disabled'}`, 20, 125)
        doc.text(`Two-Factor Authentication: ${twoFactorAuth ? 'Enabled' : 'Disabled'}`, 20, 135)
        doc.text(`Public Profile: ${publicProfile ? 'Enabled' : 'Disabled'}`, 20, 145)
        doc.text(`Dark Mode: ${darkMode ? 'Enabled' : 'Disabled'}`, 20, 155)

        // Subscription Section
        doc.setFontSize(16)
        doc.text('Subscription Details', 20, 175)
        doc.setFontSize(12)
        doc.text(`Plan: ${staticData.role}`, 20, 185)
        doc.text(`Last Active: ${staticData.lastActive}`, 20, 195)

        // Add footer
        doc.setFontSize(10)
        doc.text('This is a computer-generated document. No signature is required.', 20, 280)

        // Save the PDF
        doc.save(`ritual-planner-data-${userData.name}.pdf`)

        toast.success("Your data has been downloaded successfully!", {
            style: {
                background: "linear-gradient(90deg, #059669, #047857)",
                color: "white",
                fontWeight: "bolder",
                fontSize: "13px",
                letterSpacing: "1px",
            }
        })
    }

    // Reset OTP dialog fields
    const resetOtpDialog = () => {
        setOtp("")
        setShowOtpDialog(false)
    }

    const handleChangePassword = () => {
        resetOtpDialog()
        setNewPassword("")
        setConfirmNewPassword("")
        setShowNewPasswordDialog(false)
        sendOTPMutaion.mutate()
    }

    const handleVerifyOtp = () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP", {
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
        verifyOtpMutation.mutate()
    }

    const handleUpdatePassword = () => {
        if (newPassword !== confirmNewPassword) {
            toast.error("Passwords do not match", {
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
        updatePasswordMutation.mutate()
        setNewPassword("")
        setConfirmNewPassword("")
        setShowNewPasswordDialog(false)
    }

    const handleUpdateAccount = (data: { id: string; name: string; email: string; phone: string; state: string; city: string; zipcode: string }) => {
        updateAccountMutation.mutate({
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            state: data.state,
            city: data.city,
            zipcode: data.zipcode
        })
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Image size should be less than 5MB", {
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

            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result as string)
                // Here you would typically upload the image to your backend
                // For now, we'll just store it in state
                toast.success("Profile image updated successfully", {
                    style: {
                        background: "linear-gradient(90deg, #38A169, #2F855A)",
                        color: "white",
                        fontWeight: "bolder",
                        fontSize: "13px",
                        letterSpacing: "1px",
                    }
                })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setProfileImage(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        // Here you would typically remove the image from your backend
        toast.success("Profile image removed successfully", {
            style: {
                background: "linear-gradient(90deg, #38A169, #2F855A)",
                color: "white",
                fontWeight: "bolder",
                fontSize: "13px",
                letterSpacing: "1px",
            }
        })
    }

    return (
        <>
            <SidebarInset className='w-full'>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4 tracking-wider">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#">Account</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{userData.name}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <Separator className="mb-4" />
                <div className="w-full min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
                    <div className="container mx-auto py-4 px-10">
                        {/* Header Section */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Account Settings
                            </h1>
                            <p className="text-muted-foreground mt-2 text-lg">
                                Manage your profile, preferences, and account security
                            </p>
                        </div>

                        <Tabs defaultValue="profile" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
                                <TabsTrigger value="profile" className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="security" className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Security
                                </TabsTrigger>
                                <TabsTrigger value="preferences" className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Preferences
                                </TabsTrigger>
                                <TabsTrigger value="billing" className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Billing
                                </TabsTrigger>
                            </TabsList>

                            {/* Profile Tab */}
                            <TabsContent value="profile" className="space-y-6">
                                <div className="grid gap-6 lg:grid-cols-3">
                                    {/* Profile Card */}
                                    <Card className="lg:col-span-2 border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-2xl font-bold">{userData.name}</CardTitle>
                                                    <CardDescription className="text-muted-foreground">
                                                        Your personal details and public information
                                                    </CardDescription>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-black cursor-pointer hover:text-white"
                                                    onClick={() => setShowUpdateDialog(true)}
                                                >
                                                    <Edit3 className="h-4 w-4 mr-2" />
                                                    Edit
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="flex flex-col items-center space-y-4">
                                                    <div className="relative group">
                                                        <div className="h-32 w-32 rounded-full border-4 border-primary/20 shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-primary/40 bg-primary/10 flex items-center justify-center overflow-hidden">
                                                            {profileImage ? (
                                                                <img
                                                                    src={profileImage}
                                                                    alt="Profile"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <User2 className="h-16 w-16 text-primary" />
                                                            )}
                                                        </div>
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full">
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-10 w-auto px-3 rounded-lg bg-white/20 hover:bg-white/30 flex items-center gap-2"
                                                                    onClick={() => fileInputRef.current?.click()}
                                                                >
                                                                    <Upload className="h-4 w-4 text-white" />
                                                                    <span className="text-white text-sm">Upload</span>
                                                                </Button>
                                                                {profileImage && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-10 w-auto px-3 rounded-lg bg-white/20 hover:bg-white/30 flex items-center gap-2"
                                                                        onClick={handleRemoveImage}
                                                                    >
                                                                        <X className="h-4 w-4 text-white" />
                                                                        <span className="text-white text-sm">Remove</span>
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        aria-label="Upload profile picture"
                                                    />
                                                    <div className="text-center space-y-2">
                                                        <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-primary/20 text-primary font-semibold px-4 py-1">
                                                            <Crown className="h-3 w-3 mr-1" />
                                                            {staticData.role}
                                                        </Badge>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Activity className="h-3 w-3" />
                                                            Last active {staticData.lastActive}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex-1 space-y-4">
                                                    <div className="space-y-4">
                                                        <div className="group p-4 rounded-xl border bg-gradient-to-r from-background to-muted/20 hover:from-primary/5 hover:to-primary/10 transition-all duration-300 hover:shadow-md hover:border-primary/20">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                                    <Mail className="h-4 w-4 text-primary" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="font-medium">{userData.email}</p>
                                                                    <p className="text-sm text-muted-foreground">Primary email address</p>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className="group p-4 rounded-xl border bg-gradient-to-r from-background to-muted/20 hover:from-primary/5 hover:to-primary/10 transition-all duration-300 hover:shadow-md hover:border-primary/20">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                                    <Phone className="h-4 w-4 text-primary" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="font-medium">{userData.phone}</p>
                                                                    <p className="text-sm text-muted-foreground">Phone number</p>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className="group p-4 rounded-xl border bg-gradient-to-r from-background to-muted/20 hover:from-primary/5 hover:to-primary/10 transition-all duration-300 hover:shadow-md hover:border-primary/20">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                                    <MapPin className="h-4 w-4 text-primary" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="font-medium">{userData.city}, {userData.state} - {userData.zipcode}</p>
                                                                    <p className="text-sm text-muted-foreground">Current location</p>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className="group p-4 rounded-xl border bg-gradient-to-r from-background to-muted/20 hover:from-primary/5 hover:to-primary/10 transition-all duration-300 hover:shadow-md hover:border-primary/20">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                                    <Calendar className="h-4 w-4 text-primary" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="font-medium">Member since {formatCreationDate(userData.createdAt)}</p>
                                                                    <p className="text-sm text-muted-foreground">Account creation date</p>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Stats Card */}
                                    <Card className="border-0 h-50 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-xl font-bold">Activity Overview</CardTitle>
                                            <CardDescription>Your ritual planning statistics</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">Profile Completion</span>
                                                    <span className="text-sm text-muted-foreground">{calculateProfileCompletion()}%</span>
                                                </div>
                                                <Progress value={calculateProfileCompletion()} className="h-2" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            {/* Security Tab */}
                            <TabsContent value="security" className="space-y-6">
                                <div className="grid gap-6 lg:grid-cols-2">
                                    <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Shield className="h-5 w-5 text-primary" />
                                                Security Settings
                                            </CardTitle>
                                            <CardDescription>Manage your account security and authentication</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r from-background to-muted/20">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/10">
                                                        <Smartphone className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="2fa" className="font-medium">Two-Factor Authentication</Label>
                                                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                                                    </div>
                                                </div>
                                                <Switch
                                                    id="2fa"
                                                    checked={twoFactorAuth}
                                                    onCheckedChange={() => {
                                                        toast.info("This part is coming soon in new version")
                                                    }}
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Button variant="outline" className="w-full justify-start gap-3 p-4 h-auto hover:bg-primary/5 hover:border-primary/20" onClick={handleChangePassword}>
                                                    <Key className="h-4 w-4 text-primary" />
                                                    <div className="text-left">
                                                        <p className="font-medium">Change Password</p>
                                                        <p className="text-sm text-muted-foreground">Update your account password</p>
                                                    </div>
                                                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                                                </Button>

                                                <Button onClick={() => {
                                                    toast.info("This part is coming soon in new version")
                                                }} variant="outline" className="w-full justify-start gap-3 p-4 h-auto hover:bg-primary/5 hover:border-primary/20">
                                                    <Lock className="h-4 w-4 text-primary" />
                                                    <div className="text-left">
                                                        <p className="font-medium">Active Sessions</p>
                                                        <p className="text-sm text-muted-foreground">Manage your logged-in devices</p>
                                                    </div>
                                                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Eye className="h-5 w-5 text-primary" />
                                                Privacy Settings
                                            </CardTitle>
                                            <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r from-background to-muted/20">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/10">
                                                        <Globe className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="public" className="font-medium">Public Profile</Label>
                                                        <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                                                    </div>
                                                </div>
                                                <Switch
                                                    id="public"
                                                    checked={publicProfile}
                                                    onCheckedChange={() => {
                                                        toast.info("This part is coming soon in new version")
                                                    }}
                                                />
                                            </div>

                                            <Button onClick={handleDownloadData} variant="outline" className="w-full justify-start gap-3 p-4 h-auto hover:bg-primary/5 hover:border-primary/20">
                                                <Download className="h-4 w-4 text-primary" />
                                                <div className="text-left">
                                                    <p className="font-medium">Download Data</p>
                                                    <p className="text-sm text-muted-foreground">Export your account data</p>
                                                </div>
                                                <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                                {/* Danger Zone */}
                                <Card className="border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10">
                                    <CardHeader>
                                        <CardTitle className="text-destructive flex items-center gap-2">
                                            <LogOut className="h-5 w-5" />
                                            Danger Zone
                                        </CardTitle>
                                        <CardDescription>Irreversible actions for your account</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-background">
                                            <div>
                                                <h4 className="font-medium text-destructive">Delete Account</h4>
                                                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                className="bg-destructive/90 hover:bg-destructive"
                                                onClick={() => setShowDeleteDialog(true)}
                                            >
                                                Delete Account
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Preferences Tab */}
                            <TabsContent value="preferences" className="space-y-6">
                                <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="h-5 w-5 text-primary" />
                                            App Preferences
                                        </CardTitle>
                                        <CardDescription>Customize your app experience and notifications</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-4">
                                                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Appearance</h4>

                                                <div className="flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r from-background to-muted/20">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-primary/10">
                                                            <Moon className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                                                            <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        id="dark-mode"
                                                        checked={darkMode}
                                                        onCheckedChange={handleDarkModeChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Notifications</h4>

                                                <div className="flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r from-background to-muted/20">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-primary/10">
                                                            <Bell className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="notifications" className="font-medium">Push Notifications</Label>
                                                            <p className="text-sm text-muted-foreground">Receive app notifications</p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        id="notifications"
                                                        checked={notifications}
                                                        onCheckedChange={setNotifications}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Billing Tab */}
                            <TabsContent value="billing" className="space-y-6">
                                <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                            Billing Information
                                        </CardTitle>
                                        <CardDescription>Manage your subscription and payment methods</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="p-6 rounded-xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                                                        <User2 className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">Free Plan</h3>
                                                        <p className="text-sm text-muted-foreground">Basic features</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                                    ACTIVE
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></span>
                                                <Button onClick={() => {
                                                    toast.info("This part is coming soon in new version.")
                                                }} variant="outline">Upgrade Plan</Button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-medium">Payment Methods</h4>
                                            <Button onClick={() => {
                                                toast.info("This part is coming soon in new version.")
                                            }} variant="outline" className="w-full">Add Payment Method</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </SidebarInset>

            {/* OTP Verification Dialog */}
            <Dialog open={showOtpDialog} onOpenChange={resetOtpDialog}>
                <DialogContent className="sm:max-w-md bg-gray-200 dark:bg-gray-200 text-black">
                    <DialogHeader>
                        <DialogTitle className="text-black">Verify OTP</DialogTitle>
                        <DialogDescription className="text-black">
                            Please enter the 6-digit OTP sent to your email address.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="text-black placeholder:text-black"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={resetOtpDialog}
                                className="border-black text-black hover:bg-gray-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleVerifyOtp}
                                disabled={verifyOtpMutation.isPending}
                                className="bg-black text-white hover:bg-gray-800"
                            >
                                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* New Password Dialog */}
            <Dialog open={showNewPasswordDialog} onOpenChange={() => {
                setNewPassword("")
                setConfirmNewPassword("")
                setShowNewPasswordDialog(false)
            }}>
                <DialogContent className="sm:max-w-md bg-gray-200 dark:bg-gray-200 text-black">
                    <DialogHeader>
                        <DialogTitle className="text-black">Set New Password</DialogTitle>
                        <DialogDescription className="text-black">
                            Please enter your new password.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="text-black placeholder:text-black pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                )}
                            </Button>
                        </div>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="text-black placeholder:text-black pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                )}
                            </Button>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setNewPassword("")
                                    setConfirmNewPassword("")
                                    setShowNewPasswordDialog(false)
                                }}
                                className="border-black text-black hover:bg-gray-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdatePassword}
                                className="bg-black text-white hover:bg-gray-800"
                            >
                                Update Password
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Account Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-md bg-gray-200 dark:bg-gray-200 text-black">
                    <DialogHeader>
                        <DialogTitle className="text-black">Delete Account</DialogTitle>
                        <DialogDescription className="text-black">
                            Are you sure you want to delete your account? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            className="border-black text-black hover:bg-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                checkAuthTypeMutation.mutate()
                                setShowDeleteDialog(false)
                            }}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <UpdateAccountDialog
                open={showUpdateDialog}
                onOpenChange={setShowUpdateDialog}
                userData={userData}
                onUpdate={handleUpdateAccount}
            />
        </>
    )
}