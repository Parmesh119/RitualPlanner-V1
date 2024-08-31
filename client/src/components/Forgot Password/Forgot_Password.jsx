import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";


export default function Forgot_Password() {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [new_otp, setNew_otp] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmitNumber = (e) => {
    e.preventDefault();
    if (
      email.includes("@") &&
      confirm(
        "are you written the correct email because It will going to send the OTP on written email"
      )
    ) {
      setShowOTPInput(true);
      const generated_OTP = generateOTP();
      setNew_otp(generated_OTP);
      send_OTP_mail(generated_OTP);
    } else {
      setShowOTPInput(false);
      toast.error("Email format is not proper or this is not correct email!");
    }
  };

  const send_OTP_mail = (generated_OTP) => {
    const templateParams = {
      to_email: email,
      message: generated_OTP,
    };

    emailjs
      .send(
        "service_kwdyvxu",
        "template_0oyirqk",
        templateParams,
        "NuAjbPAXYIxgeUmwf" // Add your EmailJS user ID here
      )
      .then((result) => {
        toast.success("OTP Sent Successfully!");
        console.log(result.text);
        setOTP("");
      })
      .catch((error) => {
        toast.error(error.message);
        setOTP("");
        setTimeout(() => {
          toast.success("Sending OTP again in a few seconds...");
          ResendOTP();
        }, 3000);
      });
  };

  function generateOTP() {
    let digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  const ResendOTP = (e) => {
    e.preventDefault();
    handleSubmitNumber(e);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp === new_otp) {
      navigate("/recover-password/new-password", {email: email});

      toast.success("OTP Verified!");
    } else {
      toast.error("Incorrect OTP!");
    }
  };

  return (
    <>
      <Helmet>
        <title>Recover Password</title>
      </Helmet>
      <section>
        <div className="flex items-center h-screen justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto rounded-lg xl:w-full xl:max-w-sm 2xl:max-w-md">
            <div className="mb-2 flex justify-center">
              <img
                alt="RitualPlanner"
                src="https://i.ibb.co/wS8fFBn/logo-color.png"
                className="h-12 w-auto m-auto mb-2"
              />
            </div>
            <h2 className="text-center text-2xl font-bold leading-tight text-black">
              Recover Your Password
            </h2>
            <form className="mt-8">
              <div className="space-y-5">
                <div>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-lg border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      placeholder="Your Email"
                      id="email"
                      autoFocus
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                {showOTPInput && (
                  <div>
                    <div className="mt-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="number"
                        placeholder="OTP"
                        id="OTP"
                        name="OTP"
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                      />
                      <button
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 mb-2"
                        id="verify"
                        onClick={handleVerifyOTP}
                      >
                        Verify
                      </button>
                      <button
                        className="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="resend"
                        onClick={ResendOTP}
                      >
                        Resend OTP
                      </button>
                    </div>

                  </div>
                )}
                {!showOTPInput && (
                  <div>
                    <button
                      className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" id="submit"
                      onClick={handleSubmitNumber}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </form>
            <div className="mt-3 space-y-3">
              <NavLink to={"/login"}>
                <button className="w-full py-2 px-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 border-4 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4">
                  Back to Login
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}