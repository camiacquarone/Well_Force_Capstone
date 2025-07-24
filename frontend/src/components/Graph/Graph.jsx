import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./Graph.css";

const mockCalorieTrackerData = [
  { name: "Mon", calories: 1000 },
  { name: "Tue", calories: 2000 },
  { name: "Wed", calories: 1250 },
  { name: "Thu", calories: 0 },
  { name: "Fri", calories: 0 },
];

const Graph = () => {
  return (
    <div className="graph">
      <h3 className="graph-title">CALORIE TRACKER</h3>
      {mockCalorieTrackerData && mockCalorieTrackerData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockCalorieTrackerData}
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
                value: "calories",
                angle: -90,
                position: "insideLeft",
                dy: 20,
                dx: -10,
                fill: "#666",
                fontSize: 20,
                fontFamily: "Regular",
              }}
            />
            <Tooltip cursor={{ fill: "transparent" }} />
            <Bar dataKey="calories" fill="#0a7aaa" radius={[0, 0, 0, 0]} />{" "}
            {/* Teal color */}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-sm">No protein data available.</p>
      )}
    </div>
  );
};

export default Graph;
