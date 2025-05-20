import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, FileSpreadsheet } from "lucide-react"


export default function Hero() {
    return (
        <>
            <main className="min-h-screen w-full">
                <div className="relative w-full">
                    {/* Background Pattern */}
                    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm -z-10" />
                    <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-10 -z-10" />

                    {/* Hero Section */}
                    <div className="container mx-auto px-4 py-16 sm:py-24">
                        <div className="grid grid-cols-1 gap-12 items-center">
                            {/* Content */}
                            <div className="space-y-8 max-w-3xl mx-auto text-center">
                                <div className="space-y-4">
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                        Modern Solution for
                                        <span className="text-gray-900 block mt-2">Karmakand Professionals</span>
                                    </h1>
                                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                                        Streamline your ritual management, client bookings, and religious events with our comprehensive digital platform.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                                        Get Started
                                    </Button>
                                </div>

                                {/* Feature Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
                                    <div className="flex flex-col items-center text-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Calendar className="h-8 w-8 text-gray-900" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Smart Scheduling</h3>
                                            <p className="text-gray-600 text-sm">Manage rituals and events effortlessly</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Clock className="h-8 w-8 text-gray-900" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Task Overview</h3>
                                            <p className="text-gray-600 text-sm">Track daily activities and reminders</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Users className="h-8 w-8 text-gray-900" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Client Management</h3>
                                            <p className="text-gray-600 text-sm">Organize contacts and bookings</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                        <FileSpreadsheet className="h-8 w-8 text-gray-900" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Easy Reports</h3>
                                            <p className="text-gray-600 text-sm">Export data in PDF or Excel format</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
