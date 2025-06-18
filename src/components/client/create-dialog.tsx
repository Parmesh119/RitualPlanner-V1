import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClientAction, updateClientAction } from "@/lib/actions";
import { indianStatesAndUTs } from "@/util/state";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClientSchema, type TClient } from "@/schemas/Client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ClientDialogProps {
    children: React.ReactNode;
    client?: TClient;
    mode?: 'create' | 'edit';
}

type ClientFormData = Omit<TClient, 'id' | 'createdAt' | 'updatedAt'>;

export function ClientDialog({ children, client, mode = 'create' }: ClientDialogProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<ClientFormData>({
        resolver: zodResolver(ClientSchema.omit({ id: true, createdAt: true, updatedAt: true })),
        defaultValues: {
            name: "",
            description: "",
            email: "",
            phone: "",
            city: "",
            state: "",
            zipcode: "",
        },
    });

    // Reset form when dialog opens/closes or client data changes
    useEffect(() => {
        if (open && client) {
            form.reset({
                name: client.name,
                description: client.description || "",
                email: client.email || "",
                phone: client.phone,
                city: client.city,
                state: client.state,
                zipcode: client.zipcode || "",
            });
        } else if (!open) {
            form.reset();
        }
    }, [open, client, form]);

    const { mutate: createClient, isPending: isCreating } = useMutation({
        mutationFn: createClientAction,
        onSuccess: () => {
            toast.success("Client created successfully", {
                description: "The client has been added to the list.",
                style: {
                    background: "linear-gradient(90deg, #38A169, #2F855A)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            });
            queryClient.invalidateQueries({ queryKey: ["clients"] });
            handleClose();
        },
        onError: (error) => {
            toast.error("Failed to create client", {
                description: error.message || "Something went wrong. Please try again.",
                style: {
                    background: "linear-gradient(90deg, #E53E3E, #C53030)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            });
        },
    });

    const { mutate: updateClient, isPending: isUpdating } = useMutation({
        mutationFn: updateClientAction,
        onSuccess: () => {
            toast.success("Client updated successfully", {
                description: "The client information has been updated.",
                style: {
                    background: "linear-gradient(90deg, #38A169, #2F855A)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            });
            queryClient.invalidateQueries({ queryKey: ["clients"] });
            queryClient.invalidateQueries({ queryKey: ["client", client?.id] });
            handleClose();
        },
        onError: (error) => {
            toast.error("Failed to update client", {
                description: error.message || "Something went wrong. Please try again.",
                style: {
                    background: "linear-gradient(90deg, #E53E3E, #C53030)",
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "13px",
                    letterSpacing: "1px",
                }
            });
        },
    });

    const handleClose = () => {
        setOpen(false);
        form.reset();
    };

    const onSubmit = (data: ClientFormData) => {
        if (mode === 'create') {
            createClient({
                ...data,
                id: crypto.randomUUID(),
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        } else if (mode === 'edit' && client) {
            updateClient({
                ...data,
                id: client.id,
                createdAt: client.createdAt,
                updatedAt: Date.now(),
            });
        }
    };

    const isPending = isCreating || isUpdating;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Add New Client' : 'Edit Client'}</DialogTitle>
                    <DialogDescription>
                        Fill in the client details below. Fields marked with <span className="text-red-600">*</span> are required.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter client name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter client description"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter client email"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter 10-digit phone number"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City <span className="text-red-600">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter city" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State <span className="text-red-600">*</span></FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a state" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {indianStatesAndUTs.map((state) => (
                                                <SelectItem key={state} value={state}>
                                                    {state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="zipcode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Zipcode</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter 6-digit zipcode"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (mode === 'create' ? "Adding..." : "Updating...") : (mode === 'create' ? "Add Client" : "Update Client")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}