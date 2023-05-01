import { useEffect, useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Box,
  Button,
  Modal,
  ActionIcon,
  Tooltip,
  Checkbox,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconEyeCheck,
  IconCheckupList,
  IconRocket,
} from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import ExamAPI from "../../API/ExamAPI";
import { IconCheck, IconAlertTriangle } from "@tabler/icons";
import {
  ClassData,
  ExamData,
} from "../../pages/ExamPortal/Teacher/TeacherExamPortalDashboard/TeacherExamPortalDashboard";

export interface StudentsData {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  birthDate: string;
  address: string;
  parent: string;
}

export interface ExamMarksData {
  id: string;
  studentId: string;
  name: string;
  marks: string;
}

export interface AttendanceData {
  id: string;
  studentId: string;
  name: string;
  status: boolean;
}

//Get all students records from the database
export const getStudentsByClass = async (id: string) => {
  const response = await ExamAPI.getStudentsByClass(id);
  const data = await response.data;
  return data;
};

export const getMarksByExam = async (id: string) => {
  const response = await ExamAPI.getMarksByExam(id);
  const data = await response.data;
  return data;
};

export const getAttendanceByExam = async (id: string) => {
  const response = await ExamAPI.getAttendanceByExam(id);
  const data = await response.data;
  return data;
};

//Stylings
const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

//Interface for Table header props
interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

//inter

//Create Table Headers
function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

//Filter Data
function filterData(data: ExamData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

//Sort Data
export function sortData(
  data: ExamData[],
  payload: { sortBy: keyof ExamData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

//Get all classs records from the database
export const getAllClasses = async () => {
  const response = await ExamAPI.getClasses();
  const data = await response.data;
  return data;
};

//Get all exam records from the database
export const getAllExams = async () => {
  const response = await ExamAPI.getExams();
  const data = await response.data;
  return data;
};

const ManageExamsAdmin = () => {
  const [selectedExam, setSelectedExam] = useState({
    id: "",
    examId: "",
    status: "",
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof ExamData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [marksOpened, setMarksOpened] = useState(false);
  const [marks, setMarks] = useState<ExamMarksData[]>([]);
  const [attendanceOpened, setAttendanceOpened] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceData[]>([]);
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [sortedData, setSortedData] = useState(exams);

  // fetch exam data on page load
  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "exam data is loading..",
        autoClose: false,
      });
      const examResult = await getAllExams();
      const examDataFetched = examResult.map((item: any) => {
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
        };
      });

      const resultClasses = await getAllClasses();
      const classes = resultClasses.map((item: any) => ({
        id: item._id,
        classId: item.id,
        name: item.name,
        description: item.description,
        teacher: item.teacher,
        subject: item.subject,
        date: item.date,
        time: item.time,
      }));

      setClasses(classes);
      setExams(examDataFetched);
      setLoading(false);
      const payload = {
        sortBy: null,
        reversed: false,
        search: "",
      };
      setSortedData(sortData(examDataFetched, payload));
      updateNotification({
        id: "loding-data",
        color: "teal",
        title: "Data loaded successfully",
        message: "Now you can view the exam data.",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    };
    fetchData();
  }, []);

  const getStudentsAndMarks = async (examid: string, classid: string) => {
    showNotification({
      id: "loding-marks",
      loading: true,
      title: "Loading Marks",
      message: "Marks are loading..",
      autoClose: false,
    });
    const enrolledStudentsResult = await getStudentsByClass(classid);
    const enrolledStudents = enrolledStudentsResult.map((item: any) => ({
      id: item._id,
      studentId: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      school: item.school,
      grade: item.grade,
      birthDate: item.birthDate,
      address: item.address,
      parent: item.parent,
    }));

    const marksResult = await getMarksByExam(examid);
    const marks = marksResult.map((item: any) => ({
      id: item.id,
      marks: item.marks,
    }));

    const finalMarks = enrolledStudents.map((student: StudentsData) => {
      const mark = marks.find((mark: any) => mark.id === student.id);
      if (mark) {
        return {
          id: student.id,
          studentId: student.studentId,
          name: student.name,
          marks: mark.marks,
        };
      } else {
        return {
          id: student.id,
          studentId: student.studentId,
          name: student.name,
          marks: "-",
        };
      }
    });
    setMarks(finalMarks);
    setMarksOpened(true);
    updateNotification({
      id: "loding-marks",
      color: "teal",
      title: "Marks loaded successfully",
      message: "You can now manage marks by adding, editing or deleting them.",
      icon: <IconCheck size={16} />,
      autoClose: 3000,
    });
  };

  const getStudents = async (examid: string, classid: string) => {
    showNotification({
      id: "loding-atendance",
      loading: true,
      title: "Loading Attendance",
      message: "Attendance is loading..",
      autoClose: false,
    });
    const enrolledStudentsResult = await getStudentsByClass(classid);
    const enrolledStudents: StudentsData[] = enrolledStudentsResult.map(
      (item: any) => ({
        id: item._id,
        studentId: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        school: item.school,
        grade: item.grade,
        birthDate: item.birthDate,
        address: item.address,
        parent: item.parent,
      })
    );

    const attendanceResult = await getAttendanceByExam(examid);
    const attendance: AttendanceData[] = attendanceResult.map((item: any) => ({
      id: item.id,
      status: item.status,
    }));

    const finalAttendance = enrolledStudents.map((student: StudentsData) => {
      const attend = attendance.find((attend: any) => attend.id === student.id);
      if (attend) {
        return {
          id: student.id,
          studentId: student.studentId,
          name: student.name,
          status: attend.status,
        };
      } else {
        return {
          id: student.id,
          studentId: student.studentId,
          name: student.name,
          status: false,
        };
      }
    });
    setAttendance(finalAttendance);
    setAttendanceOpened(true);
    updateNotification({
      id: "loding-atendance",
      color: "teal",
      title: "Attendance loaded successfully",
      message:
        "You can now manage attendance by adding, editing or deleting them.",
      icon: <IconCheck size={16} />,
      autoClose: 3000,
    });
  };

  const setSorting = (field: keyof ExamData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(exams, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(exams, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const releaseOfficialResults = () => {
    showNotification({
      id: "release-results",
      loading: true,
      title: "Releasing results",
      message: "Please wait..",
      autoClose: false,
    });
    ExamAPI.releaseOfficialResults(selectedExam.id)
      .then((response) => {
        const newData = exams.map((item) => {
          if (item.id === selectedExam.id) {
            return {
              ...item,
              status: "Results Released - Unofficial",
            };
          } else {
            return item;
          }
        });
        setExams(newData);
        updateNotification({
          id: "release-results",
          color: "teal",
          title: "Results Released successfully",
          message: "Results Released successfully",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        setMarksOpened(false);
      })
      .catch((error) => {
        updateNotification({
          id: "release-results",
          color: "red",
          title: "Releasing results failed",
          message: "We were unable to release results",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  const openReleaseResultsModal = () =>
    openConfirmModal({
      title: "Release results?",
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to release results?</Text>
      ),
      labels: {
        confirm: "Release results",
        cancel: "No don't release",
      },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "Results were not released",
          color: "red",
        });
      },
      onConfirm: () => {
        releaseOfficialResults();
      },
    });

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row.id}>
      <td>{row.examId}</td>
      <td>{row.name}</td>
      <td>{row.description}</td>
      <td>{classes.find((item) => item.id === row.class)?.name || "N/A"}</td>
      <td>{row.status}</td>
      <td>{row.date.slice(0, 10)}</td>
      <td>{row.time}</td>
      <td>
        <Box
          w={100}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tooltip label="View Attendance">
            <ActionIcon
              onClick={() => {
                setSelectedExam({
                  id: row.id,
                  examId: row.examId,
                  status: row.status,
                });
                getStudents(row.id, row.class);
              }}
            >
              <IconCheckupList size="24px" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="View Results">
            <ActionIcon
              onClick={() => {
                setSelectedExam({
                  id: row.id,
                  examId: row.examId,
                  status: row.status,
                });
                getStudentsAndMarks(row.id, row.class);
              }}
            >
              <IconEyeCheck size="24px" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Box>
      </td>
    </tr>
  ));

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Modal
        opened={marksOpened}
        onClose={() => {
          setMarksOpened(false);
        }}
        title={"Add Marks - " + selectedExam.examId}
        size="1000px"
      >
        <Box sx={{ margin: "20px", width: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <TextInput
              placeholder="Search by any field"
              mb="md"
              icon={<IconSearch size={14} stroke={1.5} />}
              value={search}
              onChange={() => {}}
              sx={{ width: "300px" }}
            />
            <Button
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              w={300}
              mr="md"
              onClick={() => {
                openReleaseResultsModal();
              }}
              leftIcon={<IconRocket size={14} stroke={1.5} />}
              disabled={selectedExam.status !== "Results Released - Unofficial"}
            >
              {selectedExam.status === "Results Released - Unofficial"
                ? "Results Released - Official"
                : "Results not released by the teacher"}
            </Button>
          </Box>
          <ScrollArea>
            <Table
              horizontalSpacing="md"
              verticalSpacing="xs"
              sx={{ tableLayout: "fixed", width: "100%" }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((enrollment: ExamMarksData) => (
                  <tr key={enrollment.id}>
                    <td>{enrollment.studentId}</td>
                    <td>{enrollment.name}</td>
                    <td>{enrollment.marks}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>
        </Box>
      </Modal>
      <Modal
        opened={attendanceOpened}
        onClose={() => {
          setAttendanceOpened(false);
        }}
        title={"Attendance " + selectedExam.examId}
        size="1000px"
      >
        <Box sx={{ margin: "20px", width: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <TextInput
              placeholder="Search by any field"
              mb="md"
              icon={<IconSearch size={14} stroke={1.5} />}
              value={search}
              onChange={() => {}}
              sx={{ width: "300px" }}
            />
          </Box>
          <ScrollArea>
            <Table
              horizontalSpacing="md"
              verticalSpacing="xs"
              sx={{ tableLayout: "fixed", width: "100%" }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.studentId}</td>
                    <td>{record.name}</td>
                    <td>
                      <Checkbox checked={record.status} disabled />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>
        </Box>
      </Modal>
      <Box sx={{ margin: "20px", width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextInput
            placeholder="Search by any field"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
            sx={{ width: "300px" }}
          />
        </Box>
        <ScrollArea>
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            sx={{ tableLayout: "auto", width: "100%" }}
          >
            <thead>
              <tr>
                <Th
                  sorted={sortBy === "examId"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("examId")}
                >
                  Exam ID
                </Th>
                <Th
                  sorted={sortBy === "name"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("name")}
                >
                  Name
                </Th>
                <Th
                  sorted={sortBy === "description"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("description")}
                >
                  Description
                </Th>
                <Th
                  sorted={sortBy === "class"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("class")}
                >
                  Class
                </Th>
                <Th
                  sorted={sortBy === "status"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("status")}
                >
                  Status
                </Th>
                <Th
                  sorted={sortBy === "date"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("date")}
                >
                  Date
                </Th>
                <Th
                  sorted={sortBy === "time"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("time")}
                >
                  Time
                </Th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <Text weight={500} align="center">
                      Loading
                    </Text>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <Text weight={500} align="center">
                      No items found
                    </Text>
                  </td>
                </tr>
              ) : (
                rows
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </Box>
    </Box>
  );
};

export default ManageExamsAdmin;
