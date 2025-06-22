import { useState } from "react";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";
import { isLastDayOfMonth, toLocalIsoString } from "@/lib/Time";

const CalendarDisplay = ({
  selectedDate,
  setSelectedDate,
  activeDates,
}: {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  activeDates: string[];
}) => {
  const [monthKey, setMonthKey] = useState<number>(Date.now());

  const isDateLogged = (date: Date) =>
    activeDates.includes(toLocalIsoString(date));

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={monthKey}
        initial={{ opacity: 0, scale: 0.9, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full max-w-[95vw] sm:max-w-md"
      >
        <Calendar
          onChange={(date) => {
            setSelectedDate(date as Date);
          }}
          value={selectedDate}
          showNeighboringMonth={false}
          calendarType="gregory"
          onActiveStartDateChange={({ activeStartDate }) => {
            if (activeStartDate) {
              setSelectedDate(activeStartDate);
              setMonthKey(Date.now());
            }
          }}
          className="react-calendar w-full bg-[#0f001f] text-pink-200 rounded-xl p-2 sm:p-4 border border-pink-500 shadow-[0_0_20px_#ff00ff] font-mono text-[12px] sm:text-base"
          tileClassName={({ date }) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected =
              selectedDate &&
              date.toDateString() === selectedDate.toDateString();
            const endMonth = isLastDayOfMonth(date);
            const day = date.getDay();

            const dayColor =
              day === 0
                ? "text-blue-400"
                : day === 5
                ? "text-green-400"
                : day === 6
                ? "text-purple-400"
                : "";

            return [
              "relative rounded-lg transition-all duration-150 px-1 py-[6px] sm:px-2 sm:py-1 text-xs sm:text-sm",
              isToday &&
                !isSelected &&
                "border border-white-1000 shadow-[0_0_50px_#00ffff] text-white",
              isSelected &&
                "bg-purple-400 text-black font-bold shadow-[0_0_12px_#00ffff] animate-bounce",
              endMonth && "text-yellow-400",
              dayColor,
            ]
              .filter(Boolean)
              .join(" ");
          }}
          tileContent={({ date }) =>
            isDateLogged(date) ? (
              <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full shadow-sm animate-pulse" />
            ) : null
          }
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default CalendarDisplay;
