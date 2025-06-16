import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ZodError } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CoWorkerSchema, type TCoWorker } from "@/schemas/CoWorker"
import { cn } from "@/lib/utils"
import { createCoWorkerAction, updateCoWorkerAction } from "@/lib/actions"

interface CreateCoWorkerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mode?: 'create' | 'edit'
    coWorker?: TCoWorker
}

export function CreateCoWorkerDialog({ open, onOpenChange, mode = 'create', coWorker }: CreateCoWorkerDialogProps) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [errors, setErrors] = useState<{
        name?: string
        email?: string
        phone?: string
    }>({})

    const queryClient = useQueryClient()

    // Set initial values when in edit mode
    useEffect(() => {
        if (mode === 'edit' && coWorker) {
            setName(coWorker.name)
            setEmail(coWorker.email || '')
            setPhone(coWorker.phone)
        }
    }, [mode, coWorker])

    const createCoWorkerMutation = useMutation({
        mutationFn: createCoWorkerAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['co-workers'] })
            toast.success('Co-worker created successfully', {
                style: {
                    background: "linear-gradient(90deg, #38A169, #2F855A)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            })
            resetForm()
            onOpenChange(false)
        },
        onError: () => {
            toast.error('Failed to create co-worker', {
                style: {
                    background: "linear-gradient(90deg, #E53E3E, #C53030)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            })
        }
    })

    const updateCoWorkerMutation = useMutation({
        mutationFn: updateCoWorkerAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['co-workers'] })
            queryClient.invalidateQueries({ queryKey: ['co-worker'] })
            toast.success('Co-worker updated successfully', {
                style: {
                    background: "linear-gradient(90deg, #38A169, #2F855A)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            })
            resetForm()
            onOpenChange(false)
        },
        onError: () => {
            toast.error('Failed to update co-worker', {
                style: {
                    background: "linear-gradient(90deg, #E53E3E, #C53030)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            })
        }
    })

    const resetForm = () => {
        setName("")
        setEmail("")
        setPhone("")
        setErrors({})
    }

    const handleCancel = () => {
        resetForm()
        onOpenChange(false)
    }

    const validateCoWorker = () => {
        try {
            const coWorkerToValidate = {
                id: mode === 'edit' ? coWorker?.id : undefined,
                name,
                email: email || null,
                phone,
            }

            const validatedCoWorker = CoWorkerSchema.parse(coWorkerToValidate)
            setErrors({})
            return validatedCoWorker
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                const newErrors: typeof errors = {
                    name: fieldErrors.name?.[0],
                    email: fieldErrors.email?.[0],
                    phone: fieldErrors.phone?.[0],
                };
                setErrors(newErrors)
            }
            return null
        }
    }

    const handleSubmit = () => {
        const validatedCoWorker = validateCoWorker()
        if (validatedCoWorker) {
            if (mode === 'edit') {
                updateCoWorkerMutation.mutate(validatedCoWorker)
            } else {
                createCoWorkerMutation.mutate(validatedCoWorker)
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                resetForm()
            }
            onOpenChange(isOpen)
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === 'edit' ? 'Edit Co-Worker' : 'Create New Co-Worker'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'edit' ? 'Update co-worker information.' : 'Add a new co-worker with name, email, and phone number.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter co-worker name"
                            className={cn(errors.name && "border-red-500")}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter co-worker email"
                            className={cn(errors.email && "border-red-500")}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter co-worker phone number"
                            className={cn(errors.phone && "border-red-500")}
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-500">{errors.phone}</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={createCoWorkerMutation.isPending || updateCoWorkerMutation.isPending}
                    >
                        {createCoWorkerMutation.isPending || updateCoWorkerMutation.isPending
                            ? (mode === 'edit' ? "Updating..." : "Creating...")
                            : (mode === 'edit' ? "Update Co-Worker" : "Create Co-Worker")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}