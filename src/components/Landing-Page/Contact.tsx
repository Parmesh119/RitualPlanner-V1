import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Send, Mail, User, MessageSquare } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Card, CardContent } from "@/components/ui/card"

interface ContactFormData {
    name: string
    email: string
    subject: string
    message: string
}

export default function Contact() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        subject: "",
        message: "",
    })

    const contactMutation = useMutation({
        mutationFn: async (data: ContactFormData) => {
            // Replace with your actual API endpoint
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            if (!response.ok) {
                throw new Error("Failed to send message")
            }
            return response.json()
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        contactMutation.mutate(formData)
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <Container id="contact" className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                        Contact Us
                    </h1>
                    <p className="text-lg text-gray-600">
                        Have questions? We'd love to hear from you. Send us a message and we'll
                        respond as soon as possible.
                    </p>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        name="subject"
                                        placeholder="Subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Textarea
                                    name="message"
                                    placeholder="Your Message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="min-h-[150px]"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={contactMutation.isPending}
                            >
                                {contactMutation.isPending ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>

                            {contactMutation.isSuccess && (
                                <p className="text-green-600 text-center mt-4">
                                    Message sent successfully!
                                </p>
                            )}

                            {contactMutation.isError && (
                                <p className="text-red-600 text-center mt-4">
                                    Failed to send message. Please try again.
                                </p>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Container>
    )
}
