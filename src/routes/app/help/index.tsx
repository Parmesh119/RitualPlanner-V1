import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { getAccountDetails, helpAction } from '@/lib/actions'
import { type THelp, HelpSchema } from '@/schemas/Help'
import { useMutation } from '@tanstack/react-query'
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

interface User {
  id: string
  name: string
  email: string
  phone: string
  state: string
  createdAt: number
}

export const Route = createFileRoute('/app/help/')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<THelp>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof THelp, string>>>({})

  const helpMutation = useMutation({
    mutationFn: helpAction,
    onSuccess: () => {
      toast.success("Message sent successfully!", {
        style: {
          background: "linear-gradient(90deg, #38A169, #2F855A)",
          color: "white",
          fontWeight: "bolder",
          fontSize: "13px",
          letterSpacing: "1px",
        }
      })
      // Reset form but keep user details
      setFormData(prev => ({
        ...prev,
        subject: '',
        message: ''
      }))
      setErrors({})
    },
    onError: (error: any) => {
      toast.error("Failed to send message", {
        description: error.message || "Something went wrong. Please try again.",
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

  // Try to get cached account data first
  const accountData = queryClient.getQueryData(['accountDetails']) as User | undefined

  useEffect(() => {
    // If no cached data, fetch it
    if (!accountData) {
      getAccountDetails()
        .then(data => {
          if (data) {
            setFormData(prev => ({
              ...prev,
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || ''
            }))
          }
        })
        .catch(error => {
          console.error('Error fetching account details:', error)
        })
    } else {
      // Use cached data
      setFormData(prev => ({
        ...prev,
        name: accountData.name || '',
        email: accountData.email || '',
        phone: accountData.phone || ''
      }))
    }
  }, [accountData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      // Validate form data
      const validatedData = HelpSchema.parse(formData)

      // If validation passes, send to backend
      helpMutation.mutate(validatedData)
    } catch (error: any) {
      if (error.errors) {
        // Handle Zod validation errors
        const newErrors: Partial<Record<keyof THelp, string>> = {}
        error.errors.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path[0] as keyof THelp] = err.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  const handleCancel = () => {
    // Reset form but keep user details
    setFormData(prev => ({
      ...prev,
      subject: '',
      message: ''
    }))
    setErrors({})
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
                  <BreadcrumbLink href="#">Feedback & Help</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Separator className="mb-4" />
        <div className="container mx-auto py-6 px-4">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Contact</CardTitle>
              <CardDescription>
                Have a question, need help or suggest anything that we can implement in this software? Send us a message and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      disabled
                      className="bg-muted/50 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted/50 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    disabled
                    className="bg-muted/50 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={errors.subject ? "border-destructive" : ""}
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">{errors.subject}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`min-h-[150px] ${errors.message ? "border-destructive" : ""}`}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message}</p>
                  )}
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={helpMutation.isPending}
                  >
                    {helpMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </>
  )
}
