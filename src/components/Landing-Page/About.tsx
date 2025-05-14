import { Card, CardContent } from "@/components/ui/card"
import { Container } from "@/components/ui/container"

export default function About() {
    return (
        <Container className="py-12 px-4 sm:px-6 lg:px-8">
            {/* Main Title Section */}
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                    About KarmaScheduler
                </h1>
                <p className="text-lg leading-8 text-gray-600">
                    KarmaScheduler is designed to simplify the management of Karmakand rituals and ceremonies.
                    Our platform offers an intuitive way to schedule, track, and manage rituals, ensuring that
                    spiritual professionals can focus on their important work without worrying about the logistics.
                </p>
            </div>

            {/* Cards Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <Card className="transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                        <p className="text-gray-600">
                            We believe in providing a seamless experience for managing spiritual tasks,
                            making it easier for Karmakand professionals to organize their work. Our
                            vision is to be the go-to tool for all Karmakand scheduling needs, allowing
                            you to focus on your spiritual journey.
                        </p>
                    </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why KarmaScheduler?</h2>
                        <p className="text-gray-600">
                            KarmaScheduler is crafted with the needs of spiritual professionals in mind.
                            From handling daily rituals to managing bookings months in advance, our
                            software is built to offer a comprehensive solution that fits your lifestyle
                            and work requirements.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Join Us Section */}
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
                    Join Us in Simplifying Karmakand Management
                </h2>
                <p className="text-lg leading-8 text-gray-600">
                    We're passionate about making spiritual management easier. Whether you're a
                    seasoned professional or just starting, KarmaScheduler is here to help you
                    stay organized and focused on your spiritual journey.
                </p>
            </div>
        </Container>
    )
}
