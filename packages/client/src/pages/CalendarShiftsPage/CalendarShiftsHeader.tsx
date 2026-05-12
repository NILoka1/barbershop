import { Select, Stack } from '@mantine/core'
import React from 'react'
import type { workersUpdateInput } from 'shared'

interface CalendarShiftsHeaderProps {
    workers: workersUpdateInput[],
    selectedWorker: string | null,
    setSelectedWorker: React.Dispatch<React.SetStateAction<string | null>>
}

const CalendarShiftsHeader = React.memo(({workers,selectedWorker,setSelectedWorker}: CalendarShiftsHeaderProps) => {
  return (
    <Stack>
        <Select
            label="Работник"
            placeholder="Выберите работника"
            data={workers.map((worker) => ({
                value: worker.id,
                label: worker.name,
            }))}
            value={selectedWorker}
            onChange={setSelectedWorker}
        />
    </Stack>
  )
})

export default CalendarShiftsHeader
