import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "@tanstack/react-router"
import { Heart, Target, Users, Award } from "lucide-react"

export default function About() {

    const navigate = useNavigate()

    return (
        <section id="about" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto max-w-6xl">
                {/* Main Title Section */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-orange-200">
                        <Heart className="w-4 h-4" />
                        About Our Mission
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                        Empowering Spiritual
                        <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            {" "}
                            Professionals
                        </span>
                    </h2>
                    <p className="text-xl leading-relaxed text-gray-600">
                        RitualPlanner is designed to simplify the management of Karmakand rituals and ceremonies. Our platform
                        offers an intuitive way to schedule, track, and manage rituals, ensuring that spiritual professionals can
                        focus on their important work without worrying about the logistics.
                    </p>
                </div>

                {/* Cards Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-white to-orange-50">
                        <CardContent className="p-8">
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors border border-orange-200">
                                <Target className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We believe in providing a seamless experience for managing spiritual tasks, making it easier for
                                Karmakand professionals to organize their work. Our vision is to be the go-to tool for all Karmakand
                                scheduling needs, allowing you to focus on your spiritual journey.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50">
                        <CardContent className="p-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors border border-blue-200">
                                <Award className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why RitualPlanner?</h3>
                            <p className="text-gray-600 leading-relaxed">
                                RitualPlanner is crafted with the needs of spiritual professionals in mind. From handling daily rituals
                                to managing bookings months in advance, our software is built to offer a comprehensive solution that
                                fits your lifestyle and work requirements.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {[
                        {
                            icon: Users,
                            title: "Community Focused",
                            description: "Built by understanding the real needs of spiritual professionals",
                        },
                        {
                            icon: Heart,
                            title: "User-Centric Design",
                            description: "Intuitive interface designed for ease of use and efficiency",
                        },
                        {
                            icon: Target,
                            title: "Continuous Innovation",
                            description: "Regular updates and new features based on user feedback",
                        },
                    ].map((feature, index) => (
                        <div key={index} className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-orange-200">
                                <feature.icon className="w-8 h-8 text-orange-600" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Join Us Section */}
                <div className="text-center max-w-4xl mx-auto bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-12 text-white">
                    <h3 className="text-3xl font-bold mb-4">Join Us in Simplifying Karmakand Management</h3>
                    <p className="text-xl leading-relaxed opacity-90 mb-8">
                        We're passionate about making spiritual management easier. Whether you're a seasoned professional or just
                        starting, RitualPlanner is here to help you stay organized and focused on your spiritual journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-orange-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors" onClick={() => navigate({to: "/auth/register"})}>
                            Start Your Journey
                        </button>
                        <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white hover:text-orange-600 transition-colors">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
