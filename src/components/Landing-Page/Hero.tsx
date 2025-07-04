import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { Calendar, DollarSign, Users, FileSpreadsheet, ArrowRight, Sparkles } from "lucide-react"

export default function Hero() {
    return (
        <main className="min-h-screen w-full relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse" />
            <div className="absolute top-40 right-20 w-16 h-16 bg-amber-200 rounded-full opacity-20 animate-pulse delay-1000" />
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-orange-300 rounded-full opacity-20 animate-pulse delay-2000" />

            {/* Hero Section */}
            <div className="relative container mx-auto px-6 py-20 sm:py-28">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-orange-200">
                        <Sparkles className="w-4 h-4" />
                        Modern Solution for Spiritual Professionals
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                                Streamline Your
                                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent block mt-2">
                                    Karmakand Practice
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Manage rituals, client, and co-worker relationships with our comprehensive digital platform designed
                                specifically for spiritual professionals.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to={"/auth/register"}>
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all group"
                                >
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-6xl mx-auto">
                    {[
                        {
                            icon: Calendar,
                            title: "Task Management",
                            description: "Manage rituals and events effortlessly with intelligent calendar integration",
                            color: "bg-blue-50 text-blue-600 border-blue-200",
                        },
                        {
                            icon: DollarSign,
                            title: "Expense Tracking",
                            description: "Track daily expenses and get detailed financial insights for your ceremonies",
                            color: "bg-green-50 text-green-600 border-green-200",
                        },
                        {
                            icon: Users,
                            title: "Client and Co-worker Management",
                            description: "Organize contacts, bookings, and maintain detailed client and team relationships",
                            color: "bg-purple-50 text-purple-600 border-purple-200",
                        },
                        {
                            icon: FileSpreadsheet,
                            title: "Easy Reports",
                            description: "Generate and export detailed reports in PDF or Excel format instantly",
                            color: "bg-orange-50 text-orange-600 border-orange-200",
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
                        >
                            <div
                                className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border`}
                            >
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
