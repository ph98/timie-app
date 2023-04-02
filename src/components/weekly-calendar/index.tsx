import dayjs, { Dayjs } from "dayjs";
import "./styles.scss";
import { useEffect, useState } from "react";

const weekdays = [...Array(7).keys()].map((i) =>
  dayjs().startOf("week").add(i, "day")
);
const hours = [...Array(18).keys()].map((i) => i + 6);


const WeeklyPicker = ({onChange}: any) => {
  const [selectedCells, setSelectedCells] = useState<any>([]);

  useEffect(()=>{
    onChange(selectedCells)
  }, [selectedCells])

  const [startNode, setStartNode] = useState<{
    day: Dayjs;
    hour: number;
  } | null>(null);
  
  const bulkToggle = (endNode: any) => {
    if (startNode && endNode) {
      const bulkHours = [startNode.hour, endNode.hour].sort((a, b) => a - b);
      const bulkDays = [startNode.day, endNode.day].sort((a, b) => a - b);

      const newCells: any = [];
      for (let hour = bulkHours[0]; hour <= bulkHours[1]; hour++) {
        for (
          let day = bulkDays[0];
          dayjs(day).subtract(1, "second").isBefore(bulkDays[1]);
          day = dayjs(day).add(1, "day")
        ) {
          newCells.push({ day, hour });
        }
      }

      setSelectedCells([
        ...selectedCells.filter((item: any) =>
          !newCells.some(
            ({ day, hour }: { day: Dayjs; hour: number }) =>
              item.hour === hour && dayjs(item.day).isSame(day, "day")
          )
        ),
        ...newCells.filter((item: any) =>
        !selectedCells.some(
          ({ day, hour }: { day: Dayjs; hour: number }) =>
            item.hour === hour && dayjs(item.day).isSame(day, "day")
        )),
      ]);
      setStartNode(null)
    }
  };
  return (
    <div className="weekly-picker">
      <div className="week-days">
        {weekdays.map((day) => (
          <div className="week-day-item">{day.format("dddd")}</div>
        ))}
      </div>
      <div className="hours">
        <div className="hour-row">
          {hours.map((hour) => (
            <div className="cell">{hour}</div>
          ))}
        </div>

        {weekdays.map((day) => (
          <div className="hour-row">
            {hours.map((hour) => (
              <div
                className={`cell ${
                  selectedCells.some(
                    (item: any) =>
                      dayjs(item.day).isSame(day, "day") && item.hour === hour
                  )
                    ? "selected"
                    : ""
                }`}
                
                onMouseDown={(e) => {
                  if (startNode !== null) {
                    // bulkToggle({day, hour})
                  } else {
                    setStartNode({ day, hour });
                  }
                }}
                onMouseUp={(e) => {
                  bulkToggle({ day, hour });
                }}
              >
                {hour}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPicker;
