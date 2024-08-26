import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function Delete() {
    const [confirm, setConfirm] = useState(false)

    const navigate = useNavigate()

    const handleConfirm = async (ans) => {
        setConfirm(ans)

        const response = await fetch(
            import.meta.env.VITE_BASE_URL + '/notes/modify/delete/:id',
            {
                method: 'DELETE',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({confirm})
            },
        )

        const res = await response.json()

        if(res.error) {
            toast.error(res.error)
        } else {
            toast.success(res.success)
            setConfirm(false)
            navigate("/notes/all")
        }
    }

    return (
        <>
            {confirm("Do you want to delete this note?") ? handleConfirm(true) : handleConfirm(false)}
        </>
    )
}
