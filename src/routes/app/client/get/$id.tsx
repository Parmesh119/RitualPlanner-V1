import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { getClientByIdAction } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil } from "lucide-react"
import { ClientDialog } from "@/components/client/create-dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export const Route = createFileRoute('/app/client/get/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    const { id } = Route.useParams()

    const { data: client, isLoading } = useQuery({
        queryKey: ['client', id],
        queryFn: () => getClientByIdAction(id),
    })

    if (isLoading) {
        return (
            <SidebarInset className='w-full'>
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Loading client details...</p>
                    </div>
                </div>
            </SidebarInset>
        )
    }

    if (!client) {
        return (
            <SidebarInset className='w-full'>
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Client Not Found</h2>
                        <p className="text-muted-foreground mb-4">The client you're looking for doesn't exist or has been removed.</p>
                        <Button onClick={() => navigate({ to: '/app/client' })}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Clients
                        </Button>
                    </div>
                </div>
            </SidebarInset>
        )
    }

    return (
        <SidebarInset className='w-full'>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-2 px-4 tracking-wider">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => navigate({ to: '/app/client' })}>Client</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className='mt-1' />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{client.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="flex flex-col gap-6 p-6">
                {/* Client Header Section */}
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                <User className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <ClientDialog client={client} mode="edit">
                            <Button>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Client
                            </Button>
                        </ClientDialog>
                    </div>
                </div>

                {/* Contact Information Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-blue-500" />
                                <CardTitle className="text-sm font-medium">Email</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-medium">{client.email || "Not provided"}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-green-500" />
                                <CardTitle className="text-sm font-medium">Phone</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-medium">{client.phone || "Not provided"}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-purple-500" />
                                <CardTitle className="text-sm font-medium">Location</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-medium">
                                {client.city && client.state ? `${client.city}, ${client.state}` : "Not provided"}
                            </p>
                            {client.zipcode && <p className="text-sm text-muted-foreground">ZIP Code: {client.zipcode}</p>}
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="details" className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <TabsList className="w-full max-w-full flex flex-row">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="details" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Basic Information
                                    </CardTitle>
                                    <CardDescription>Client's personal and contact details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                            <p className="text-base font-medium">{client.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                                            <p className="text-base font-medium">{client.phone || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                                            <p className="text-base font-medium">{client.email || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">City</p>
                                            <p className="text-base font-medium">{client.city || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">State</p>
                                            <p className="text-base font-medium">{client.state || "-"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Zipcode</p>
                                            <p className="text-base font-medium">{client.zipcode || "-"}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Additional Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Additional Information
                                    </CardTitle>
                                    <CardDescription>Additional details and metadata</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <p className="text-sm">{client.description || "No description provided"}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Created</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm font-medium">
                                                    {client.createdAt ? new Date(client.createdAt * 1000).toLocaleDateString() : "-"}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <p className="text-sm font-medium">
                                                    {client.updatedAt ? new Date(client.updatedAt * 1000).toLocaleDateString() : "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="tasks">
                        <Card>
                            <CardHeader>
                                <CardTitle>Client Tasks</CardTitle>
                                <CardDescription>Tasks associated with this client</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="py-12 text-center">
                                    <div className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4">
                                        <svg
                                            className="h-full w-full"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                                    <p className="text-muted-foreground mb-4">Tasks for this client will appear here when they are created.</p>
                                    <Button variant="outline" onClick={() => navigate({ to: "/app/tasks/create" })}>
                                        Create Task
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </SidebarInset>
    )
} 