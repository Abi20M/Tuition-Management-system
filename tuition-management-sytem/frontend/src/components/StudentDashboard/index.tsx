import {
  Text,
  SimpleGrid,
  Paper,
  Group,
  Box,
  Modal,
  PasswordInput,
  Button,
  TextInput,
} from "@mantine/core";
//   import ExamIcon from "../../assets/exam.webp";
//   import TeacherIcon from "../../assets/teacher.png";
import { useState } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useEffect } from "react";
import { IconAlertTriangle, IconCheck } from "@tabler/icons";
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
import { useForm } from "@mantine/form";
import { IconPassword } from "@tabler/icons-react";
import { title } from "process";

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

//get stored student Details
const student = JSON.parse(localStorage.getItem("student") || "{}");

const StudentDashboard: React.FC = () => {
  const [classes, setClasses] = useState(0);
  const [exams, setExams] = useState(0);
  const [results, setResults] = useState([0, 0, 0, 0, 0, 0]);
  const [openedPasswordModal, setOpenedPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(true);

  useEffect(() => {
    if (student.isChangedPassoword === false) {
      setOpenedPasswordModal(true);
    }
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

  // validate confirm password func
  const validatePassword = (confirmPassword: string) => {
    if (confirmPassword.length != 0) {
      if (newPassword === confirmPassword) {
        setError(false);
        const error = document.getElementById("confirmPasswordError");
        if (error) error.innerHTML = "Password is match!";
      } else {
        const error = document.getElementById("confirmPasswordError");
        if (error) error.innerHTML = "Password is not match!";
      }
    }
  };

  // password changing func
  const submitPassword = (values: {
    documentId: string;
    studentId: string;
    currentPassword: string;
    newPassword: string;
  }) => {
    showNotification({
      id: "update-password",
      title: "Changing password",
      message: "We are trying to update your password",
      loading: true,
    });

    StudentAPI.setNewPassword(values)
      .then((res) => {
        setOpenedPasswordModal(false);

        updateNotification({
          id: "update-password",
          title: "Changed password",
          message: "We are updated your password",
          color: "teal",
          icon: <IconCheck />,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        updateNotification({
          id: "update-password",
          title: "Error while changing password",
          message: "Check your current password or network connection",
          color: "red",
          icon: <IconAlertTriangle />,
        });
      });
  };

  // password changing modal
  const changePasswordForm = useForm({
    initialValues: {
      documentId: student._id,
      studentId: student.id,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <>
    {/* password chaging modal */}
      <Modal
        opened={openedPasswordModal}
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        onClose={() => {
          setOpenedPasswordModal(false);
        }}
        title={"Change Password for First Time"}
        centered
      >
        <form
          onSubmit={changePasswordForm.onSubmit((values) =>
            submitPassword(values)
          )}
        >
          <PasswordInput
            label="Current Password"
            withAsterisk
            placeholder="current password"
            {...changePasswordForm.getInputProps("currentPassword")}
            required
          />
          <PasswordInput
            label="New Password"
            withAsterisk
            placeholder="new password"
            {...changePasswordForm.getInputProps("newPassword")}
            onChange={(event) => {
              setNewPassword(event.target.value);
              changePasswordForm.setFieldValue(
                "newPassword",
                event.target.value
              );
            }}
            required
          />
          <PasswordInput
            label="Confirm Password"
            withAsterisk
            placeholder="confirm password"
            onChange={(event) => {
              changePasswordForm.setFieldValue(
                "confirmPassword",
                event.target.value
              );
              validatePassword(event.target.value);
            }}
            required
          />
          <p
            id="confirmPasswordError"
            style={{
              color: error === false ? "green" : "red",
              marginTop: "10px",
            }}
          ></p>

          <Button fullWidth mt={20} type="submit" disabled={error?true:false}>
            Change Password
          </Button>
        </form>
      </Modal>
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
    </>
  );
};

export default StudentDashboard;
