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
  IconPlus,
} from "@tabler/icons";
import { showNotification, updateNotification } from "@mantine/notifications";
// import {ClassAPI} from "../../API/classAPI";
// import SubjectAPI from "../../API/subjectAPI";
// import StudentAPI from "../../API/studentAPI";
import TeacherAPI from "../../API/teacherAPI";
import { IconCheck } from "@tabler/icons";


//Interface for class data - (Raw data)
interface RowData {
  _id:string;
  id: string;
  name: string;
  teacher: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
}

interface RowDataSubjects {
  id: string;
  name: string;
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
  parent: string;
}

//Get all students records from the database
// const getAllStudents = async () => {
//   const response = await StudentAPI.getStudents();
//   const data = await response.data;
//   return data;
// };

//Get all classs records from the database
const getAllClasses = async () => {
  const response = await TeacherAPI.getAllClasses();
  const data = await response.data;
  return data;
};



//Get all teacher records from the database
// const getAllTeachers = async () => {
//   const response = await TeacherAPI.getTeachers();
//   const data = await response.data;
//   return data;
// };

//Get all subject records from the database
// const getAllSubject = async () => {
//   const response = await SubjectAPI.getSubjects();
//   const data = await response.data;
//   return data;
// };

//get enrollnment records from the database
// const getEnrollments = async (id: string) => {
//   const response = await ClassAPI.getEnrollments(id);
//   const data = await response.data;
//   return data;
// };

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

const MyClassesTeacher: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  // const [teachers, setTeachers] = useState([]);
  // const [subjects, setSubjects] = useState([]);
  // const [students, setStudents] = useState([]);
  

 // fetch class data
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
      const resultClasses = await getAllClasses();
      const classes = resultClasses.map((item: any) => ({
        _id: item._id,
        id:item.id,
        name: item.name,
        teacher: item.teacher,
        subject: item.subject,
        date: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
        venue: item.venue,
      }));
      //filter classes by teacher id
      const teacher = JSON.parse(localStorage.getItem("teacher") || "{}");
      const teacherID = teacher._id;

      const filteredClasses = classes.filter(
        (item: any) => item.teacher === teacherID
      );

      // const resultTeachers = await getAllTeachers();
      // const teachers = resultTeachers.map((item: any) => ({
      //   id: item._id,
      //   name: item.name,
      // }));

      // const resultSubjects = await getAllSubject();
      // const subjects = resultSubjects.map((item: any) => ({
      //   id: item._id,
      //   name: item.name,
      // }));

      // const resultStudents = await getAllStudents();
      // const students = resultStudents.map((item: any) => ({
      //   id: item._id,
      //   name: item.name,
      //   email: item.email,
      //   phone: item.phone,
      //   school: item.school,
      //   grade: item.grade,
      //   birthDate: item.birthDate,
      //   address: item.address,
      //   parent: item.parent,
      // }));

      setData(data);
      const payload = {
        sortBy: null,
        reversed: false,
        search: "",
      };

      
      // setData(filteredClasses);
      // setTeachers(teachers);
      // setSubjects(subjects);
      // setStudents(students);
      setSortedData(sortData(classes, payload));
      setLoading(false);
      updateNotification({
        id: "loding-data",
        color: "teal",
        title: "Data loaded successfully",
        message:
          "You can now manage classs by adding, editing or deleting them.",
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
  const [enrollOpened, setEnrollOpened] = useState(false);

  const [enrollData, setEnrollData] = useState<RowDataStudents[]>([]);
  const [editClassID, setEditClassID] = useState("");

  //get enroll data from api
  // const getEnrollData = async (id: string) => {
  //   showNotification({
  //     id: "loding-enroll",
  //     loading: true,
  //     title: "Loading data",
  //     message: "Please wait while we load the data",
  //     autoClose: false,
  //     disallowClose: true,
  //   });
  //   const result = await getEnrollments(id);
  //   const enrollments = result.map((item: any) => ({
  //     id: item._id,
  //     name: item.name,
  //     email: item.email,
  //     phone: item.phone,
  //   }));
  //   setEnrollData(enrollments);
  //   setEnrollOpened(true);
  //   updateNotification({
  //     id: "loding-enroll",
  //     color: "teal",
  //     title: "Data loaded successfully",
  //     message: "You can now manage enrollments",
  //     icon: <IconCheck size={16} />,
  //     autoClose: 3000,
  //   });
  // };

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

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row._id}>
      <td>{row.id}</td>
      <td>{row.name}</td>
      <td>{row.subject}</td>
      <td>{row.date}</td>
      <td>{new Date(row.startTime).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true})}</td>
      <td>{new Date(row.endTime).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true})}</td>
      <td>{row.venue}</td>
      {/* <td>
        {subjects.map((subject: RowDataSubjects) => {
          if (subject.id === row.subject) {
            return subject.name;
          }
        })}
      </td> */}
      {/* <td>{row.date}</td>
      <td>{row.startTime}</td>
      <td>{row.endTime}</td>
      <td>{row.venue}</td> */}
      {/* <td>
        <Button
          color="yellow"
          leftIcon={<IconPlus size={14} />}
          onClick={() => {
            setEditClassID(row.id);
            getEnrollData(row.id);
          }}
          sx={{ margin: "5px", width: "125px" }}
        >
          Enrolments
        </Button>
      </td> */}
    </tr>
  ));

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Modal
        opened={enrollOpened}
        onClose={() => {
          setEnrollOpened(false);
        }}
        title="Enrolments"
        size="1000px"
      >
        <Box sx={{ margin: "20px", width: "100%" }}>
          {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <TextInput
              placeholder="Search by any field"
              mb="md"
              icon={<IconSearch size={14} stroke={1.5} />}
              value={search}
              onChange={() => {}}
              sx={{ width: "300px" }}
            />
          </Box> */}
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
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {enrollData.map((enrollment: RowDataStudents) => (
                  <tr key={enrollment.id}>
                    <td>{enrollment.id}</td>
                    <td>{enrollment.name}</td>
                    <td>{enrollment.email}</td>
                    <td>{enrollment.phone}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>
        </Box>
      </Modal>
      <Box sx={{ margin: "20px", width: "100%" }}>
        {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextInput
           placeholder="Search by any field"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
            sx={{ width: "300px" }}
          />
        </Box> */}
        <ScrollArea>
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            sx={{ tableLayout: "fixed", width: "100%" }}
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
                  sorted={sortBy === "subject"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("subject")}
                >
                  Subject
                </Th>
                <Th
                  sorted={sortBy === "date"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("date")}
                >
                  Date
                </Th>
                <Th
                  sorted={sortBy === "startTime"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("startTime")}
                >
                  Start Time
                </Th>
                <Th
                  sorted={sortBy === "endTime"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("endTime")}
                >
                  End Time
                </Th>
                <Th
                  sorted={sortBy === "venue"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("venue")}
                >
                  Venue
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

export default MyClassesTeacher;
