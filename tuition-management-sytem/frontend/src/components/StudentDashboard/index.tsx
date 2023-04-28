import {
    Text,
    SimpleGrid,
    Paper,
    Group,
    Box,
  } from "@mantine/core";
//   import ExamIcon from "../../assets/exam.webp";
//   import TeacherIcon from "../../assets/teacher.png";
  import { useState } from "react";
  import { showNotification, updateNotification } from "@mantine/notifications";
  import { useEffect } from "react";
  import { IconCheck } from "@tabler/icons";
  import StudentAPI from "../../API/studentAPI";
  
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
  import { Line } from "react-chartjs-2";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Results of the last 6 exams",
      },
    },
  };
  
  const labels = ["Exam 1", "Exam 2", "Exam 3", "Exam 4", "Exam 5", "Exam 6"];
  
  //Get all classs records from the database
  const getAllClasses = async () => {
    const response = await StudentAPI.getClassesByStudentId();
    const data = await response.data;
    return data;
  };
  
  //Get all exams from the database
  const getAllExams = async () => {
    const response = await StudentAPI.getExamsByStudentId();
    const data = await response.data;
    return data;
  };
  
  const StudentDashboard: React.FC = () => {
    const [classes, setClasses] = useState(0);
    const [exams, setExams] = useState(0);
    const [results, setResults] = useState([0, 0, 0, 0, 0, 0]);
  
    useEffect(() => {
      const fetchData = async () => {
        showNotification({
          id: "loding-data",
          loading: true,
          title: "Loading Student Dashboard Data",
          message: "Please wait while we load the data",
          autoClose: false,
          disallowClose: true,
        });
  
        const resultClasses = await getAllClasses();
        const classes = resultClasses.map((item: any) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          teacher: item.teacher,
          subject: item.subject,
          date: item.date,
          time: item.time,
        }));
        setClasses(classes.length);
  
        const resultExams = await getAllExams();
        const exams = resultExams.map((item: any) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          subject: item.subject,
          date: item.date,
          time: item.time,
          marks: item.marks,
        }));
  
        //get the last 6 exams
        const lastSixExams = exams.slice(Math.max(exams.length - 6, 0));
        //get the last 6 exams marks of logged in student
        const student = JSON.parse(localStorage.getItem("student") || "{}");
        const studentID = student._id;
        const studentMarks = [0, 0, 0, 0, 0, 0];
  
        for (let i = 0; i < lastSixExams.length; i++) {
          for (let j = 0; j < lastSixExams[i].marks.length; j++) {
            if (lastSixExams[i].marks[j].id === studentID) {
              studentMarks[i] = lastSixExams[i].marks[j].marks;
            }
          }
        }
  
        //reverse the array to show the latest exam first
        studentMarks.reverse();
  
        setResults(studentMarks);
  
        setExams(exams.length);
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
  
    // const data = [
    //   {
    //     title: "Exams",
    //     value: exams,
    //     icon: ExamIcon,
    //   },
    //   {
    //     title: "My Classes",
    //     value: classes,
    //     icon: TeacherIcon,
    //   },
    // ];
  
   const pdata = {
      labels,
      datasets: [
        {
          label: "Exam Results",
          data: results,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
    
  
    // const stats = data.map((stat) => {
    //   return (
    //     <Paper withBorder radius="md" p="xs" key={stat.title}>
    //       <Box
    //         sx={{
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         <img src={stat.icon} alt={stat.title} width="100" height="100" />
    //         <Group
    //           sx={{
    //             display: "flex",
    //             flexDirection: "column",
    //             justifyContent: "center",
    //             alignItems: "center",
    //             marginLeft: "20px",
    //           }}
    //         >
    //           <Text
    //             weight={700}
    //             size="xl"
    //             sx={{ fontSize: "4rem", marginBottom: -30, marginTop: -30 }}
    //           >
    //             {stat.value}
    //           </Text>
    //           <Text color="dimmed" size="md" transform="uppercase" weight={700}>
    //             {stat.title}
    //           </Text>
    //         </Group>
    //       </Box>
    //     </Paper>
    //   );
    // });
  
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
            {/* {stats} */}
          </SimpleGrid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "85%",
              marginTop: "2%",
            }}
          >
            <Text size="xl" weight={700} sx={{ fontSize: "2rem" }}>
              Exam Results of the last 6 exams
            </Text>
          </Box>
          <Box
            sx={{
              width: "85%",
            }}
            id="line-chart"
          >
            <Line options={options} data={pdata} />
          </Box>
        </Box>
      </Box>
    );
  };
  
  export default StudentDashboard;
  