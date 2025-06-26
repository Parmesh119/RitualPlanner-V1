import { createFileRoute } from '@tanstack/react-router'
import { getNoteByIdAction } from '@/lib/actions';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Calendar, Clock, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateNoteDialog } from "@/components/notes/create-note-dialog";
import { useState } from "react";
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/app/notes/note/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      noteId: params.id,
    };
  },
})

function RouteComponent() {
  const { noteId } = Route.useLoaderData();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNoteByIdAction(noteId)
  });

  if (isLoading) {
    return (
      <SidebarInset className='w-full'>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-pulse text-muted-foreground">Loading note...</div>
        </div>
      </SidebarInset>
    );
  }

  if (!note) {
    return (
      <SidebarInset className='w-full'>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-destructive">Note not found</div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset className='w-full'>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4 tracking-wider">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to={"/app/notes"}><BreadcrumbLink>Notes</BreadcrumbLink></Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{note.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-6 px-4 md:px-8 py-6">
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">{note.title}</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit Note
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground justify-between">
              {note.reminder_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Reminder Date: {format(new Date(note.reminder_date * 1000), "PPP")}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Created Date: {format(new Date(note.createdAt * 1000), "PPP")}</span>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold">Note Content</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {note.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateNoteDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        note={note}
      />
    </SidebarInset>
  );
}
