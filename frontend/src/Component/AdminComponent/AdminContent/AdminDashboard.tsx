import React from "react";
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
              <span className={classNames(styles.amount, "text-success")}>
                4.000.000 đ
              </span>
            </div>
            <div
              className={classNames(
                "col-4 d-flex flex-column align-items-center justify-content-center",
                styles.itemsChart
              )}
            >
              <span className={styles.title}>Nợ Đã Thanh Toán</span>
              <span className={classNames(styles.amount, "text-danger")}>
                30%
              </span>
            </div>
            <div
              className={classNames(
                "col-4 d-flex flex-column align-items-center justify-content-center",
                styles.itemsChart
              )}
            >
              <span className={styles.title}>Số cửa hàng</span>
              <span className={classNames(styles.amount, "text-success")}>
                50
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className={classNames("col-4", styles.lowerItemsChart)}>
              <div className={styles.chart}>
                <Pie
                  data={{
                    labels: ["Red", "Blue", "Yellow"],
                    datasets: [
                      {
                        data: [300, 50, 100],
                        backgroundColor: [
                          "rgba(255, 182, 193, 0.5)", // Pastel Red with 50% transparency
                          "rgba(173, 216, 230, 0.5)", // Pastel Blue with 50% transparency
                          "rgba(255, 255, 180, 0.5)", // Pastel Yellow with 50% transparency
                        ],
                        borderColor: [
                          "rgba(255, 182, 193, 1)", // Pastel Red with 50% transparency
                          "rgba(173, 216, 230, 1)", // Pastel Blue with 50% transparency
                          "rgba(255, 255, 180, 1)", // Pastel Yellow with 50% transparency
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
                    }, // Makes sure the chart is responsive
                  }}
                />
              </div>
              <span>Pie Chart</span>
            </div>
            <div className={classNames("col-4", styles.lowerItemsChart)}>
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
                        label: "My Polar Area Chart",
                        data: [300, 50, 100, 150, 200, 250],
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
              <span>Polar Chart</span>
            </div>
            <div className={classNames("col-4", styles.lowerItemsChart)}>
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
      <div className="d-flex align-items-center gap-2 py-2 justify-content-between mb-10">
        <div className={classNames(styles.lowerChart, "col-6")}>
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
        <div className={classNames(styles.lowerChart, "col-6")}>
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
  );
};

export default AdminDashboard;
