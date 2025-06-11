import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { ZodError } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NoteSchema, type TNote } from "@/schemas/Note"
import { cn } from "@/lib/utils"
import { createNoteAction } from "@/lib/actions"

interface CreateNoteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateNoteDialog({ open, onOpenChange }: CreateNoteDialogProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [errors, setErrors] = useState<{
        title?: string
        description?: string
        reminder_date?: string
    }>({})

    const queryClient = useQueryClient()

    const createNoteMutation = useMutation({
        mutationFn: createNoteAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] })
            toast.success('Note created successfully', {
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
            toast.error('Failed to create note', {
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
        setTitle("")
        setDescription("")
        setReminderDate(undefined)
        setErrors({})
        setDropdownOpen(false)
    }

    const handleCancel = () => {
        resetForm()
        onOpenChange(false)
    }

    const validateNote = () => {
        try {
            const noteToValidate = {
                title,
                description,
                ...(reminderDate && { reminder_date: reminderDate.getTime() }), // Send milliseconds
            }

            const validatedNote = NoteSchema.parse(noteToValidate)
            setErrors({})
            return validatedNote
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                const newErrors: typeof errors = {
                    title: fieldErrors.title?.[0],
                    description: fieldErrors.description?.[0],
                    reminder_date: fieldErrors.reminder_date?.[0],
                };
                setErrors(newErrors)
            }
            return null
        }
    }

    const handleSubmit = () => {
        const validatedNote = validateNote()
        if (validatedNote) {
            createNoteMutation.mutate(validatedNote)
        }
    }

    const handleDateSelect = (date: Date | undefined) => {
        setReminderDate(date)
        setDropdownOpen(false)
    }

    const isDateDisabled = (date: Date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date <= today
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
                    <DialogTitle>Create New Note</DialogTitle>
                    <DialogDescription>
                        Add a new note with title, description, and an optional reminder date.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter note title"
                            className={cn(errors.title && "border-red-500")}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter note description"
                            className={cn("min-h-[100px]", errors.description && "border-red-500")}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label>Reminder Date (Optional)</Label>
                        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between text-left font-normal",
                                        errors.reminder_date && "border-red-500"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>{reminderDate ? format(reminderDate, "PPP") : "Select a date"}</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-auto p-0" align="center">
                                <Calendar
                                    mode="single"
                                    selected={reminderDate}
                                    onSelect={handleDateSelect}
                                    disabled={isDateDisabled}
                                    initialFocus
                                />
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {errors.reminder_date && (
                            <p className="text-sm text-red-500">{errors.reminder_date}</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={createNoteMutation.isPending}
                    >
                        {createNoteMutation.isPending ? "Creating..." : "Create Note"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}