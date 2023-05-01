import { useState } from "react";
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
  Select,
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
  IconCalendar,
  IconClock,
  IconCheckupList,
  IconRocket,
} from "@tabler/icons";
import { IconEdit, IconTrash } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import ExamAPI from "../../API/ExamAPI";
import { IconCheck, IconAlertTriangle } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { DatePicker, TimeRangeInput } from "@mantine/dates";
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

interface ManageExamsProps {
  exams: ExamData[];
  setExams: (exams: ExamData[]) => void;
  classes: ClassData[];
  setClasses: (classes: ClassData[]) => void;
  loading: boolean;
  sortedData: ExamData[];
  setSortedData: (sortedData: ExamData[]) => void;
}

const ManageExams = ({
  exams,
  setExams,
  classes,
  setClasses,
  loading,
  sortedData,
  setSortedData,
}: ManageExamsProps) => {
  const [selectedExam, setSelectedExam] = useState({
    id: "",
    examId: "",
    status: "",
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof ExamData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [addOpened, setAddOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [marksOpened, setMarksOpened] = useState(false);
  const [marks, setMarks] = useState<ExamMarksData[]>([]);
  const [addMarksOpened, setAddMarksOpened] = useState(false);
  const [attendanceOpened, setAttendanceOpened] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceData[]>([]);

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

  //edit exam form
  const editExam = async (values: {
    id: string;
    examId: string;
    name: string;
    description: string;
    class: string;
    status: string;
    date: string;
    time: string;
  }) => {
    showNotification({
      id: "edit-exam",
      loading: true,
      title: "Updating exam of " + values.name,
      message: "Updating exam record..",
      autoClose: false,
    });
    ExamAPI.editExam(values)
      .then((response) => {
        updateNotification({
          id: "edit-exam",
          color: "teal",
          title: "exam record updated successfully",
          message: "Updated exam record of " + values.name,
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        editForm.reset();
        setEditOpened(false);
        const newData = exams.map((item) => {
          if (item.id === values.id) {
            return {
              id: values.id,
              examId: item.examId,
              name: values.name,
              description: values.description,
              class: values.class,
              status: values.status,
              date: values.date,
              time: values.time,
              attendance: response.data.attendance,
              marks: response.data.marks,
            };
          } else {
            return item;
          }
        });
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };
        setExams(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "edit-exam",
          color: "red",
          title: "Update failed",
          message: "We were unable to update exam data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //add exam
  const addExam = async (values: {
    name: string;
    description: string;
    class: string;
    status: string;
    date: string;
    time: string;
  }) => {
    showNotification({
      id: "add-exam",
      loading: true,
      title: "Adding exam record",
      message: "Please wait while we add exam record..",
      autoClose: false,
    });
    ExamAPI.addExam(values)
      .then((response) => {
        updateNotification({
          id: "add-exam",
          color: "teal",
          title: "exam added successfully",
          message: "exam data added successfully.",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        addForm.reset();
        setAddOpened(false);
        const newData = [
          ...exams,
          {
            id: response.data._id,
            examId: response.data.examId,
            name: values.name,
            description: values.description,
            class: values.class,
            status: values.status,
            date: values.date,
            time: values.time,
            attendance: response.data.attendance,
            marks: response.data.marks,
          },
        ];
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };
        setExams(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "add-exam",
          color: "red",
          title: "Adding exam failed",
          message: "We were unable to add the exam to the database",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //delete exam
  const deleteExam = async (id: string) => {
    showNotification({
      id: "delete-exam",
      loading: true,
      title: "Deleting exam",
      message: "Please wait while we delete the exam record",
      autoClose: false,
    });
    ExamAPI.deleteExam(id)
      .then((response) => {
        updateNotification({
          id: "delete-exam",
          color: "teal",
          title: "exam record deleted successfully",
          message: "The exam record has been deleted successfully",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        const newData = exams.filter((item) => item.id !== id);
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };
        setExams(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "delete-exam",
          color: "red",
          title: "Deleting exam record failed",
          message: "We were unable to delete the exam record",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //add exam marks
  const addExamMarks = async (values: {
    id: string;
    studentId: string;
    name: string;
    marks: string;
  }) => {
    showNotification({
      id: "add-marks",
      loading: true,
      title: "Adding marks",
      message: "Please wait while we add marks to the database",
      autoClose: false,
    });
    ExamAPI.addExamMarks(selectedExam.id, values)
      .then((response) => {
        updateNotification({
          id: "add-marks",
          color: "teal",
          title: "Marks added successfully",
          message: "Marks added successfully",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        const newData = marks.map((item) => {
          if (item.id === values.id) {
            return {
              id: values.id,
              studentId: values.studentId,
              name: values.name,
              marks: values.marks,
            };
          } else {
            return item;
          }
        });
        setMarks(newData);
        setAddMarksOpened(false);
      })
      .catch((error) => {
        updateNotification({
          id: "add-marks",
          color: "red",
          title: "Adding marks failed",
          message: "We were unable to add marks to the database",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //declare edit form
  const editForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      id: "",
      examId: "",
      name: "",
      description: "",
      class: "",
      status: "",
      date: "",
      time: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      date: (value) =>
        /^\d{4}-\d{2}-\d{2}$/.test(value)
          ? null
          : "Invalid date of birth, date of birth must be in YYYY-MM-DD format",
    },
  });

  //declare add form
  const addForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: "",
      description: "",
      class: "",
      status: "",
      date: "",
      time: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  //declare add marks form
  const addMarksForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      id: "",
      studentId: "",
      name: "",
      marks: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

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

  //Open delete modal
  const openDeleteModal = (id: string) =>
    openConfirmModal({
      title: "Delete this exam record?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this exam record? This action cannot
          be undone.
        </Text>
      ),
      labels: {
        confirm: "Delete exam record",
        cancel: "No don't delete it",
      },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "The exam record was not deleted",
          color: "teal",
        });
      },
      onConfirm: () => {
        deleteExam(id);
      },
    });

  const saveAttendance = () => {
    showNotification({
      id: "save-attendance",
      loading: true,
      title: "Saving attendance",
      message: "Please wait while we save attendance to the database",
      autoClose: false,
    });
    ExamAPI.saveAttendance(selectedExam.id, attendance)
      .then((response) => {
        updateNotification({
          id: "save-attendance",
          color: "teal",
          title: "Attendance saved successfully",
          message: "Attendance saved successfully",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        setAttendanceOpened(false);
      })
      .catch((error) => {
        updateNotification({
          id: "save-attendance",
          color: "red",
          title: "Saving attendance failed",
          message: "We were unable to save attendance to the database",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  const releaseUnOfficialResults = () => {
    showNotification({
      id: "release-results",
      loading: true,
      title: "Releasing results",
      message: "Please wait..",
      autoClose: false,
    });
    ExamAPI.releaseUnofficialResults(selectedExam.id)
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
        releaseUnOfficialResults();
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
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Tooltip label="Edit Exam">
            <ActionIcon
              onClick={() => {
                editForm.setValues({
                  id: row.id,
                  examId: row.examId,
                  name: row.name,
                  description: row.description,
                  class: row.class,
                  status: row.status,
                  date: row.date.slice(0, 10),
                  time: row.time,
                });
                setEditOpened(true);
              }}
            >
              <IconEdit size="24px" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Add, View and Edit Attendance">
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
          <Tooltip label="Add, View and Edit Results">
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
          <Tooltip label="Delete Exam">
            <ActionIcon onClick={() => openDeleteModal(row.id)} color="red">
              <IconTrash size="24px" stroke={1.5} />
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
              w={250}
              mr="md"
              onClick={() => {
                openReleaseResultsModal();
              }}
              leftIcon={<IconRocket size={14} stroke={1.5} />}
              disabled={selectedExam.status === "Results Released - Unofficial"}
            >
              {selectedExam.status === "Results Released - Unofficial"
                ? "Results Released - Unofficial"
                : "Release Unofficial Results"}
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((enrollment: ExamMarksData) => (
                  <tr key={enrollment.id}>
                    <td>{enrollment.studentId}</td>
                    <td>{enrollment.name}</td>
                    <td>{enrollment.marks}</td>
                    <td>
                      <Button
                        variant="gradient"
                        gradient={{ from: "indigo", to: "cyan" }}
                        sx={{ width: "125px" }}
                        onClick={() => {
                          addMarksForm.setValues({
                            id: enrollment.id,
                            studentId: enrollment.studentId,
                            name: enrollment.name,
                            marks: enrollment.marks,
                          });
                          setAddMarksOpened(true);
                        }}
                      >
                        {enrollment.marks === "-" ? "Add Marks" : "Edit Marks"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>
        </Box>
      </Modal>
      <Modal
        opened={addOpened}
        onClose={() => {
          addForm.reset();
          setAddOpened(false);
        }}
        title="Add exam Record"
      >
        <form onSubmit={addForm.onSubmit((values) => addExam(values))}>
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...addForm.getInputProps("name")}
            required
          />
          <TextInput
            label="Description"
            placeholder="Enter description"
            {...addForm.getInputProps("description")}
            required
          />
          <Select
            label="Class"
            placeholder="Select class"
            {...addForm.getInputProps("class")}
            required
            data={classes.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
          <Select
            label="Status"
            placeholder="Select status"
            {...addForm.getInputProps("status")}
            required
            data={[
              { label: "Scheduled", value: "Scheduled" },
              { label: "Results Pending", value: "Results Pending" },
              { label: "Results Added", value: "Results Added" },
              {
                label: "Results Released - Unofficial",
                value: "Results Released - Unofficial",
              },
              {
                label: "Results Released - Official",
                value: "Results Released - Official",
              },
            ]}
          />
          <DatePicker
            placeholder="Pick date"
            label="Exam date"
            inputFormat="YYYY-MM-DD"
            icon={<IconCalendar size={16} />}
            required
            onChange={(date) => {
              if (date) {
                const formattedDate = date
                  .toString()
                  .slice(0, 10)
                  .replace(/-/g, "-");
                addForm.setFieldValue("date", formattedDate);
              }
            }}
          />
          <TimeRangeInput
            label="Time"
            icon={<IconClock size={16} />}
            format="12"
            clearable
            onChange={(time) => {
              if (time[0] && time[1]) {
                const startTime = time[0].toString().slice(16, 21);
                const endTime = time[1].toString().slice(16, 21);
                addForm.setFieldValue("time", startTime + " - " + endTime);
              }
            }}
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Create
          </Button>
        </form>
      </Modal>
      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          setEditOpened(false);
        }}
        title={"Edit Exam " + editForm.values.examId}
      >
        <form onSubmit={editForm.onSubmit((values) => editExam(values))}>
          <TextInput
            disabled
            {...editForm.getInputProps("id")}
            required
            hidden
          />
          <TextInput
            {...editForm.getInputProps("examId")}
            disabled
            required
            hidden
          />
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...editForm.getInputProps("name")}
            required
          />
          <TextInput
            label="Description"
            placeholder="Enter description"
            {...editForm.getInputProps("description")}
            required
          />
          <Select
            label="Class"
            placeholder="Select class"
            {...editForm.getInputProps("class")}
            required
            data={classes.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            defaultValue={editForm.values.class}
          />
          <Select
            label="Status"
            placeholder="Select status"
            {...editForm.getInputProps("status")}
            required
            data={[
              { label: "Scheduled", value: "scheduled" },
              { label: "Results Pending", value: "results pending" },
              { label: "Results Added", value: "results added" },
              {
                label: "Results Released - Unofficial",
                value: "Results Released - Unofficial",
              },
              {
                label: "Results Released - Official",
                value: "Results Released - official",
              },
            ]}
            defaultValue={editForm.values.status}
          />
          <DatePicker
            placeholder="Pick date"
            label="Exam date"
            inputFormat="YYYY-MM-DD"
            icon={<IconCalendar size={16} />}
            required
            onChange={(date) => {
              if (date) {
                const formattedDate = date
                  .toString()
                  .slice(0, 10)
                  .replace(/-/g, "-");
                editForm.setFieldValue("date", formattedDate);
              }
            }}
            defaultValue={
              editForm.values.date ? new Date(editForm.values.date) : undefined
            }
          />
          <TimeRangeInput
            label="Time"
            icon={<IconClock size={16} />}
            format="12"
            clearable
            onChange={(time) => {
              if (time[0] && time[1]) {
                const startTime = time[0].toString().slice(16, 21);
                const endTime = time[1].toString().slice(16, 21);
                editForm.setFieldValue("time", startTime + " - " + endTime);
              }
            }}
            defaultValue={
              editForm.values.time
                ? [
                    new Date("2021-01-01 " + editForm.values.time.slice(0, 5)),
                    new Date("2021-01-01 " + editForm.values.time.slice(8, 13)),
                  ]
                : undefined
            }
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Save
          </Button>
        </form>
      </Modal>
      <Modal
        opened={addMarksOpened}
        onClose={() => {
          addMarksForm.reset();
          setAddMarksOpened(false);
        }}
        title={"Exam Marks - " + addMarksForm.values.studentId}
      >
        <form
          onSubmit={addMarksForm.onSubmit((values) => addExamMarks(values))}
        >
          <TextInput
            disabled
            {...addMarksForm.getInputProps("id")}
            required
            hidden
          />
          <TextInput
            label="Student ID"
            {...addMarksForm.getInputProps("studentId")}
            required
            readOnly
          />
          <TextInput
            label="Name"
            {...addMarksForm.getInputProps("name")}
            required
            readOnly
          />
          <TextInput
            label="Marks"
            placeholder="Enter marks"
            {...addMarksForm.getInputProps("marks")}
            required
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Save
          </Button>
        </form>
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
                    <td>{record.studentId}</td>sss
                    <td>{record.name}</td>
                    <td>
                      <Checkbox
                        checked={record.status}
                        onChange={(e) => {
                          const item = attendance.find(
                            (item) => item.id === record.id
                          );
                          if (item) {
                            item.status = e.target.checked;
                            setAttendance([...attendance]);
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100px" }}
            onClick={() => {
              saveAttendance();
            }}
          >
            Save
          </Button>
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
          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            sx={{ width: "200px", marginRight: "20px" }}
            onClick={() => setAddOpened(true)}
          >
            Add Exam
          </Button>
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

export default ManageExams;
