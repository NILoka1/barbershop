import { trpc } from "../../main";
import type { ShiftFromDB } from "shared";

export function useCreateShift() {
  const utils = trpc.useUtils();
  
  return trpc.shifts.createShift.useMutation({
    onMutate: async (newShift) => {
      await utils.shifts.getInDateRange.cancel();
      
      const previousShifts = utils.shifts.getInDateRange.getData();
      
      const tempShift: ShiftFromDB = {
        id: `temp-${Date.now()}`,
        startTime: new Date(newShift.startDate),
        endTime: new Date(newShift.endDate),
        worker: {
          id: newShift.worker,
          name: 'Загрузка...',  
          email: '',
          phone: null,
          isAdmin: false,
        },
      };
      
      utils.shifts.getInDateRange.setData(
        { startDate: '', endDate: '' },  // 👈 нужно передать реальные даты
        (old) => old ? [...old, tempShift] : [tempShift]
      );
      
      return { previousShifts };
    },
    
    onError: (err, newShift, context) => {
      utils.shifts.getInDateRange.setData(
        { startDate: '', endDate: '' },
        context?.previousShifts
      );
    },
    
    onSettled: () => {
      utils.shifts.getInDateRange.invalidate();
    },
  });
}