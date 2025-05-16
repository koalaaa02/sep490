import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BASE_URL } from "../../../../Utils/config";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProviderPeriod = () => {
  const [data, setData] = useState<Record<string, number>>({});
  const currentDate = new Date();
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const token = sessionStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          month: month.toString(),
          sellerId: "2",
          year: year.toString(),
        });

        const response = await fetch(
          `${BASE_URL}/api/provider/statistics/order/period?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year, month, token]);

  const chartData = {
    labels: Object.keys(data).map((day) => `${day}/${month}`),
    datasets: [
      {
        label: "Số đơn",
        data: Object.values(data),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Số đơn trong ${month}/${year}`,
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số lượng đơn",
        },
      },
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
      },
    },
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="p-4 w-100 bg-white">
      <div className="mb-4">
        <h4 className="mb-3">Số liệu đơn theo ngày</h4>
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="month" className="form-label">
              Tháng
            </label>
            <select
              id="month"
              className="form-select"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="year" className="form-label">
              Năm
            </label>
            <select
              id="year"
              className="form-select"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div
        className="w-100 text-center chart-container"
        style={{ height: "400px" }}
      >
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ProviderPeriod;
