import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js"; // Import PointElement

import giveCategoryAndSubcategory from "../../assets/GiveCategorySubCategory";

// Register all necessary elements
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const Statistics = () => {
  const [topWebsites, setTopWebsites] = useState([]);
  const [userWebsites, setUserWebsites] = useState([]);

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_PORT}/api/get-statistics`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        setTopWebsites(response.data.topWebsites);
        setUserWebsites(response.data.userWebsites);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  const topWebsitesData = {
    labels: topWebsites.map((website) => {
      const { subcategory } = giveCategoryAndSubcategory(
        website.category_id,
        website.subcategory_id
      );
      return `${subcategory}`;
    }),
    datasets: [
      {
        label: "Visitors",
        data: topWebsites.map((topWebsite) => topWebsite.views),
        backgroundColor: [
          "rgba(2, 117, 163)",
          "rgba(0, 150, 167)",
          "rgba(2, 175, 129)",
          "rgba(125, 190, 63)",
          "rgba(242,188,0)",
        ],
      },
    ],
  };

  const userWebsitesData =
    userWebsites.length > 0
      ? {
          labels: userWebsites.map((userWebsite) => {
            const { subcategory } = giveCategoryAndSubcategory(
              userWebsite.category_id,
              userWebsite.subcategory_id
            );
            return `${subcategory}`;
          }),
          datasets: [
            {
              label: "Visitors",
              data: userWebsites.map((userWebsite) => userWebsite.views),
              backgroundColor: [
                "rgba(255, 88, 122)",
                "rgba(255, 149, 57)",
                "rgba(65, 185, 183)",
                "rgba(46, 152, 231)",
              ],
            },
          ],
        }
      : {
          labels: ["No Data"],
          datasets: [
            {
              label: "Personal Chart",
              data: [1],
              backgroundColor: ["rgba(65, 185, 183)"],
            },
          ],
        };

  return (
    <div className="statistics">
      <h3>Track Visitors</h3>
      <p className="p_text">Personal Chart shows total visitors for each listing you listed</p>
      <div className="top-charts">
        <div className="top-doughnut">
          <Doughnut
            data={userWebsitesData}
            options={{
              cutout: '75%',
              responsive: true,
              plugins: {
                title: { display: true, text: "Individual Chart" },
              },
              elements: {
                arc: {
                  borderWidth: 0, // Remove the border
                },
              },
              scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Personal Chart'
                    }
                },
                y: {
                    title: {
                        display: false,
                    }
                }
            }
            }}
          />
        </div>

        <div className="top-bar">
          <Bar
            data={topWebsitesData}
            options={{
              responsive: true,
              plugins: {
                title: { display: true, text: "General Chart" },
              },
              animation: {
                duration: 0,  // Disable animation
              },
              scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Top 5 most visited websites in SiteDecors',
                        padding: {
                          top:20 // Adds a 10px gap above the title
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Visitors'
                    }
                }
            }
            }}
          />
        </div>
      </div>

    </div>
  );
};

export default Statistics;
