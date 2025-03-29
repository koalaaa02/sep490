import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../../Utils/config";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TopSellingProduct = () => {
  const [data, setData] = useState<Record<string, number>>({});
  const [limit, setLimit] = useState<number>(5);
  const [isMostSold, setIsMostSold] = useState(true);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          isMostSold: isMostSold.toString(),
        });

        const response = await fetch(
          `${BASE_URL}/api/provider/statistics/product/top-selling?${params.toString()}`,
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
  }, [token, limit, isMostSold]);

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Quantity Sold",
        data: Object.values(data),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
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
        text: "Top Selling Products",
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
          text: "Quantity Sold",
        },
      },
      x: {
        title: {
          display: true,
          text: "Product Names",
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="mb-4">
        <h3 className="mb-3">Top Selling Products</h3>
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="limit" className="form-label">
              Number of Products
            </label>
            <input
              type="number"
              id="limit"
              className="form-control"
              min="1"
              max="20"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
            />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="isMostSold"
                checked={isMostSold}
                onChange={(e) => setIsMostSold(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="isMostSold">
                Show Most Sold
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container" style={{ height: "400px" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TopSellingProduct;
