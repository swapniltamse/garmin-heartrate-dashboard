import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent } from "../components/ui/card"; 
import heartRateData from "../data/heartRateData.json"; // Importing JSON data

const processHeartRateData = (data, selectedDate) => {
  console.log("Raw JSON Data:", data);

  if (!Array.isArray(data) || data.length === 0) {
    console.error("Invalid heart rate data format", data);
    return [];
  }

  if (selectedDate === "all") {
    return data.flatMap(entry =>
      entry.heart_rate?.heartRateValues?.map(([timestamp, heartRate]) => ({
        timestamp: new Date(timestamp).toLocaleString("en-US", {
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        heartRate,
        highlight: heartRate > 120,
      })) || []
    );
  }

  let selectedData = data.find(entry => entry.date === selectedDate);
  if (!selectedData) return [];

  let allHeartRateValues = [];

  if (selectedData.heart_rate && selectedData.heart_rate.heartRateValues) {
    selectedData.heart_rate.heartRateValues.forEach(([timestamp, heartRate]) => {
      allHeartRateValues.push({
        timestamp: new Date(timestamp).toLocaleString("en-US", {
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        heartRate,
        highlight: heartRate > 120,
      });
    });
  }

  allHeartRateValues.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  console.log("Processed Heart Rate Data (Sorted):", allHeartRateValues);
  return allHeartRateValues;
};

const DateSelector = ({ selectedDate, setSelectedDate }) => (
  <select
    className="p-2 border rounded"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
  >
    <option value="all">All Dates</option>
    {heartRateData.map(entry => (
      <option key={entry.date} value={entry.date}>{entry.date}</option>
    ))}
  </select>
);

const HeartRateDashboard = () => {
  const [selectedDate, setSelectedDate] = useState("all");
  const formattedData = processHeartRateData(heartRateData, selectedDate);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Heart Rate Analysis</h2>
        <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>

      <Card className="mb-6 p-4">
        <CardContent>
          <p className="text-lg">Max HR: {formattedData.length > 0 ? Math.max(...formattedData.map(d => d.heartRate)) || "N/A" : "N/A"} bpm</p>
          <p className="text-lg">Min HR: {formattedData.length > 0 ? Math.min(...formattedData.map(d => d.heartRate)) || "N/A" : "N/A"} bpm</p>
        </CardContent>
      </Card>

      {formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))}>
            <XAxis 
              dataKey="timestamp" 
              angle={-25} 
              textAnchor="end" 
              height={80} 
              interval={Math.ceil(formattedData.length / 6)}
            />
            <YAxis domain={[10, 150]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="heartRate" 
              stroke="#3182CE" 
              strokeWidth={2} 
              dot={(data) => data.heartRate > 120 ? { r: 5, fill: "red" } : false}
            />
            <ReferenceLine y={120} stroke="red" strokeDasharray="3 3" label="Threshold 120 bpm" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-red-500">No heart rate data available for the selected date</p>
      )}
    </div>
  );
};

export default HeartRateDashboard;
