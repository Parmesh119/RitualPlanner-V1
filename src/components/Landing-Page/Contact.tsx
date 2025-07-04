"use client"

import { Send, Mail, User, MessageSquare } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"

const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormData = z.infer<typeof contactFormSchema>

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

    const onSubmit = (data: ContactFormData) => {
        toast.success("Message sent successfully! We'll get back to you soon.")
        form.reset()
    }

    return (
        <section id="contact" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-green-200">
                        <Mail className="w-4 h-4" />
                        Get in Touch
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                        Let's Start a
                        <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            {" "}
                            Conversation
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        Have questions about RitualPlanner? We'd love to hear from you. Send us a message and we'll respond as soon
                        as possible.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                We're here to help you with any questions about RitualPlanner. Fill out the form and we'll get back to
                                you as soon as possible.
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-2xl border-0 bg-white">
                            <CardContent className="p-8">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="relative">
                                                            <User className="absolute left-4 top-4 h-5 w-5 text-black mt-1" />
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Your Name"
                                                                    className="pl-12 h-14 bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-300 focus:ring-orange-200 rounded-xl text-gray-900 placeholder:text-black"
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
                                                            <Mail className="absolute left-4 top-4 h-5 w-5 text-black mt-1" />
                                                            <FormControl>
                                                                <Input
                                                                    type="email"
                                                                    placeholder="Your Email"
                                                                    className="pl-12 h-14 bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-300 focus:ring-orange-200 rounded-xl text-gray-900 placeholder:text-black"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="relative">
                                                        <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-black mt-1" />
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Subject"
                                                                className="pl-12 h-14 bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-300 focus:ring-orange-200 rounded-xl text-gray-900  placeholder:text-black"
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
                                                            placeholder="Tell us more about your inquiry..."
                                                            className="min-h-[150px] bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-300 focus:ring-orange-200 rounded-xl text-gray-900 placeholder:text-black resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full h-14 text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group"
                                        >
                                            Send Message
                                            <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
