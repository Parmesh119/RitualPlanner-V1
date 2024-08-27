import Helmet from 'react-helmet'
import { useEffect } from 'react';
const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);
  return (
    <div className="bg-white py-20">
      <Helmet>
        <title>
          About Us - RitualPlanner
        </title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About KarmaScheduler</h1>
          <p className="mt-4 text-lg text-gray-600 text-justify">
            KarmaScheduler is designed to simplify the management of Karmakand rituals and ceremonies.
            Our platform offers an intuitive way to schedule, track, and manage rituals, ensuring that
            spiritual professionals can focus on their important work without worrying about the logistics.
          </p>
        </div>

        <div className="mt-10 text-justify">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h2>
              <p className="text-gray-700">
                We believe in providing a seamless experience for managing spiritual tasks, making it easier for
                Karmakand professionals to organize their work. Our vision is to be the go-to tool for all Karmakand
                scheduling needs, allowing you to focus on your spiritual journey.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Why KarmaScheduler?</h2>
              <p className="text-gray-700">
                KarmaScheduler is crafted with the needs of spiritual professionals in mind. From handling daily rituals
                to managing bookings months in advance, our software is built to offer a comprehensive solution that fits
                your lifestyle and work requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-justify">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Us in Simplifying Karmakand Management</h2>
          <p className="text-lg text-gray-600">
            We`re passionate about making spiritual management easier. Whether you`re a seasoned professional or just starting,
            KarmaScheduler is here to help you stay organized and focused on your spiritual journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
