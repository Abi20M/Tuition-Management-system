import {
  Text,
  SimpleGrid,
  Paper,
  Group,
  Box,
  Button
} from "@mantine/core";
import StudentIcon from "../../assets/student.png";
import TeacherIcon from "../../assets/teacher.png";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useState } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useEffect } from "react";
import { IconAlertTriangle, IconCheck } from "@tabler/icons";
import TeacherAPI from "../../API/teacherAPI";
import { ClassAPI } from "../../API/classAPI";
import { Modal, PasswordInput } from '@mantine/core';
import { useForm } from "@mantine/form";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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

const teacher = JSON.parse(localStorage.getItem("teacher") || "{}");
const teacherID = teacher._id;
const teacherName = teacher.name;


//Get all students records from the database
const getAllStudents = async () => {
  const response = await TeacherAPI.getStudents();
  const data = await response.data;
  return data;
};

//Get all classs records from the database
const getAllClasses = async () => {
  const response = await ClassAPI.getAllClasses();
  const data = await response.data;
  return data;
};

// //get class count
// const getClassCount = async () =>  {
//   const response = await ClassAPI.getClassCount(teacher.name);
//   const data = await response.data;

//   return data;
// }


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

export const options2 = {
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
        text: "Grades",
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

const labels = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "F"];

export const examResultsData = {
  labels: labels,
  datasets: [
    {
      label: "Exam Results",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
      data: [13, 41, 12, 12, 21, 23, 12, 24, 21, 12],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};


const TeacherOverview: React.FC = () => {
  const [classes, setClasses] = useState(0);
  const [students, setStudents] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);

  // change password useStates
  const [openedPasswordModal, setOpenedPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(true);

  const [gradeDistributionData, setGradeDistributionData] = useState([
    0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  useEffect(() => {
    if (teacher.isChangedPassoword === false) {
      setOpenedPasswordModal(true);
    }

    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading Teacher Dashboard Data",
        message: "Please wait while we load the data",
        autoClose: false,
        disallowClose: true,
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

      //class count
      // const classCount = await getClassCount();
      // setClasses(classCount);
      //filter classes by teacher id

      const filteredClasses = classes.filter(
        (item: any) => item.teacher === teacherName
      );
      setClasses(filteredClasses.length);
      setStudents(studentData.length);

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
      title: "My Classes",
      value: classes,
      icon: TeacherIcon,
    },
  ];

  const genderData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Gender Distribution",
        data: [maleCount, femaleCount],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

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


  // change password process below
  // validate confirm password func
  const validatePassword = (confirmPassword: string) => {
    if (confirmPassword.length != 0) {
      if (newPassword === confirmPassword) {
        setError(false);
        const error = document.getElementById("confirmPasswordError");
        if (error) error.innerHTML = "Password is match!";
      } else {
        setError(true);
        const error = document.getElementById("confirmPasswordError");
        if (error) error.innerHTML = "Password is not match!";
      }
    }
  };

  // password changing func
  const submitPassword = (values: {
    documentId: string;
    teacherId: string;
    currentPassword: string;
    newPassword: string;
  }) => {
    showNotification({
      id: "update-password",
      title: "Changing password",
      message: "We are trying to update your password",
      loading: true,
    });

    TeacherAPI.setNewPassword(values)
      .then((res) => {
        setOpenedPasswordModal(false);
 
        //store teacher details to local storage for further use
        localStorage.setItem("teacher", JSON.stringify(res.data));

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
      documentId: teacher._id,
      teacherId: teacher.id,
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

          <Button fullWidth mt={20} type="submit" disabled={error ? true : false}>
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
            {stats}
          </SimpleGrid>
          <SimpleGrid
            cols={2}
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
            sx={{ width: "100%", marginTop: "2%" }}
          >
            <Paper withBorder radius="md" p="xs" key="grades">
              <Text weight={700} size="xl" sx={{ fontSize: "1.5rem" }}>
                Gender Distribution of My Students
              </Text>
              <Box sx={{ width: "70%", marginLeft: "15%" }}>
                <Doughnut data={genderData} options={doughnutOptions} />
              </Box>
            </Paper>
            <Paper withBorder radius="md" p="xs" key="gender">
              <Text weight={700} size="xl" sx={{ fontSize: "1.5rem" }}>
                Grade Distribution of My Students
              </Text>
              <Box sx={{ marginTop: "10%" }}>
                <Bar data={gradeData} options={options2} />
              </Box>
            </Paper>
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
              Exam Results Statistics of My Students
            </Text>
          </Box>
          <Box
            sx={{
              width: "85%",
            }}
            id="bar-chart"
          >
            <Bar data={examResultsData2} options={options} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TeacherOverview;