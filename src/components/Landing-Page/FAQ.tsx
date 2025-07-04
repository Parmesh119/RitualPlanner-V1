import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageCircle } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"

const faqData = [
    {
        question: "What is RitualPlanner and how does it work?",
        answer:
            "RitualPlanner is a specialized scheduling platform designed for Karmakand professionals to manage their ritual ceremonies and services. It provides an intuitive interface to schedule, track, and organize various religious ceremonies, maintain client information, and handle booking requests efficiently.",
    },
    {
        question: "Can I manage multiple ceremonies and rituals simultaneously?",
        answer:
            "Yes, RitualPlanner is built to handle multiple ceremonies simultaneously. You can manage different types of rituals, track their requirements, schedule them at different locations, and maintain separate calendars for various types of ceremonies all from one dashboard.",
    },
    {
        question: "How secure is my client's information on RitualPlanner?",
        answer:
            "We take data security very seriously. All client information is encrypted and stored securely following industry best practices. We comply with data protection regulations and ensure that your clients' personal information and ceremony details are kept completely confidential.",
    },
    {
        question: "Does RitualPlanner offer reminders and notifications?",
        answer:
            "Yes, RitualPlanner includes a comprehensive notification system. You'll receive timely reminders about upcoming ceremonies, client appointments, and important ritual preparations. You can also set custom notifications for specific events and choose your preferred notification method.",
    },
    {
        question: "Can I customize the ritual requirements and details?",
        answer:
            "RitualPlanner allows you to create custom templates for different types of rituals, specify required items, add specific instructions, and maintain detailed notes for each ceremony type. You can easily modify these templates as needed.",
    },
    {
        question: "Is there a mobile app available for RitualPlanner?",
        answer:
            "Currently, RitualPlanner is available as a responsive web application that works seamlessly on all devices. A dedicated mobile app is in development and will be available soon.",
    },
]

export default function FAQSection() {

    const navigate = useNavigate()
    
    return (
        <section id="faq" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
                        <MessageCircle className="w-4 h-4" />
                        Got Questions?
                    </div>

                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center border border-blue-200">
                            <HelpCircle className="h-10 w-10 text-blue-600" />
                        </div>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                        Frequently Asked
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {" "}
                            Questions
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Find answers to common questions about RitualPlanner and how it can help you manage your ceremonies
                        effectively.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqData.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border border-gray-200 rounded-2xl px-6 py-2 hover:border-blue-200 transition-colors"
                            >
                                <AccordionTrigger className="text-left hover:no-underline text-gray-900 font-semibold text-lg py-6 hover:text-blue-600 transition-colors">
                                    <span className="flex items-start gap-4">
                                        <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                                            {index + 1}
                                        </span>
                                        {faq.question}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 text-base leading-relaxed pl-12 pb-6">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
                    <p className="text-gray-600 mb-6">
                        Can't find the answer you're looking for? Please chat with our friendly team.
                    </p>
                    <a
                        href="mailto:parmeshb90@gmail.com"
                        className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-xl hover:shadow-lg transition-all"
                    >
                        Get in Touch
                    </a>
                </div>
            </div>
        </section>
    )
}
