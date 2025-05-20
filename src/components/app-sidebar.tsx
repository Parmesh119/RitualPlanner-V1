import { ChevronUp, User2, Settings, LayoutDashboard } from "lucide-react"
import { BadgeCheck, ListTodo, LogOut, Moon, Sun, IndianRupee, Bell, NotebookPen, BookUser, Calendar, List, ScrollText } from 'lucide-react'
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
} from "@/components/ui/dropdown-menu"
import { Link } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"
import { useTheme } from "@/components/theme-provider"

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

    const { setTheme, theme } = useTheme()
    const navigate = useNavigate()

    const hadleLogout = () => {
        localStorage.clear()
        navigate({ to: "/auth/login" })
    }


    return (
        <Sidebar className="rounded-xl">
            <SidebarContent className="cursor-pointer" >
                <SidebarGroup className="space-y-4">
                    <SidebarGroupLabel className="tracking-widest text-base gap-4">Application</SidebarGroupLabel>
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
                                                    <SidebarMenuButton asChild className="text-gray-300 hover:text-white pl-4">
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

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="flex items-center space-x-2">
                                    <User2 />
                                    <span>User</span>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                sideOffset={10}
                                className="w-[--radix-popper-anchor-width] ml-24"
                            >
                                <DropdownMenuItem className="cursor-pointer flex items-center space-x-2">
                                    <BadgeCheck className="w-4 h-4" />
                                    <Link to="/app/dashboard"><span>Account</span></Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setTheme(theme === "light" ? "dark" : "light")
                                    }}
                                    className="cursor-pointer flex items-center space-x-2"
                                >
                                    {theme === "light" ? (
                                        <Moon className="w-4 h-4" />
                                    ) : (
                                        <Sun className="w-4 h-4" />
                                    )}
                                    <span>Change mode</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={hadleLogout}
                                    className="cursor-pointer flex items-center space-x-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}