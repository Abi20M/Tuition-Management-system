import {
  Container,
  Tabs,
  createStyles,
  Button,
  PasswordInput,
  Modal,
} from "@mantine/core";
import {
  ExamPortalStudentDashboard,
  MyExams,
  StudentHeader,
} from "../../components";
import WebsiteFooter from "../../components/Footer";
import {
  IconAlertTriangle,
  IconChartLine,
  IconCheck,
  IconFilePencil,
  IconQrcode,
  IconSchool,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import ExamAPI from "../../API/ExamAPI";
import { showNotification, updateNotification } from "@mantine/notifications";
import { sortData } from "../../components/MyExams/MyExams";
import StudentClasses from "./studentClasses";
import StudentAPI from "../../API/studentAPI";
import { useForm } from "@mantine/form";
import StudentQrCode from "./studentQrCode";

export interface ExamData {
  id: string;
  examId: string;
  name: string;
  description: string;
  class: string;
  status: string;
  date: string;
  time: string;
  result: string;
}

export interface ClassData {
  id: string;
  name: string;
  description: string;
  teacher: string;
  subject: string;
  date: string;
  time: string;
}

export interface ResultOverview {
  passed: number;
  failed: number;
  absent: number;
}

export interface GradeDistribution {
  class: string;
  A: number;
  B: number;
  C: number;
  F: number;
}

export interface Average {
  class: string;
  average: number[];
}

const useStyles = createStyles((theme) => ({
  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
    marginTop: -38,
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tab: {
    width: 150,
    fontWeight: 500,
    height: 38,
    backgroundColor: "transparent",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    },

    "&[data-active]": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      borderColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[2],
    },
  },
}));

//Get all exam records from the database
export const getAllExams = async () => {
  const response = await ExamAPI.getExamsByStudent();
  const data = await response.data;
  return data;
};

const StudentDashboard = () => {
  //change the tab Title
  document.title = "Student Dashboard - Exam Portal";
  const { classes } = useStyles();

  const [examData, setExamData] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [sortedData, setSortedData] = useState(examData);
  const [resultOverview, setResultOverview] = useState<ResultOverview>({
    passed: 0,
    failed: 0,
    absent: 0,
  });
  const [gradeDistribution, setGradeDistribution] = useState<
    GradeDistribution[]
  >([]);
  const [average, setAverage] = useState<Average[]>([]);

  //  password change states
  const [openedPasswordModal, setOpenedPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(true);

  //  get student data from local storage
  const student = JSON.parse(localStorage.getItem("student") || "{}");

  const fetchData = async () => {
    showNotification({
      id: "loding-data",
      loading: true,
      title: "Loading data",
      message: "exam data is loading..",
      autoClose: false,
    });
    const examResult = await getAllExams();
    const examDataFetched = examResult.exams.map((item: any) => {
      return {
        id: item._id,
        examId: item.examId,
        name: item.name,
        description: item.description,
        class: item.class,
        status: item.status,
        date: item.date,
        time: item.time,
        attendance: item.attendance,
        marks: item.marks,
        result: item.result,
      };
    });

    const classes = examResult.classes.map((item: any) => ({
      id: item._id,
      classId: item.id,
      name: item.name,
      description: item.description,
      teacher: item.teacher,
      subject: item.subject,
      date: item.date,
      time: item.time,
    }));

    const gradeDistribution: GradeDistribution[] = [];
    classes.forEach((item: any) => {
      let gradeDistributionItem: GradeDistribution = {
        class: item.classId,
        A: 0,
        B: 0,
        C: 0,
        F: 0,
      };
      const classExams = examDataFetched.filter(
        (exam: any) => exam.class === item.id
      );
      classExams.forEach((exam: any) => {
        exam.marks.forEach((mark: any) => {
          if (mark.id === student._id) {
            if (mark.marks >= 75) {
              gradeDistributionItem.A++;
            } else if (mark.marks >= 65 && mark.marks < 75) {
              gradeDistributionItem.B++;
            } else if (mark.marks >= 45 && mark.marks < 65) {
              gradeDistributionItem.C++;
            } else if (mark.marks < 45) {
              gradeDistributionItem.F++;
            }
          }
        });
      });
      gradeDistribution.push(gradeDistributionItem);
    });

    const resultOverview: ResultOverview = {
      passed: 0,
      failed: 0,
      absent: 0,
    };

    gradeDistribution.forEach((item: any) => {
      resultOverview.passed += item.A + item.B + item.C;
      resultOverview.failed += item.F;
    });

    examDataFetched.forEach((item: any) => {
      item.attendance.forEach((attendance: any) => {
        if (!attendance.status && attendance.id === student._id) {
          resultOverview.absent++;
        }
      });
    });

    const average: Average[] = [];
    classes.forEach((item: any) => {
      let averageItem: Average = {
        class: item.classId,
        average: [0, 0, 0, 0, 0, 0],
      };
      const classExams = examDataFetched.filter(
        (exam: any) => exam.class === item.id && exam.marks.length > 0
      );
      classExams.forEach((exam: any, index: number) => {
        let total = 0;
        exam.marks.forEach((mark: any) => {
          if (mark.id === student._id) {
            total += mark.marks;
          }
        });
        averageItem.average[index] = total / exam.marks.length;
      });
      averageItem.average.reverse();
      average.push(averageItem);
    });

    setResultOverview(resultOverview);
    setGradeDistribution(gradeDistribution);
    setAverage(average);
    setClassData(classes);
    setExamData(examDataFetched);
    setLoading(false);
    const payload = {
      sortBy: "date" as keyof ExamData,
      reversed: true,
      search: "",
    };
    setSortedData(sortData(examData, payload));
    updateNotification({
      id: "loding-data",
      color: "teal",
      title: "Data loaded successfully",
      message: "Now you can view your exams",
      icon: <IconCheck size={16} />,
      autoClose: 3000,
    });
  };

  // fetch exam data on page load
  useEffect(() => {
    if (student.isChangedPassoword === false) {
      setOpenedPasswordModal(true);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //validate confirm parent password
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

  // Password Changing function
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

        // update user details again
        
        //store student details to local storage for further use
        localStorage.setItem("student", JSON.stringify(res.data));

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

          <Button
            fullWidth
            mt={20}
            type="submit"
            disabled={error ? true : false}
          >
            Change Password
          </Button>
        </form>
      </Modal>
      <StudentHeader />
      <Container>
        <Tabs
          defaultValue="dashboard"
          variant="outline"
          classNames={{
            root: classes.tabs,
            tabsList: classes.tabsList,
            tab: classes.tab,
          }}
          onTabChange={fetchData}
        >
          <Tabs.List>
            <Tabs.Tab icon={<IconChartLine />} value={"dashboard"}>
              Dashboard
            </Tabs.Tab>
            <Tabs.Tab icon={<IconSchool />} value={"classes"}>
              My classes
            </Tabs.Tab>
            <Tabs.Tab icon={<IconQrcode/>} value={"qrCode"}>
              My QR
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="dashboard">
            <ExamPortalStudentDashboard
              resultOverview={resultOverview}
              gradeDistribution={gradeDistribution}
              average={average}
            />
          </Tabs.Panel>
          <Tabs.Panel value="classes">
            <StudentClasses />
          </Tabs.Panel>
          <Tabs.Panel value="qrCode">
            <StudentQrCode/>
          </Tabs.Panel>
        </Tabs>
      </Container>

      <WebsiteFooter />
    </>
  );
};

export default StudentDashboard;
