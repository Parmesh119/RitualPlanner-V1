import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function New_Password() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const navigate = useNavigate()

    const ID = localStorage.getItem('userId')

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const updatePassword = async (e) => {
        e.preventDefault()

        const response = await fetch(import.meta.env.VITE_BASE_URL + "/api/recover-password/new-password", {
            method: 'PUT',
            headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({password, confirmPassword, ID})
        })

        const res = await response.json()

        if(res.error) {
            toast.error(res.error)
        } else {
            toast.success(res.success)
            setPassword("")
            setConfirmPassword("")
            navigate("/login")
        }
    }

    function myFunction() {
        var x = document.getElementById("password");
        var y = document.getElementById("new_password")
        if (x.type === "password" && y.type === "password") {
            x.type = "text";
            y.type = "text";
        } else {
            x.type = "password";
            y.type = "password"
        }
    }

    return (
        <>
            <Helmet>
                <title>
                    Recover Password
                </title>
                <link rel="icon" type="image/svg+xml" href="../../assets/logo-color.png" />
            </Helmet>
            <section>
                <div className="flex items-center justify-center h-screen px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
                    <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                        <div className="mb-2 flex justify-center">
                            <img
                                alt="RitualPlanner"
                                src="https://i.ibb.co/wS8fFBn/logo-color.png"
                                className="h-12 w-auto"
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
                                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="password"
                                            placeholder="New Password"
                                            id="password"
                                            value={password}
                                            autoFocus
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                        ></input>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="password"
                                            placeholder="Confirm Password"
                                            id="new_password"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(e.target.value)
                                            }
                                            required
                                        ></input>
                                    </div>
                                    <label>
                                        <div className="text-left">
                                            <label><input type="checkbox" onClick={myFunction} className="mt-4 mx-1 p-2 " />Show Password</label>
                                        </div>
                                    </label>
                                    <div>
                                        <button
                                            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
                                            onClick={updatePassword}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}