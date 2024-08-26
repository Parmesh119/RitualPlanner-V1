const { z } = require("zod");

const notesObject = z.object({
  person: z
    .string()
    .nonempty({ message: "Person name is required in which you will go for work." }),

  work: z
    .string()
    .nonempty({ message: "Work name is required." }),

  noteText: z
    .string()
    .nonempty({ message: "Note text is required." }),

  noteDate: z
    .preprocess((arg) => {
      return typeof arg === 'string' ? new Date(arg) : arg;
    }, z.date().refine((date) => !isNaN(date), {
      message: "Invalid date format.",
    })),

  reminderDate: z
    .preprocess((arg) => {
      return typeof arg === 'string' ? new Date(arg) : arg;
    }, z.date().refine((date) => !isNaN(date), {
      message: "Invalid reminder date format.",
    })),
});

module.exports = notesObject;
