import z from "zod";

export const shiftsInDate = z.object({
    startDate: z.string().datetime("Некорректная дата"),
    endDate: z.string().datetime("Некорректная дата") 
})