import dayjs, { Dayjs } from "dayjs";
import "./styles.scss";
import { useEffect, useState } from "react";
import { Typography } from "antd";

const weekdays = [...Array(7).keys()].map((i) =>
  dayjs().startOf("week").add(i, "day")
);
const hours = [...Array(24).keys()];

const WeeklyPicker = ({ onChange }: any) => {
  const [selectedCells, setSelectedCells] = useState<any>([]);

  const [hovered, setHovered] = useState<any>(null);
  useEffect(() => {
    onChange(selectedCells);
  }, [selectedCells]);

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
        ...selectedCells.filter(
          (item: any) =>
            !newCells.some(
              ({ day, hour }: { day: Dayjs; hour: number }) =>
                item.hour === hour && dayjs(item.day).isSame(day, "day")
            )
        ),
        ...newCells.filter(
          (item: any) =>
            !selectedCells.some(
              ({ day, hour }: { day: Dayjs; hour: number }) =>
                item.hour === hour && dayjs(item.day).isSame(day, "day")
            )
        ),
      ]);
      setStartNode(null);
    }
  };

  console.log("startNode, hovered", startNode, hovered);
  return (
    <div className="weekly-picker">
      <div className="week-days">
        {weekdays.map((day) => (
          <div className="week-day-item">
            <Typography.Title level={3}>{day.format("dddd")}</Typography.Title>
            <Typography.Text>{day.format("MM/DD")}</Typography.Text>
          </div>
        ))}
      </div>
      <div
        className="hours"
        onMouseLeave={(e) => {
          setHovered(null);
        }}
      >
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
                } ${
                  hovered &&
                  ((dayjs(hovered.day).isSame(day, "day") &&
                    hovered.hour === hour) ||
                    (startNode &&
                      dayjs(day).isBetween(
                        hovered.day,
                        startNode?.day,
                        "day",
                        "[]"
                      ) &&
                      ((hovered.hour >= hour && startNode.hour <= hour) ||
                        (hovered.hour <= hour && startNode.hour >= hour))))
                    ? "hovered"
                    : ""
                } ${
                  selectedCells.some(
                    (item: any) =>
                      dayjs(item.day).isSame(day, "day") && item.hour === hour
                  ) &&
                  !selectedCells.some(
                    (item: any) =>
                      dayjs(item.day).isSame(day, "day") &&
                      item.hour === hour - 1
                  )
                    ? "first"
                    : ""
                } ${
                  !selectedCells.some(
                    (item: any) =>
                      dayjs(item.day).isSame(day, "day") &&
                      item.hour === hour + 1
                  ) &&
                  selectedCells.some(
                    (item: any) =>
                      dayjs(item.day).isSame(day, "day") && item.hour === hour
                  )
                    ? "last"
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
                onMouseEnter={(e) => {
                  setHovered({ day, hour });
                }}
                // onMouseLeave={(e) => {
                //   setHovered(null);
                // }}
              >
                <Typography.Text strong> {hour}</Typography.Text>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPicker;
