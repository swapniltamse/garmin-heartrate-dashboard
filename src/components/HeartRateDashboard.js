import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Scatter } from "recharts";
import { Card, CardContent } from "../components/ui/card"; 
import heartRateData from "../data/heartRateData.json"; // Importing JSON data

// Extract and format heart rate data
const processHeartRateData = (data) => {
  console.log("Raw JSON Data:", data);

  if (!Array.isArray(data) || data.length === 0) {
    console.error("Invalid heart rate data format", data);
    return [];
  }

  let allHeartRateValues = [];

  data.forEach((entry) => {
    if (entry.heart_rate && entry.heart_rate.heartRateValues) {
      entry.heart_rate.heartRateValues.forEach(([timestamp, heartRate]) => {
        allHeartRateValues.push({
          timestamp: new Date(timestamp).toLocaleString("en-US", {
            // year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          heartRate,
          highlight: heartRate > 120 ? heartRate : null, // Identify values above threshold
        });
      });
    }
  });

  allHeartRateValues.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort data in ascending order
  console.log("Processed Heart Rate Data (Sorted):", allHeartRateValues);
  return allHeartRateValues;
};

const formattedData = processHeartRateData(heartRateData);
const highlightPoints = formattedData.filter(d => d.highlight !== undefined); // Ensure we have data for highlighting
console.log("Highlight Points:", highlightPoints);

const HeartRateDashboard = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Heart Rate Analysis - {Array.isArray(heartRateData) ? heartRateData[0]?.date : "No Data"}</h2>

      <Card className="mb-6 p-4">
        <CardContent>
          <p className="text-lg">Max HR: {heartRateData[0]?.heart_rate?.maxHeartRate || "N/A"} bpm</p>
          <p className="text-lg">Min HR: {heartRateData[0]?.heart_rate?.minHeartRate || "N/A"} bpm</p>
          <p className="text-lg">Resting HR: {heartRateData[0]?.heart_rate?.restingHeartRate || "N/A"} bpm</p>
          <p className="text-lg">7-Day Avg Resting HR: {heartRateData[0]?.heart_rate?.lastSevenDaysAvgRestingHeartRate || "N/A"} bpm</p>
        </CardContent>
      </Card>

      {formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={formattedData}>
            {/* <XAxis dataKey="timestamp" angle={-45} textAnchor="end" height={50} /> */}
            <XAxis 
              dataKey="timestamp" 
              angle={-15} 
              textAnchor="end" 
              height={80} 
              interval={Math.ceil(formattedData.length / 6)} // Reduce the number of timestamps shown
            />
            <YAxis domain={[40, 150]} />
            <Tooltip />
            <Line type= "monotone" dataKey="heartRate" stroke="#3182CE" strokeWidth={1.5} dot= {false} />
            <ReferenceLine y={120} stroke="red" strokeDasharray="3 3" label="Threshold 120 bpm" />
            {/* <Scatter data={formattedData} dataKey="aboveThreshold" fill="red" shape="circle" /> */}
            <Scatter data={formattedData.filter(d => d.highlight)} dataKey="highlight" fill="red" shape="pentagon" />
          </LineChart>
        </ResponsiveContainer>  
      ) : (
        <p className="text-center text-red-500">No heart rate data available</p>
      )}
    </div>
  );
};

export default HeartRateDashboard;
