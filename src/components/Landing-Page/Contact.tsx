import { useMutation } from "@tanstack/react-query"
import { Send, Mail, User, MessageSquare } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Card, CardContent } from "@/components/ui/card"
import { contactFormSchema, type ContactFormData } from "@/schemas/ContactUs"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

export default function Contact() {
    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
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

    const onSubmit = (data: ContactFormData) => {
        contactMutation.mutate(data)
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
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                <FormControl>
                                                    <Input
                                                        placeholder="Your Name"
                                                        className="pl-10"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="Your Email"
                                                        className="pl-10"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="relative">
                                                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                <FormControl>
                                                    <Input
                                                        placeholder="Subject"
                                                        className="pl-10"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Your Message"
                                                    className="min-h-[150px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </Container>
    )
}
