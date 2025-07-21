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

const mockProteinTrackerData = [
  { name: "Mon", protein: 30 },
  { name: "Tue", protein: 20 },
  { name: "Wed", protein: 25 },
  { name: "Thu", protein: 0 },
  { name: "Fri", protein: 0 },
];

const Graph = () => {
  return (
    <div className="graph">
      <h3 className="graph-title">PROTEIN TRACKER</h3>
      {mockProteinTrackerData && mockProteinTrackerData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={mockProteinTrackerData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e0e0e0"
            />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "transparent" }} />
            <Bar dataKey="protein" fill="#0a7aaa" radius={[0, 0, 0, 0]} />{" "}
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
