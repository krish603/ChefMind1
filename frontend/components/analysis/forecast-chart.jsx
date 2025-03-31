// ForecastChart.jsx
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card"
import { forecast } from "@/src/actions/graphActions";;

const ForecastChart = ({ item, timeframe, isClient }) => {
  // State for forecast data
  const [forecastData, setForecastData] = useState([]);
  const [metrics, setMetrics] = useState({ mae: 0, rmse: 0 });
  
  // Simulate API fetch with the provided dummy data
  useEffect(() => {
    // This would be replaced with your actual API call
    const fetchForecastData = async() => {
      // Dummy data from your JSON
      // const dummyResponse = {
      //   "ingredient": "Tomatoes",
      //   "forecast": [
      //     { "Date": "2024-08-08", "Ingredient": "Tomatoes", "Predicted_Demand": 26 },
      //     { "Date": "2024-08-09", "Ingredient": "Tomatoes", "Predicted_Demand": 26 },
      //     { "Date": "2024-08-10", "Ingredient": "Tomatoes", "Predicted_Demand": 33 },
      //     { "Date": "2024-08-11", "Ingredient": "Tomatoes", "Predicted_Demand": 32 },
      //     { "Date": "2024-08-12", "Ingredient": "Tomatoes", "Predicted_Demand": 26 },
      //     { "Date": "2024-08-13", "Ingredient": "Tomatoes", "Predicted_Demand": 26 },
      //     { "Date": "2024-08-14", "Ingredient": "Tomatoes", "Predicted_Demand": 26 },
      //     { "Date": "2024-08-15", "Ingredient": "Tomatoes", "Predicted_Demand": 26 },
      //     { "Date": "2024-08-16", "Ingredient": "Tomatoes", "Predicted_Demand": 26 },
      //     { "Date": "2024-08-17", "Ingredient": "Tomatoes", "Predicted_Demand": 32 },
      //     { "Date": "2024-08-18", "Ingredient": "Tomatoes", "Predicted_Demand": 32 },
      //     { "Date": "2024-08-19", "Ingredient": "Tomatoes", "Predicted_Demand": 26 },
      //     { "Date": "2024-08-20", "Ingredient": "Tomatoes", "Predicted_Demand": 25 },
      //     { "Date": "2024-08-21", "Ingredient": "Tomatoes", "Predicted_Demand": 25 },
      //     { "Date": "2024-08-22", "Ingredient": "Tomatoes", "Predicted_Demand": 26 },
      //     { "Date": "2024-08-23", "Ingredient": "Tomatoes", "Predicted_Demand": 25 },
      //     { "Date": "2024-08-24", "Ingredient": "Tomatoes", "Predicted_Demand": 32 },
      //     { "Date": "2024-08-25", "Ingredient": "Tomatoes", "Predicted_Demand": 32 },
      //     { "Date": "2024-08-26", "Ingredient": "Tomatoes", "Predicted_Demand": 26 },
      //     { "Date": "2024-08-27", "Ingredient": "Tomatoes", "Predicted_Demand": 25 },
      //     { "Date": "2024-08-28", "Ingredient": "Tomatoes", "Predicted_Demand": 25 },
      //     { "Date": "2024-08-29", "Ingredient": "Tomatoes", "Predicted_Demand": 26 },
      //     { "Date": "2024-08-30", "Ingredient": "Tomatoes", "Predicted_Demand": 25 },
      //     { "Date": "2024-08-31", "Ingredient": "Tomatoes", "Predicted_Demand": 32 },
      //     { "Date": "2024-09-01", "Ingredient": "Tomatoes", "Predicted_Demand": 32 },
      //     { "Date": "2024-09-02", "Ingredient": "Tomatoes", "Predicted_Demand": 27 },
      //     { "Date": "2024-09-03", "Ingredient": "Tomatoes", "Predicted_Demand": 25 },
      //     { "Date": "2024-09-04", "Ingredient": "Tomatoes", "Predicted_Demand": 25 },
      //     { "Date": "2024-09-05", "Ingredient": "Tomatoes", "Predicted_Demand": 26 },
      //     { "Date": "2024-09-06", "Ingredient": "Tomatoes", "Predicted_Demand": 26 }
      //   ],
      //   "metrics": {
      //     "mae": 2.80844837697304,
      //     "rmse": 3.81810344533877
      //   }
      // };
      

      const result= await forecast(item);
      
      if (result && result.success) {
        const dummyResponse = result.data;
      setForecastData(dummyResponse.forecast);
      setMetrics(dummyResponse.metrics);
    };}
    
    fetchForecastData();
  }, [item]);
   
  
  // Process data based on timeframe
  const getProcessedData = () => {
    if (!forecastData.length) return { labels: [], values: [] };
    
    // For display purposes, we'll filter the data based on timeframe
    let filteredData = [];
    
    switch(timeframe) {
      case 'daily':
        // Show the next 7 days for daily view
        filteredData = forecastData.slice(0, 7);
        break;
      case 'weekly':
        // Group by week and take the average
        const weeklyData = [];
        for (let i = 0; i < 4 && i * 7 < forecastData.length; i++) {
          const weekSlice = forecastData.slice(i * 7, (i + 1) * 7);
          if (weekSlice.length) {
            const avgDemand = weekSlice.reduce((sum, day) => sum + day.Predicted_Demand, 0) / weekSlice.length;
            const startDate = new Date(weekSlice[0].Date);
            weeklyData.push({
              WeekName: `Week ${i+1}`,
              StartDate: startDate,
              Predicted_Demand: avgDemand
            });
          }
        }
        filteredData = weeklyData;
        break;
      case 'monthly':
        // Group by month
        const monthMap = {};
        forecastData.forEach(item => {
          const date = new Date(item.Date);
          const monthKey = `${date.getFullYear()}-${date.getMonth()+1}`;
          if (!monthMap[monthKey]) {
            monthMap[monthKey] = {
              total: 0,
              count: 0,
              month: date.toLocaleString('default', { month: 'long' }),
              year: date.getFullYear()
            };
          }
          monthMap[monthKey].total += item.Predicted_Demand;
          monthMap[monthKey].count++;
        });
        
        filteredData = Object.values(monthMap).map(month => ({
          MonthName: month.month,
          Predicted_Demand: month.total / month.count
        }));
        break;
      case 'yearly':
        // Not enough data for yearly, so we'll just use monthly data
        filteredData = forecastData;
        break;
      default:
        filteredData = forecastData;
    }
    
    // Format the data for the chart
    if (timeframe === 'weekly') {
      return {
        labels: filteredData.map(d => d.WeekName),
        values: filteredData.map(d => d.Predicted_Demand)
      };
    } else if (timeframe === 'monthly') {
      return {
        labels: filteredData.map(d => d.MonthName),
        values: filteredData.map(d => d.Predicted_Demand)
      };
    } else {
      // Default to daily
      return {
        labels: filteredData.map(d => {
          const date = new Date(d.Date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        values: filteredData.map(d => d.Predicted_Demand)
      };
    }
  };
  
  const { labels, values } = getProcessedData();
  
  // Calculate forecast insights
  const avgForecast = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  const maxForecast = values.length ? Math.max(...values) : 0;
  const minForecast = values.length ? Math.min(...values) : 0;
  const maxIndex = values.indexOf(maxForecast);
  const minIndex = values.indexOf(minForecast);
  
  const getHighForecastPeriod = () => {
    if (!labels.length) return 'N/A';
    return labels[maxIndex];
  };
  
  const getLowForecastPeriod = () => {
    if (!labels.length) return 'N/A';
    return labels[minIndex];
  };
  
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Forecast (Units)`,
        data: values,
        borderColor: "#255653", // chefmind-teal
        backgroundColor: "rgba(37, 86, 83, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "#255653",
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  // Get accuracy level text based on MAE
  const getAccuracyLevel = (mae) => {
    if (mae < 2) return "High accuracy";
    if (mae < 4) return "Good accuracy";
    if (mae < 6) return "Moderate accuracy";
    return "Low accuracy";
  };
  
  return (
    <Card className="shadow-xl border border-chefmind-teal/30 bg-white rounded-xl overflow-hidden transform transition-transform hover:shadow-2xl">
      <div className="bg-gradient-to-r from-chefmind-teal/90 to-chefmind-teal/70 p-3 md:p-4 flex justify-between items-center">
        <h3 className="text-lg md:text-xl font-semibold text-white">Demand Forecast</h3>
        <div className="bg-white/20 text-white text-xs md:text-sm px-3 py-1 rounded-full font-medium shadow-inner">
          Next {timeframe === 'daily' ? '7 days' : timeframe === 'weekly' ? '4 weeks' : '30 days'}
        </div>
      </div>
      <CardContent className="p-4 md:p-6">
        <div className="h-64 md:h-72">
          {isClient && (
            <Line
              data={chartData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                    labels: {
                      boxWidth: 12,
                      usePointStyle: true,
                      font: { size: 13 },
                    },
                  },
                  tooltip: {
                    backgroundColor: "rgba(37, 86, 83, 0.8)", // chefmind-teal
                    titleFont: { size: 14, weight: "bold" },
                    bodyFont: { size: 13 },
                    padding: 10,
                    cornerRadius: 8,
                  },
                  title: {
                    display: true,
                    text: `Future Demand Forecast`,
                    font: { size: 16 },
                    color: "#255653",
                    padding: { bottom: 15 },
                  },
                },
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: "Forecast Demand (Units)",
                      font: { weight: "bold" },
                    },
                    ticks: {
                      color: "#255653",
                      font: { size: 12 },
                    },
                    grid: { color: "rgba(37, 86, 83, 0.1)" },
                    beginAtZero: true,
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Date",
                      font: { weight: "bold" },
                    },
                    ticks: {
                      color: "#255653",
                      font: { size: 12 },
                    },
                    grid: {
                      color: "rgba(37, 86, 83, 0.1)",
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    tension: 0.3,
                  },
                },
              }}
            />
          )}
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* Forecast Insights */}
          <div className="bg-chefmind-teal/5 p-4 rounded-lg border border-chefmind-teal/10">
            <h4 className="font-semibold text-chefmind-teal mb-2">
              Forecast Insights:
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • Avg. forecast demand:{" "}
                <span className="font-medium">{avgForecast.toFixed(1)} units</span>
              </li>
              <li>
                • Peak demand period:{" "}
                <span className="font-medium">
                  {getHighForecastPeriod()} ({maxForecast.toFixed(1)} units)
                </span>
              </li>
              <li>
                • Lowest demand period:{" "}
                <span className="font-medium">
                  {getLowForecastPeriod()} ({minForecast.toFixed(1)} units)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastChart;