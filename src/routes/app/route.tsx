import { Outlet, createFileRoute } from '@tanstack/react-router'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"


export const Route = createFileRoute('/app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar  />
      <Outlet />
    </SidebarProvider>
  )
}