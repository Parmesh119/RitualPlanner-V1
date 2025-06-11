import { createFileRoute } from '@tanstack/react-router'
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute('/app/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
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
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Separator className="mb-4" />

        {/* Your dashboard content goes here */}
        <div className="flex flex-col gap-4 px-8 py-2">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-700">
            Welcome to the dashboard! Here you can find an overview of your data and analytics.
          </p>
        </div>
      </SidebarInset>
    </>
  )
}
