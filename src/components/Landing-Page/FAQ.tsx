import { Container } from "@/components/ui/container"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

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
            "Absolutely! RitualPlanner allows you to create custom templates for different types of rituals, specify required items, add specific instructions, and maintain detailed notes for each ceremony type. You can easily modify these templates as needed.",
    },
    {
        question: "Is there a mobile app available for RitualPlanner?",
        answer: "No, RitualPlanner is currently only available as a web-based platform. A mobile app is not available at the moment."
    }
]

export default function FAQSection() {
    return (
        <Container id="faq" className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <HelpCircle className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600">
                        Find answers to common questions about RitualPlanner and how it can help
                        you manage your ceremonies effectively.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqData.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-decoration-none">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </Container>
    )
}
