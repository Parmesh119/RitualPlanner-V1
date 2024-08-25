const { z } = require("zod")

const notesObject = z.object({
    person: z
    .string({required_error:"Person name is required in which you will going for work."}),

    work: z
    .string({required_error: "Work name is required."}),
    
    noteDate: z
    .date({required_error: "Date is required."}),

    reminderDate: z
    .date({required_error: "Reminder Date is required."}),

})

module.exports = notesObject