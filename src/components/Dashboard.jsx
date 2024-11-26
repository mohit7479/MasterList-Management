import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  fetchItems,
  fetchBillOfMaterials,
  fetchProcesses,
  fetchProcessSteps,
} from "../services/api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [itemsCount, setItemsCount] = useState(0);
  const [bomsCount, setBomsCount] = useState(0);
  const [processesCount, setProcessesCount] = useState(0);
  const [processStepsCount, setProcessStepsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          itemsResponse,
          bomsResponse,
          processesResponse,
          processStepsResponse,
        ] = await Promise.all([
          fetchItems(),
          fetchBillOfMaterials(),
          fetchProcesses(),
          fetchProcessSteps(),
        ]);
        setItemsCount(itemsResponse.data.length);
        setBomsCount(bomsResponse.data.length);
        setProcessesCount(processesResponse.data.length);
        setProcessStepsCount(processStepsResponse.data.length);
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const pieData = [
    { name: "Items", value: itemsCount },
    { name: "BOMs", value: bomsCount },
    { name: "Processes", value: processesCount },
    { name: "Process Steps", value: processStepsCount },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const barData = [
    { name: "Items", count: itemsCount },
    { name: "BOMs", count: bomsCount },
    { name: "Processes", count: processesCount },
    { name: "Process Steps", count: processStepsCount },
  ];

  if (isLoading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Data Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Data Counts</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
