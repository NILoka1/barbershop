import z from "zod";

export const shiftsInDate = z.object({
    startDate: z.string().datetime("Некорректная дата"),
    endDate: z.string().datetime("Некорректная дата") 
})

export const addShift = z.object({
    startDate: z.string().datetime("Некорректная дата"),
    endDate: z.string().datetime("Некорректная дата"), 
    worker: z.string()
})