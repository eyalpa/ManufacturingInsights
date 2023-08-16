import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';
import moment from 'moment';
const ChartComponent = ({ data = {} }) => {
  const [bucket, setBucket] = useState('day');
  const [processedLabels, setProcessedLabels] = useState([]);

  // Register required components for chart.js
  Chart.register(LinearScale);
  Chart.register(CategoryScale);
  Chart.register(PointElement);
  Chart.register(LineElement);

  useEffect(() => {
    const newData = data;
    if (!newData) return;
    const processByBucket = (bucketType) => {
      switch (bucketType) {
        case 'hour':
          // For hour, you might only want the hour component
          return newData.map(item => moment(item.TEST_DATE).format('YYYY-MM-DDTHH'));
        case 'day':
          // For day, you might only want YYYY-MM-DD
          return newData.map(item => moment(item.TEST_DATE).format('YYYY-MM-DD'));
        case 'week':
          // For week, get the week number
          return newData.map(item => moment(item.TEST_DATE).format('GGGG-[W]WW'));
        case 'month':
          // For month, you might only want YYYY-MM
          return newData.map(item => moment(item.TEST_DATE).format('YYYY-MM'));
        default:
          return [];
      }
    };


    setProcessedLabels(processByBucket(bucket));
  }, [data, bucket]);
  if (!processedLabels.length) return (<div>No data for charts</div>);
  const chartData = {
    labels: processedLabels,
    datasets: [
      {
        label: 'Yield over Time',
        data: data.map(item => item.PASS) || [],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      }
    ],
  };

  // ... rest of the component ...

  return (
    <div style={{ height: '30vh' }}>
      <select value={bucket} onChange={(e) => setBucket(e.target.value)}>
        <option value="hour">Hourly</option>
        <option value="day">Daily</option>
        <option value="week">Weekly</option>
        <option value="month">Monthly</option>
      </select>
      <Line data={chartData} />
    </div>
  );
};

export default ChartComponent;
