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
  Badge,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons";
import ExamAPI from "../../API/ExamAPI";
import { ClassData } from "../../pages/ExamPortal/Teacher/TeacherExamPortalDashboard/TeacherExamPortalDashboard";

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

interface MyExamsProps {
  exams: ExamData[];
  setExams: (exams: ExamData[]) => void;
  classes: ClassData[];
  setClasses: (classes: ClassData[]) => void;
  loading: boolean;
  sortedData: ExamData[];
  setSortedData: (sortedData: ExamData[]) => void;
}

const MyExams = ({
  exams,
  setExams,
  classes,
  setClasses,
  loading,
  sortedData,
  setSortedData,
}: MyExamsProps) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof ExamData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

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

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row.id}>
      <td>{row.name}</td>
      <td>{row.description}</td>
      <td>{classes.find((item) => item.id === row.class)?.name || "N/A"}</td>
      <td>{row.status}</td>
      <td>{row.date.slice(0, 10)}</td>
      <td>{row.time}</td>
      <td>
        {row.result === "Not Released" ? (
          <Badge variant="gradient" gradient={{ from: "orange", to: "red" }}>
            {row.result}
          </Badge>
        ) : (
          <Badge variant="gradient" gradient={{ from: "indigo", to: "cyan" }}>
            {row.result}
          </Badge>
        )}
      </td>
    </tr>
  ));

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
                <th>Result</th>
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

export default MyExams;
