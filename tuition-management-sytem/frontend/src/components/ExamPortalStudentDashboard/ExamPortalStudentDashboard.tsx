import { Box } from "@mantine/core";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Average,
  GradeDistribution,
  ResultOverview,
} from "../../pages/ExamPortal/Teacher/TeacherExamPortalDashboard/TeacherExamPortalDashboard";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const gradeDistributionLabels = ["A", "B", "C", "F"];

interface ExamPortalStudentDashboardProps {
  resultOverview: ResultOverview;
  gradeDistribution: GradeDistribution[];
  average: Average[];
}

const ExamPortalStudentDashboard = ({
  resultOverview,
  gradeDistribution,
  average,
}: ExamPortalStudentDashboardProps) => {
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        style: {
          marginTop: "20px",
        },
      },
      title: {
        display: true,
        text: "Results Overview",
        font: {
          size: 20,
        },
      },
    },
  };

  const averageChartOptions = {
    responsive: true,
    tension: 0.5,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Results (Last 6 Exams)",
        font: {
          size: 20,
        },
      },
    },
  };

  const gradeDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Grade Distribution",
        position: "top" as const,
        font: {
          size: 20,
        },
      },
    },
  };

  const pieChartData = {
    labels: ["Passed", "Failed", "Absent"],
    datasets: [
      {
        label: "# of Votes",
        data: [
          resultOverview.passed,
          resultOverview.failed,
          resultOverview.absent,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const gradeDistributionData = {
    labels: gradeDistributionLabels,
    datasets: gradeDistribution.map((item: any) => ({
      label: item.class,
      data: [item.A, item.B, item.C, item.F],
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )},${Math.floor(Math.random() * 255)},0.5)`,
    })),
  };

  const averageChartData = {
    labels: ["Exam 1", "Exam 2", "Exam 3", "Exam 4", "Exam 5", "Exam 6"],
    datasets: average.map((item: any) => ({
      label: item.class,
      data: item.average,
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )},${Math.floor(Math.random() * 255)},0.5)`,
      borderColor: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
        Math.random() * 255
      )},${Math.floor(Math.random() * 255)},1)`,
      borderWidth: 3,
    })),
  };

  return (
    <>
      <Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "40px",
            }}
          >
            <Box sx={{ width: "305px", height: "400px" }}>
              <Pie data={pieChartData} options={pieChartOptions} />
            </Box>
            <Box sx={{ width: "600px", height: "400px" }}>
              <Line data={averageChartData} options={averageChartOptions} />
            </Box>
          </Box>
          <Box sx={{ width: "100%", height: "450px" }}>
            <Bar
              data={gradeDistributionData}
              options={gradeDistributionOptions}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ExamPortalStudentDashboard;
