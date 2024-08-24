// src/components/LineGraph.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components for the line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineGraphProps {
  data: any;
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
  return (
    <Line data={data} options={{ responsive: true }} />
  );
};

export default LineGraph;
