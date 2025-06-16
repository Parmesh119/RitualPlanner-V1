import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from 'react'
import { toast } from 'sonner'

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
  const accountData = queryClient.getQueryData(['accountDetails']) as User | undefined

  const [formData, setFormData] = useState({
    name: accountData?.name || '',
    email: accountData?.email || '',
    phone: accountData?.phone || '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    toast.success("Message sent successfully!", {
      style: {
        background: "linear-gradient(90deg, #38A169, #2F855A)",
        color: "white",
        fontWeight: "bolder",
        fontSize: "13px",
        letterSpacing: "1px",
      }
    })
    // Reset form
    setFormData({
      name: accountData?.name || '',
      email: accountData?.email || '',
      phone: accountData?.phone || '',
      subject: '',
      message: ''
    })
  }

  const handleCancel = () => {
    setFormData({
      name: accountData?.name || '',
      email: accountData?.email || '',
      phone: accountData?.phone || '',
      subject: '',
      message: ''
    })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Contact Support</CardTitle>
          <CardDescription>
            Have a question or need help? Send us a message and we'll get back to you as soon as possible.
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="min-h-[150px]"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit">
                Send Message
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
