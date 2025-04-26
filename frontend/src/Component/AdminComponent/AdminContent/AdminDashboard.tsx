import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import classNames from "classnames";
import { Bar, Pie, PolarArea, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js"; // Import required elements
import { BASE_URL } from "../../../Utils/config";

// Register the elements you need from Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement
);
const AdminDashboard = () => {
  const token = localStorage.getItem("access_token");
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    const fetchFromApis = async () => {
      const apiEndpoints = [
        `${BASE_URL}/api/admin/statistics/users`,
        `${BASE_URL}/api/admin/statistics/users/roles`,
        `${BASE_URL}/api/admin/statistics/users/new`,
        `${BASE_URL}/api/admin/statistics/shops`,
        `${BASE_URL}/api/admin/statistics/shops/new`,
        `${BASE_URL}/api/admin/statistics/revenue?month=${month}&year=${year}`,
      ];

      try {
        const responses = await Promise.all(
          apiEndpoints.map((endpoint) =>
            fetch(endpoint, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              credentials: "include",
            })
          )
        );

        const results = await Promise.all(
          responses.map((response) => response.json())
        );
        setData(results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFromApis();
  }, [year, month]);
  // console.log(Object.values(data[3]).slice(0, -1));

  return (
    <div className={classNames("py-2", styles.adminDashBoardContainer)}>
      <h2 className="text-center m-3">Thống kê</h2>
      <div className="d-flex align-items-center gap-3 justify-content-between">
        <div className={styles.leftSideCharts}>
          <div className="d-flex align-items-center gap-2">
            <div
              className={classNames(
                "col-4 d-flex flex-column align-items-center justify-content-center",
                styles.itemsChart
              )}
            >
              <span className={styles.title}>Tổng Thu Nhập Tháng</span>
              <span className="d-flex gap-2 mt-2">
                <select
                  className="form-select form-select-sm"
                  style={{ width: "100px" }}
                  onChange={(e) => setMonth(e.target.value)}
                  defaultValue={new Date().getMonth() + 1} // Months are 0-indexed in JS
                >
                  <option value="">Tháng</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select form-select-sm"
                  style={{ width: "100px" }}
                  onChange={(e) => setYear(e.target.value)}
                  defaultValue={new Date().getFullYear()}
                >
                  <option value="">Năm</option>
                  {Array.from(
                    { length: 10 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </span>
              <span className={classNames(styles.amount, "text-success")}>
                {typeof data[6] === "number"
                  ? `${data[6].toLocaleString()}đ`
                  : "0đ"}
              </span>
            </div>
            <div
              className={classNames(
                "col-4 d-flex flex-column align-items-center justify-content-center",
                styles.itemsChart
              )}
            >
              <span className={styles.title}>Số nhà cung cấp mới</span>
              <span className={classNames(styles.amount, "text-danger")}>
                {data[5]}
              </span>
            </div>
            <div
              className={classNames(
                "col-4 d-flex flex-column align-items-center justify-content-center",
                styles.itemsChart
              )}
            >
              <span className={styles.title}>Số người dùng mới</span>
              <span className={classNames(styles.amount, "text-success")}>
                {data[2]}
              </span>
            </div>
          </div>
          <div className="d-flex  gap-2">
            <div className={classNames("col-4", styles.lowerItemsChart)}>
              <div className={styles.chart}>
                <Pie
                  data={{
                    labels: ["Người dùng", "Nhà cung cấp", "Quản trị viên"],
                    datasets: [
                      {
                        data: (data && data[1] && Object.values(data[1])) || [], // Values from the data object
                        backgroundColor: [
                          "rgba(255, 182, 193, 0.5)",
                          "rgba(173, 216, 230, 0.5)",
                          "rgba(144, 238, 144, 0.5)",
                        ],
                        borderColor: [
                          "rgba(255, 182, 193, 1)",
                          "rgba(173, 216, 230, 1)",
                          "rgba(144, 238, 144, 1)",
                        ],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: false, // Hide the legend
                      },
                      title: {
                        display: true,
                        text: "Biểu đồ người dùng theo role",
                        font: {
                          size: 14,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className={classNames("col-4", styles.lowerItemsChart)}>
              <div className={styles.chart}>
                <Pie
                  data={{
                    labels: ["Đang hoạt động", "Đã đóng"],
                    datasets: [
                      {
                        data:
                          (data &&
                            data[1] &&
                            Object.values(data[3]).slice(0, -1)) ||
                          [], // Values from the data object
                        backgroundColor: [
                          "rgba(255, 182, 193, 0.5)",
                          "rgba(173, 216, 230, 0.5)",
                          "rgba(144, 238, 144, 0.5)",
                        ],
                        borderColor: [
                          "rgba(255, 182, 193, 1)",
                          "rgba(173, 216, 230, 1)",
                          "rgba(144, 238, 144, 1)",
                        ],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: false, // Hide the legend
                      },
                      title: {
                        display: true,
                        text: "Thông số nhà phân phối",
                        font: {
                          size: 14,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            {/* <div className={classNames("col-4", styles.lowerItemsChart)}>
              <div className={styles.chart}>
                <PolarArea
                  data={{
                    labels: [
                      "Red",
                      "Blue",
                      "Yellow",
                      "Green",
                      "Purple",
                      "Orange",
                    ],
                    datasets: [
                      {
                        label: "Thông số cửa hàng",
                        data: (data && data[1] && Object.values(data[3])) || [],
                        backgroundColor: [
                          "rgba(255, 182, 193, 0.6)", // Light Pink (pastel)
                          "rgba(173, 216, 230, 0.6)", // Light Blue (pastel)
                          "rgba(255, 255, 180, 0.6)", // Light Yellow (pastel)
                          "rgba(144, 238, 144, 0.6)", // Light Green (pastel)
                          "rgba(216, 191, 216, 0.6)", // Light Purple (pastel)
                          "rgba(255, 223, 186, 0.6)", // Light Orange (pastel)
                        ],
                        borderColor: [
                          "rgba(255, 182, 193, 1)", // Light Pink border (opaque)
                          "rgba(173, 216, 230, 1)", // Light Blue border (opaque)
                          "rgba(255, 255, 180, 1)", // Light Yellow border (opaque)
                          "rgba(144, 238, 144, 1)", // Light Green border (opaque)
                          "rgba(216, 191, 216, 1)", // Light Purple border (opaque)
                          "rgba(255, 223, 186, 1)", // Light Orange border (opaque)
                        ],
                        borderWidth: 2, // Border width for each section
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true, // Maintain aspect ratio of the chart
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        enabled: true, // Show tooltips on hover
                      },
                    },
                  }}
                />
              </div>
            </div> */}
            {/* <div className={classNames("col-4", styles.lowerItemsChart)}>
              <div className={styles.chart}>
                <Radar
                  data={{
                    labels: [
                      "Red",
                      "Blue",
                      "Yellow",
                      "Green",
                      "Purple",
                      "Orange",
                    ],
                    datasets: [
                      {
                        label: "My Radar Dataset",
                        data: [65, 59, 90, 81, 56, 55],
                        backgroundColor: "rgba(173, 216, 230, 0.4)",
                        borderColor: "rgba(173, 216, 230, 1)",
                        borderWidth: 2,
                        fill: true,
                        pointBackgroundColor: "rgba(173, 216, 230, 1)",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: "rgba(173, 216, 230, 1)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      r: {
                        min: 0,
                        max: 100,
                        ticks: {
                          stepSize: 20,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
              <span>Radar Chart</span>
            </div> */}
            <div
              className={classNames(
                "col-4 d-flex flex-column align-items-center justify-content-start",
                styles.itemsChart
              )}
            >
              <span className={styles.title}>Tổng số người dùng</span>
              <span className={classNames(styles.amount, "text-success")}>
                {data[0] || 0}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.rightSideChart}>
          <div className={classNames("w-100", styles.barChart)}>
            <Bar
              className={styles.barChartRightSide}
              data={{
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [
                  {
                    label: "My Bar Chart Dataset",
                    data: [65, 59, 90, 81, 56, 55],
                    backgroundColor: [
                      "rgba(173, 216, 230, 0.6)", // Pastel Blue
                      "rgba(255, 182, 193, 0.6)", // Pastel Pink
                      "rgba(144, 238, 144, 0.6)", // Pastel Green
                      "rgba(255, 255, 180, 0.6)", // Pastel Yellow
                      "rgba(216, 191, 216, 0.6)", // Pastel Purple
                      "rgba(255, 223, 186, 0.6)", // Pastel Orange
                    ],
                    borderColor: [
                      "rgba(173, 216, 230, 1)", // Pastel Blue border
                      "rgba(255, 182, 193, 1)", // Pastel Pink border
                      "rgba(144, 238, 144, 1)", // Pastel Green border
                      "rgba(255, 255, 180, 1)", // Pastel Yellow border
                      "rgba(216, 191, 216, 1)", // Pastel Purple border
                      "rgba(255, 223, 186, 1)", // Pastel Orange border
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: "top", // Positioning the legend at the top
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
