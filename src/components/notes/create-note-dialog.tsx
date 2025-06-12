import { useState, useEffect } from "react"
import { format, addDays } from "date-fns"
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { NoteSchema, type TNote } from "@/schemas/Note"
import { cn } from "@/lib/utils"
import { createNoteAction, updateNoteAction } from "@/lib/actions"

interface CreateNoteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mode?: 'create' | 'edit'
    note?: {
        id: string
        title: string
        description: string
        reminder_date?: number
    }
}

export function CreateNoteDialog({ open, onOpenChange, mode = 'create', note }: CreateNoteDialogProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [showReminderAlert, setShowReminderAlert] = useState(false)
    const [errors, setErrors] = useState<{
        title?: string
        description?: string
        reminder_date?: string
    }>({})

    useEffect(() => {
        if (mode === 'edit' && note) {
            setTitle(note.title)
            setDescription(note.description)
            setReminderDate(note.reminder_date ? new Date(note.reminder_date * 1000) : undefined)
        }
    }, [mode, note])

    const queryClient = useQueryClient()

    const createNoteMutation = useMutation({
        mutationFn: createNoteAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] })
            queryClient.invalidateQueries({ queryKey: ['note', note?.id] })
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

    const updateNoteMutation = useMutation({
        mutationFn: updateNoteAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] })
            queryClient.invalidateQueries({ queryKey: ['note', note?.id] })
            toast.success('Note updated successfully', {
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
            toast.error('Failed to update note', {
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
        if (mode === 'create') {
            setTitle("")
            setDescription("")
            setReminderDate(undefined)
        } else if (note) {
            setTitle(note.title)
            setDescription(note.description)
            setReminderDate(note.reminder_date ? new Date(note.reminder_date * 1000) : undefined)
        }
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
                ...(mode === 'edit' && note ? { id: note.id } : {}),
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
            if (mode === 'create' && !reminderDate) {
                setShowReminderAlert(true)
            } else {
                submitNote(validatedNote)
            }
        }
    }

    const submitNote = (validatedNote: TNote) => {
        if (mode === 'edit') {
            updateNoteMutation.mutate(validatedNote)
        } else {
            createNoteMutation.mutate(validatedNote)
        }
    }

    const handleReminderAlertResponse = (setDefaultReminder: boolean) => {
        if (setDefaultReminder) {
            const defaultReminderDate = addDays(new Date(), 7)
            setReminderDate(defaultReminderDate)
            const noteWithReminder = {
                ...validateNote()!,
                reminder_date: defaultReminderDate.getTime()
            }
            submitNote(noteWithReminder)
        } else {
            setDropdownOpen(true)
        }
        setShowReminderAlert(false)
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
        <>
            <Dialog open={open} onOpenChange={(isOpen) => {
                if (!isOpen) {
                    resetForm()
                }
                onOpenChange(isOpen)
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{mode === 'create' ? 'Create New Note' : 'Edit Note'}</DialogTitle>
                        <DialogDescription>
                            {mode === 'create'
                                ? 'Add a new note with title, description, and an optional reminder date.'
                                : 'Update your note details below.'}
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
                            disabled={createNoteMutation.isPending || updateNoteMutation.isPending}
                        >
                            {createNoteMutation.isPending || updateNoteMutation.isPending
                                ? (mode === 'create' ? "Creating..." : "Updating...")
                                : (mode === 'create' ? "Create Note" : "Update Note")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showReminderAlert} onOpenChange={setShowReminderAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Set a Reminder?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Would you like to set a default reminder for 7 days from now? You can also choose a different date.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => handleReminderAlertResponse(false)}>
                            Choose Different Date
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleReminderAlertResponse(true)}>
                            Set 7-Day Reminder
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}