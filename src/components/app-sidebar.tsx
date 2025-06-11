import { useState, useEffect, useRef } from "react"
import { ChevronUp, User2, Settings, LayoutDashboard, Flame } from "lucide-react"
import { BadgeCheck, ListTodo, LogOut, Moon, Sun, NotebookText, IndianRupee, Bell, NotebookPen, BookUser, Calendar, List, ScrollText } from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Link } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"
import { useTheme } from "@/components/theme-provider"
import { useMutation } from "@tanstack/react-query"
import { getUserDetails } from "@/lib/actions"
import { toast } from "sonner"

const items = [
    {
        title: "Dashboard",
        url: "/app/dashboard/",
        icon: LayoutDashboard,
    },
    {
        title: "Task Management",
        url: "/app/tasks/",
        icon: ListTodo,
        items: [
            {
                title: "Tasks",
                url: "/app/tasks?view=list",
                icon: List,
            },
            {
                title: "Calendar View",
                url: "/app/tasks?view=calendar",
                icon: Calendar,
            }
        ]
    },
    {
        title: "Ritual Templates",
        url: "/app/ritual-templates/",
        icon: ScrollText,
    },
    {
        title: "Expense Tracking",
        url: "/app/expense/",
        icon: IndianRupee,
    },
    {
        title: "Notes",
        url: "/app/notes/",
        icon: NotebookPen,
    },
    {
        title: "Client Directory",
        url: "/app/clients/",
        icon: BookUser,
    },
    {
        title: "Daily Panchang",
        url: "https://v0-dynamic-astrology-form.vercel.app/",
        icon: NotebookText
    },
    {
        title: "Notifications",
        url: "/app/notifications/",
        icon: Bell,
    },
    {
        title: "Settings",
        url: "/app/setting/",
        icon: Settings,
    },
]

export function AppSidebar() {

    const navigate = useNavigate()

    const profileMutation = useMutation({
        mutationFn: getUserDetails,
        onSuccess: (data) => {
            setEmail(data.email)
            setName(data.name)
        },
        onError: () => {
            toast.error("Error while fetching user details! Please login again. ", {
                description: "Logging out ...",
                style: {
                    background: "linear-gradient(90deg, #E53E3E, #C53030)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            })
            navigate({ to: "/auth/login" })
            localStorage.clear()
            throw new Error("Error while fetching user details!")
        }
    })

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            if (initialized) {
                profileMutation.mutate()
            }
        }
    }, [])

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")

    const initialized = useRef(false);

    const { setTheme, theme } = useTheme()

    const handleLogout = () => {
        localStorage.clear()
        navigate({ to: "/auth/login" })
    }


    return (
        <Sidebar className="rounded-xl">
            <SidebarContent className="cursor-pointer" >
                <SidebarGroup className="space-y-4">
                    <SidebarGroupLabel className="tracking-widest text-lg gap-4 mt-4"><Flame className="bg-white text-black p-1 rounded-full" style={{ width: "28px", height: "28px" }} />RitualPlanner</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    {item.items && (
                                        <SidebarMenu className="ml-2 border-l border-gray-700">
                                            {item.items.map((subItem) => (
                                                <SidebarMenuItem key={subItem.title}>
                                                    <SidebarMenuButton asChild className="dark:text-gray-300 text-black dark:hover:text-white pl-4">
                                                        <Link to={subItem.url}>
                                                            <subItem.icon />
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t px-2 py-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="flex items-center space-x-3 px-3 py-6 rounded-lg hover:bg-accent transition-colors group w-full">
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <User2 className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-sm font-medium truncate">{name}</p>
                                        <p className="text-xs text-muted-foreground truncate xs:block md:block">{email}</p>
                                    </div>
                                    <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                sideOffset={10}
                                className="w-56 sm:w-64 ml-2 p-2 mb-2"
                                align="start"
                            >
                                <div className="px-3 py-2 mb-2">
                                    <p className="text-sm font-medium">User Account</p>
                                    <p className="text-xs text-muted-foreground">Manage your account settings</p>
                                </div>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem className="cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent">
                                    <BadgeCheck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <Link to="/app/dashboard" className="flex-1 truncate">
                                        <span className="text-sm">Account</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => {
                                        setTheme(theme === "light" ? "dark" : "light")
                                    }}
                                    className="cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent"
                                >
                                    {theme === "light" ? (
                                        <Moon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    ) : (
                                        <Sun className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    )}
                                    <span className="text-sm truncate">
                                        Switch to {theme === "light" ? "Dark" : "Light"} Mode
                                    </span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-destructive hover:text-destructive-foreground"
                                >
                                    <LogOut className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm truncate">Sign Out</span>
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}