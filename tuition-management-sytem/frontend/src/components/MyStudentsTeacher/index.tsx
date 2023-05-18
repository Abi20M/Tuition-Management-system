import { useState, useEffect } from "react";
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
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconChartBar,
} from "@tabler/icons";
import { showNotification, updateNotification } from "@mantine/notifications";
import TeacherAPI from "../../API/teacherAPI";
import ParentAPI from "../../API/ParentAPI";
import { IconCheck } from "@tabler/icons";

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
      text: "Past 6 Exam Scores",
    },
  },
};

const labels = ["Exam 1", "Exam 2", "Exam 3", "Exam 4", "Exam 5", "Exam 6"];

export const performanceDataSample = {
  labels,
  datasets: [
    {
      label: "English",
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Math",
      data: [28, 48, 40, 19, 86, 27, 90],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

//Interface for student data - (Raw data)
interface RowData {
  _id:string;
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  birthDate: string;
  gender: string;
  address: string;
  parent: string;
}

//Interface for parent data - (Raw data)
interface RowDataParent {
  id: string;
  name: string;
  email: string;
  phone: string;
}

//Get all students records from the database
const getAllStudents = async () => {
  const response = await TeacherAPI.getStudents();
  const data = await response.data;
  return data;
};

//Get all parent records from the database
const getAllParents = async () => {
  const response = await ParentAPI.getParents();
  const data = await response.data;
  return data;
};

//Get all exams from the database
const getExamsByStudentId = async (id: string) => {
  const response = await TeacherAPI.getExamsByStudentId(id);
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
function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

//Sort Data
function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
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

const MyStudentsTeacher: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState<RowDataParent[]>([]);
  const [performanceOpened, setPerformanceOpened] = useState(false);
  const [performanceData, setPerformanceData] = useState(performanceDataSample);

  // fetch student data
  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "Please wait while we load the data",
        autoClose: false,
        disallowClose: true,
      });
      const result = await getAllStudents();
      const resultParent = await getAllParents();
      const data = result.map((item: any) => {
        return {
          _id: item._id,
          id:item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          school: item.school,
          grade: item.grade,
          birthDate: item.birthDate,
          gender: item.gender,
          address: item.address,
          parent: item.parent,
        };
      });
      const dataParent = resultParent.map((item: any) => {
        return {
          id: item._id,
          name: item.name,
          email: item.email,
          phone: item.phone,
        };
      });

      setData(data);
      setParents(dataParent);
      setLoading(false);
      const payload = {
        sortBy: null,
        reversed: false,
        search: "",
      };
      setSortedData(sortData(data, payload));
      updateNotification({
        id: "loding-data",
        color: "teal",
        title: "Data loaded successfully",
        message:
          "You can now manage students by adding, editing or deleting them.",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
    };
    fetchData();
  }, []);

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  //async function to get student data
  const loadStudentPerformance = async (id: string) => {
    showNotification({
      id: "load-student-performance",
      loading: true,
      title: "Loading student performance",
      message: "Please wait while we load the student performance",
      autoClose: false,
      disallowClose: true,
    });

    const resultExams = await getExamsByStudentId(id);
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
    const studentID = id;
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

    const performanceData = {
      labels,
      datasets: [
        {
          label: "Student Performance (Last 6 Exams)",
          data: studentMarks,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
    setPerformanceData(performanceData);
    setPerformanceOpened(true);
    updateNotification({
      id: "load-student-performance",
      color: "teal",
      title: "Student performance loaded successfully",
      message: "Student performance has been loaded successfully",
      icon: <IconCheck size={16} />,
      autoClose: 5000,
    });
  };

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row._id}>
      <td>{row.id}</td>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>{row.phone}</td>
      <td>{row.school}</td>
      <td>{row.grade}</td>
      <td>{row.birthDate.slice(0, 10)}</td>
      <td>{row.gender}</td>
      <td>{row.address}</td>
      <td>
        {parents.map((parentObj: RowDataParent) => {
          if (parentObj.id === row.parent) {
            return parentObj.name;
          }
        })}
      </td>
      <td>
        {
          //parents phone
          parents.map((parentObj: RowDataParent) => {
            if (parentObj.id === row.parent) {
              return parentObj.phone;
            }
          })
        }
      </td>
      {/* <td>
        <Button
          color="green"
          leftIcon={<IconChartBar size={16} />}
          sx={{ margin: "5px", width: "100px" }}
          onClick={() => {
            loadStudentPerformance(row.id);
          }}
        >
          Performance
        </Button>
      </td> */}
    </tr>
  ));

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Modal
        opened={performanceOpened}
        onClose={() => {
          setPerformanceOpened(false);
        }}
        title="Student Performance"
      >
        <Line options={options} data={performanceData} />
      </Modal>
      <Box sx={{ margin: "20px", width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextInput
            placeholder="Search by any field"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
            sx={{ width: "600px" }}
          />
        </Box>
        <ScrollArea
          sx={{
            height: 700,
            width: 1500,
            marginLeft: -300,
            marginBottom: -163,
          }}
        >
          <Table
            highlightOnHover
            horizontalSpacing="md"
            verticalSpacing="xs"
            sx={{ minwidth: 700 }}
          >
            <thead>
              <tr>
                <Th
                  sorted={sortBy === "id"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("id")}
                >
                  ID
                </Th>
                <Th
                  sorted={sortBy === "name"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("name")}
                >
                  Name
                </Th>
                <Th
                  sorted={sortBy === "email"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("email")}
                >
                  Email
                </Th>
                <Th
                  sorted={sortBy === "phone"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("phone")}
                >
                  Phone
                </Th>
                <Th
                  sorted={sortBy === "school"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("school")}
                >
                  School
                </Th>
                <Th
                  sorted={sortBy === "grade"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("grade")}
                >
                  Grade
                </Th>
                <Th
                  sorted={sortBy === "birthDate"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("birthDate")}
                >
                  Birth Date
                </Th>
                <Th
                  sorted={sortBy === "gender"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("gender")}
                >
                  Gender
                </Th>
                <Th
                  sorted={sortBy === "address"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("address")}
                >
                  Address
                </Th>
                <Th
                  sorted={sortBy === "parent"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("parent")}
                >
                  Parent
                </Th>
                <Th
                  sorted={sortBy === "parent"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("parent")}
                >
                  Parent Phone
                </Th>
                {/* <th>Action</th> */}
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

export default MyStudentsTeacher;