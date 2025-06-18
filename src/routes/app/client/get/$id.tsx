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
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil } from "lucide-react"
import { ClientDialog } from "@/components/client/create-dialog"

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
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4 tracking-wider">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#" onClick={() => navigate({ to: '/app/client' })}>Client</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{client.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <Separator className="mb-4" />

            <div className="flex flex-col gap-4 px-4 md:px-8 py-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Client Details</h1>
                    <ClientDialog client={client} mode="edit">
                        <Button>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Client
                        </Button>
                    </ClientDialog>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Client's basic details and contact information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                                <p className="text-lg">{client.name || "-"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                <p className="text-lg">{client.email || "-"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                                <p className="text-lg">{client.phone || "-"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">City</h3>
                                <p className="text-lg">{client.city || "-"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">State</h3>
                                <p className="text-lg">{client.state || "-"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Zipcode</h3>
                                <p className="text-lg">{client.zipcode || "-"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                            <CardDescription>Additional details about the client</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                                <p className="text-lg">{client.description || "-"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                                <p className="text-lg">{client.createdAt ? new Date(client.createdAt * 1000).toLocaleDateString() : "-"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Updated At</h3>
                                <p className="text-lg">{client.updatedAt ? new Date(client.updatedAt * 1000).toLocaleDateString() : "-"}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SidebarInset>
    )
} 