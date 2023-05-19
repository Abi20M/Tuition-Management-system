import {
  Text,
  SimpleGrid,
  Paper,
  Group,
  Box,
  Modal,
  PasswordInput,
  Button,
} from "@mantine/core";
import StudentIcon from "../../assets/student.png";
import TeacherIcon from "../../assets/teacher.png";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useState } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useEffect } from "react";
//import { IconCheck } from "@tabler/icons";
import ParentAPI from "../../API/ParentAPI";
import SubjectAPI from "../../API/subjectAPI";
import { ClassAPI } from "../../API/classAPI";
import { IconAlertTriangle, IconCheck } from "@tabler/icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface RowDataClasses {
  _id: string;
  id: string;
  name: string;
  description: string;
  teacher: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  students: [];
}

interface RowDataStudents {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  birthDate: string;
  address: string;
  gender: string;
  parent: string;
}

//Get all students records from the database
const getAllStudents = async () => {
  const response = await ParentAPI.getStudents();
  const data = await response.data;
  return data;
};

//Get all subject records from the database
// const getAllSubject = async () => {
//   const response = await SubjectAPI.getSubjects();
//   const data = await response.data;
//   return data;
// };

//Get all classs records from the database
const getAllClasses = async () => {
  const response = await ClassAPI.getAllClasses();
  const data = await response.data;
  return data;
};

// get exam data
const getExamMarksByStudentId = async (studentId: string[]) => {
  const response = await ParentAPI.getExamMarksByStudentId(studentId);
  const data = await response.data;
  return data;
};

export const options = {
  responsive: true,
  plugins: {
    //Dont show the legend
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Results",
      },
    },
    y: {
      title: {
        display: true,
        text: "No Of Students",
      },
    },
  },
};

// export const options2 = {
//   responsive: true,
//   plugins: {
//     //Dont show the legend
//     legend: {
//       display: false,
//     },
//   },
//   scales: {
//     x : {
//       title: {
//         display: true,
//         text: "Grades",
//       },
//     },
//     y : {
//       title: {
//         display: true,
//         text: "No Of Students",
//       },
//     },
//   },
// };

const labels = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "F"];

export const examResultsData = {
  labels: labels,
  datasets: [
    {
      label: "Exam Results",
      data: [10, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

export const doughnutOptions = {
  responsive: true,
  plugins: {
    //show the legend
    legend: {
      display: true,
    },
  },
};

export const examResultsData2 = {
  labels: labels,
  datasets: [
    {
      label: "Exam Results",
      data: [0, 2, 0, 0, 1, 0, 0, 0, 0, 1],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

export const examResultsData1 = {
  labels: labels,
  datasets: [
    {
      label: "Exam Results",
      data: [1, 2, 1, 0, 1, 2, 0, 1, 0, 1],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 255, 255, 1)",
      borderWidth: 1,
    },
  ],
};

interface studentDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  birthDate: string;
  address: string;
  gender: string;
  parent: string;
}

const ParentOverview: React.FC = () => {
  const [classes, setClasses] = useState(5);
  const [students, setStudents] = useState(0);
  const [studentDetails, setStudentDetails] = useState<studentDetails[]>([]);
  const [subjects, setSubjects] = useState([]);
  const [examData, setExamData] = useState(examResultsData1);
  const [examResultData, setExamResultData] = useState([]);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [openedPasswordModal, setOpenedPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(true);
  const [gradeDistributionData, setGradeDistributionData] = useState([
    0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading Teacher Dashboard Data",
        message: "Please wait while we load the data",
        autoClose: true,
        disallowClose: false,
      });

      const studentResult = await getAllStudents();
      const studentData = studentResult.map((item: any) => {
        return {
          id: item._id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          school: item.school,
          grade: item.grade,
          birthDate: item.birthDate,
          address: item.address,
          gender: item.gender,
          parent: item.parent,
        };
      });
      setStudents(studentData.length);
      setStudentDetails(studentData);
      //create grade distribution data array - grade 6 to 13
      const gradeDisData = [0, 0, 0, 0, 0, 0, 0, 0];
      studentData.forEach((item: RowDataStudents) => {
        if (item.grade === "6") {
          gradeDisData[0] = gradeDisData[0] + 1;
        } else if (item.grade === "7") {
          gradeDisData[1] = gradeDisData[1] + 1;
        } else if (item.grade === "8") {
          gradeDisData[2] = gradeDisData[2] + 1;
        } else if (item.grade === "9") {
          gradeDisData[3] = gradeDisData[3] + 1;
        } else if (item.grade === "10") {
          gradeDisData[4] = gradeDisData[4] + 1;
        } else if (item.grade === "11") {
          gradeDisData[5] = gradeDisData[5] + 1;
        } else if (item.grade === "12") {
          gradeDisData[6] = gradeDisData[6] + 1;
        } else if (item.grade === "13") {
          gradeDisData[7] = gradeDisData[7] + 1;
        }
      });
      setGradeDistributionData(gradeDisData);

      const male = studentData.filter((item: RowDataStudents) => {
        return item.gender === "male";
      });
      setMaleCount(male.length);
      const female = studentData.filter((item: RowDataStudents) => {
        return item.gender === "female";
      });
      setFemaleCount(female.length);

      // const resultSubjects = await getAllSubject();
      // const subjects = resultSubjects.map((item: any) => ({
      //   value: item._id,
      //   label: item.name,
      // }));
      // subjects.unshift({ value: "all", label: "All" });
      // setSubjects(subjects);

      const resultClasses = await getAllClasses();
      const classes = resultClasses.map((item: any) => ({
        _id: item._id,
        id: item.id,
        name: item.name,
        description: item.description,
        teacher: item.teacher,
        subject: item.subject,
        date: item.date,
        time: item.time,
        duration: item.duration,
        students: item.students,
      }));

      let classCount = 0;

      //if student id exists in the class item.students array, then increment the class count
      studentData.forEach((student: RowDataStudents) => {
        classes.forEach((classItem: RowDataClasses) => {
          classItem.students.forEach((studentId: string) => {
            if (studentId === student.id) {
              classCount = classCount + 1;
            }
          });
        });
      });

      setClasses(classCount);

      //get exam data
      getExamMarksByStudentId(
        studentData.map((student: any) => student.id)
      ).then((data) => {
        setExamResultData(data);
      });

      updateNotification({
        id: "loding-data",
        color: "teal",
        title: "Teacher Dashboard data loaded",
        message: "Teacher Dashboard data loaded successfully",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    };
    fetchData();
  }, []);

  const data = [
    {
      title: "My Students",
      value: students,
      icon: StudentIcon,
    },
    {
      title: "Total Classes",
      value: classes,
      icon: TeacherIcon,
    },
  ];

  const gradeData = {
    labels: ["6", "7", "8", "9", "10", "11", "12", "13"],
    datasets: [
      {
        label: "Grade Distribution",
        data: gradeDistributionData,
        backgroundColor: "rgba(0, 29, 250, 0.2)",
        borderColor: "#00d5ff",
        borderWidth: 1,
      },
    ],
  };

  const stats = data.map((stat) => {
    return (
      <Paper withBorder radius="md" p="xs" key={stat.title}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={stat.icon} alt={stat.title} width="100" height="100" />
          <Group
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "20px",
            }}
          >
            <Text
              weight={700}
              size="xl"
              sx={{ fontSize: "4rem", marginBottom: -30, marginTop: -30 }}
            >
              {stat.value}
            </Text>
            <Text color="dimmed" size="md" transform="uppercase" weight={700}>
              {stat.title}
            </Text>
          </Group>
        </Box>
      </Paper>
    );
  });

  const marksOptions = {
    responsive: true,
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
  }
  const lineChartLabels = ["Exam 01","Exam 02","Exam 03","Exam 04","Exam 05","Exam 06"];
  let count = 0;
  const LineGraphData = {
   
      labels : lineChartLabels,
      datasets: examResultData.map((result: any) => ({
          label: (count+=1).toString(),
          data: result.marks,
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
            Math.random() * 255
          )},${Math.floor(Math.random() * 255)},0.5)`,
          borderColor: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
            Math.random() * 255
          )},${Math.floor(Math.random() * 255)},1)`,
          borderWidth: 3
        })),
  };


  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          marginTop: "2%",
        }}
      >
        <SimpleGrid
          cols={2}
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          sx={{ width: "100%" }}
        >
          {stats}
        </SimpleGrid>
        <SimpleGrid
          cols={2}
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          sx={{ width: "100%", marginTop: "2%" }}
        ></SimpleGrid>
        <Box>
          <div  style={{ width: "800px", height: "800px" }}>
            <Line data={LineGraphData} options={marksOptions}/>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default ParentOverview;
