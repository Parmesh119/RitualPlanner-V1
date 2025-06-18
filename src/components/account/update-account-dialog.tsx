import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { indianStatesAndUTs } from "@/util/state"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface UpdateAccountDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userData: {
        id: string
        name: string
        email: string
        phone: string
        state: string
        city: string
        zipcode: string
    }
    onUpdate: (data: {
        id: string
        name: string
        email: string
        phone: string
        state: string
        city: string
        zipcode: string
    }) => void
}

export function UpdateAccountDialog({
    open,
    onOpenChange,
    userData,
    onUpdate
}: UpdateAccountDialogProps) {
    const [formData, setFormData] = useState({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        state: userData.state,
        city: userData.city,
        zipcode: userData.zipcode
    })

    const handleSubmit = () => {
        // Basic validation
        if (!formData.name || !formData.email || !formData.phone || !formData.state || !formData.city || !formData.zipcode) {
            toast.error("Please fill in all fields", {
                style: {
                    background: "linear-gradient(90deg, #E53E3E, #C53030)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            })
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address", {
                style: {
                    background: "linear-gradient(90deg, #E53E3E, #C53030)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            })
            return
        }

        // Phone validation (basic)
        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Please enter a valid 10-digit phone number", {
                style: {
                    background: "linear-gradient(90deg, #E53E3E, #C53030)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            })
            return
        }

        // Zipcode validation
        const zipcodeRegex = /^\d{6}$/
        if (!zipcodeRegex.test(formData.zipcode)) {
            toast.error("Please enter a valid 6-digit zipcode", {
                style: {
                    background: "linear-gradient(90deg, #E53E3E, #C53030)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            })
            return
        }

        onUpdate(formData)
        onOpenChange(false)
    }

    const handleClose = () => {
        setFormData({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            state: userData.state,
            city: userData.city,
            zipcode: userData.zipcode
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-gray-200 dark:bg-gray-200 text-black">
                <DialogHeader>
                    <DialogTitle className="text-black">Update Account Information</DialogTitle>
                    <DialogDescription className="text-black">
                        Update your personal information below.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-black">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="text-black [&::placeholder]:text-black"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-black">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="text-black [&::placeholder]:text-black"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-black">Phone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="text-black [&::placeholder]:text-black"
                            placeholder="Enter your phone number"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-black">City</Label>
                        <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="text-black [&::placeholder]:text-black"
                            placeholder="Enter your city"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="zipcode" className="text-black">Zipcode</Label>
                        <Input
                            id="zipcode"
                            value={formData.zipcode}
                            onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                            className="text-black [&::placeholder]:text-black"
                            placeholder="Enter your zipcode"
                            maxLength={6}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state" className="text-black">State</Label>
                        <Select
                            value={formData.state}
                            onValueChange={(value) => setFormData({ ...formData, state: value })}
                        >
                            <SelectTrigger className="text-black w-full [&>span]:text-black">
                                <SelectValue placeholder="Select your state" className="text-black" />
                            </SelectTrigger>
                            <SelectContent>
                                {indianStatesAndUTs.map((state) => (
                                    <SelectItem key={state} value={state}>
                                        {state}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        className="border-black text-black hover:bg-gray-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-black text-white hover:bg-gray-800"
                    >
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
