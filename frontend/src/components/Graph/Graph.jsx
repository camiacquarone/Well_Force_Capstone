import React, { useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, startOfWeek, addDays } from "date-fns";
import { CaloriesContext } from "../CalorieTracker/CaloriesContext.jsx";
import "./Graph.css";

const Graph = () => {
  const { caloriesByDay } = useContext(CaloriesContext);

  // gets the Monday of the current week
  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const monday = startOfWeek(todayMidnight, { weekStartsOn: 1 });

  // creates Mon–Fri dates of this week
  const weekDates = Array.from({ length: 5 }, (_, i) => addDays(monday, i));

  const chartData = weekDates.map((date) => {
    const key = format(date, "yyyy-MM-dd"); 
    return {
      name: format(date, "EEE, MMM d"), 
      Calories: caloriesByDay[key] || 0, 
    };
  });

  return (
    <div className="graph">
      <h3 className="graph-title">CALORIE TRACKER</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e0e0e0"
          />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            label={{
              value: "Calories",
              angle: -90,
              position: "insideLeft",
              dy: 20,
              dx: -10,
              fill: "#666",
              fontSize: 20,
              fontFamily: "Regular",
            }}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            formatter={(value) => (isNaN(value) ? "0" : value)}
            labelStyle={{ fontSize: "16px", fontWeight: "bold" }}
          />
          <Bar dataKey="Calories" fill="#0a7aaa" radius={[0, 0, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
