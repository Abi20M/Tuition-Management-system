import { Container, Tabs, createStyles } from "@mantine/core";
import {
  ExamPortalStudentDashboard,
  MyExams,
  StudentHeader,
} from "../../../../components";
import WebsiteFooter from "../../../../components/Footer";
import { IconChartLine, IconCheck, IconFilePencil } from "@tabler/icons";
import { useEffect, useState } from "react";
import ExamAPI from "../../../../API/ExamAPI";
import { showNotification, updateNotification } from "@mantine/notifications";
import { sortData } from "../../../../components/MyExams/MyExams";

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

const StudentExamPortalDashboard = () => {
  //change the tab Title
  document.title = "Teacher Dashboard - Exam Portal";
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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
            <Tabs.Tab icon={<IconFilePencil />} value={"exams"}>
              My Exams
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="dashboard">
            <ExamPortalStudentDashboard
              resultOverview={resultOverview}
              gradeDistribution={gradeDistribution}
              average={average}
            />
          </Tabs.Panel>
          <Tabs.Panel value="exams">
            <MyExams
              exams={examData}
              classes={classData}
              setExams={setExamData}
              setClasses={setClassData}
              loading={loading}
              sortedData={sortedData}
              setSortedData={setSortedData}
            />
          </Tabs.Panel>
        </Tabs>
      </Container>

      <WebsiteFooter />
    </>
  );
};

export default StudentExamPortalDashboard;
