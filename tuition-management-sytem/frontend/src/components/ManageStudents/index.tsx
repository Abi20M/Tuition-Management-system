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
  PasswordInput,
  Select,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconChartBar,
  IconDots,
  IconLink,
  IconFileAnalytics,
} from "@tabler/icons";
import { IconEdit, IconTrash } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import StudentAPI from "../../API/studentAPI";
import { adminAPI } from "../../API/adminAPI";
import ParentAPI from "../../API/ParentAPI";

import { IconCheck, IconAlertTriangle } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { StudentPDF } from "../PDFRender/StudentPDFTemplate";
import { DatePicker } from "@mantine/dates";

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
  _id: string;
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

//Interface for parent data - (Raw data)
interface RowDataParent {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
}

//Get all students records from the database
const getAllStudents = async () => {
  const response = await StudentAPI.getStudents();
  const data = await response.data;
  return data;
};

// //Get all parent records from the database
const getAllParents = async () => {
  const response = await ParentAPI.getParents();
  const data = await response.data;
  return data;
};

// //Get all exams from the database
// const getExamsByStudentId = async (id: string) => {
//   const response = await adminAPI.getExamsByStudentId(id);
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

//get current Full Date
const today = new Date();

const year = today.getFullYear();
const month = today.getMonth() + 1;
const date = today.getDate();

interface adminName {
  user: {
    name: string;
    email: string;
  };
}

const ManageStudents = ({ user }: adminName) => {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState<RowDataParent[]>([]);
  const [performanceOpened, setPerformanceOpened] = useState(false);
  const [performanceData, setPerformanceData] = useState(performanceDataSample);

  const adminName = user.name;

  // fetch student data
  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "Please wait while we load the data",
        autoClose: false,
        disallowClose: false,
      });
      const result = await getAllStudents();

      const resultParent = await getAllParents();

      const data = result.map((item: any) => {
        return {
          _id: item._id,
          id: item.id,
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

      const dataParent = resultParent.map((item: any) => {
        return {
          _id: item._id,
          id: item.id,
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
  const [opened, setOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);

  const fetchParentDetails = async () => {
    const resultParent = await getAllParents();

    const dataParent = resultParent.map((item: any) => {
      return {
        _id: item._id,
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
      };
    });

    setParents(dataParent);
  };
  //edit student form
  const editStudent = async (values: {
    _id: string;
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
  }) => {
    showNotification({
      id: "edit-student",
      loading: true,
      title: "Updating student " + values.name,
      message: "Please wait while we update the student",
      autoClose: false,
      disallowClose: true,
    });
    StudentAPI.editStudent(values)
      .then((response) => {
        updateNotification({
          id: "edit-student",
          color: "teal",
          title: "student updated successfully",
          message: "student " + values.name + " has been updated successfully",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        editForm.reset();
        setEditOpened(false);
        const newData = data.map((item) => {
          if (item.id === values.id) {
            return {
              _id: values._id,
              id: values.id,
              name: values.name,
              email: values.email,
              phone: values.phone,
              school: values.school,
              grade: values.grade,
              birthDate: values.birthDate,
              address: values.address,
              gender: values.gender,
              parent: values.parent,
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
        setData(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "edit-student",
          color: "red",
          title: "Update failed",
          message: "We were unable to update student data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //add student
  const addStudent = async (values: {
    name: string;
    email: string;
    phone: string;
    school: string;
    grade: string;
    birthDate: string;
    address: string;
    gender: string;
    parent: string;
  }) => {
    showNotification({
      id: "add-student",
      loading: true,
      title: "Adding student",
      message: "Please wait while we add the student..",
      autoClose: false,
      disallowClose: true,
    });
    StudentAPI.addStudent(values)
      .then((response) => {
        updateNotification({
          id: "add-student",
          color: "teal",
          title: "student added successfully",
          message: "student " + values.name + " has been added successfully",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        addForm.reset();
        setOpened(false);
        const newData = [
          ...data,
          {
            _id: response.data._id,
            id: response.data.id,
            name: values.name,
            email: values.email,
            phone: values.phone,
            school: values.school,
            grade: values.birthDate,
            birthDate: values.birthDate,
            address: values.address,
            gender: values.gender,
            parent: values.parent,
          },
        ];
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };
        setData(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "add-student",
          color: "red",
          title: "Adding student failed",
          message: "We were unable to add the student to the database",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //delete student
  const deleteStudent = async (id: string) => {
    showNotification({
      id: "delete-student",
      loading: true,
      title: "Deleting student " + id,
      message: "Please wait while we delete the student record",
      autoClose: false,
      disallowClose: true,
    });
    StudentAPI.deleteStudent(id)
      .then((response) => {
        updateNotification({
          id: "delete-student",
          color: "teal",
          title: "student record deleted successfully",
          message: "student record " + id + " has been deleted successfully",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        const newData = data.filter((item) => item._id !== id);
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };
        setData(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "delete-student",
          color: "red",
          title: "Deleting student record failed",
          message: "We were unable to delete the student record",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //declare edit form
  const editForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      _id: "",
      id: "",
      name: "",
      email: "",
      phone: "",
      school: "",
      grade: "",
      birthDate: "",
      address: "",
      gender: "",
      parent: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",
      phone: (value) =>
        /^\d{10}$/.test(value)
          ? null
          : "Phone number must be 10 digits long number",
      birthDate: (value) =>
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
      email: "",
      password: "",
      phone: "",
      school: "",
      grade: "",
      birthDate: "",
      address: "",
      gender: "",
      parent: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",
      phone: (value) =>
        /^\d{10}$/.test(value)
          ? null
          : "Phone number must be 10 digits long number",
      // birthDate: (value) =>
      // /^\d{2}\/\d{2}\/\d{4}$/.test(value)
      //     ? null
      //     : "Invalid date of birth, date of birth must be in YYYY-MM-DD format",

      grade: (value) =>
        parseInt(value) <= 0 || parseInt(value) > 13 ? "Invalid Grade" : null,
    },
  });

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

  //Open delete modal
  const openDeleteModal = (id: string) =>
    openConfirmModal({
      title: "Delete this student?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this student? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: "Delete student", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "The student record was not deleted",
          color: "teal",
        });
      },
      onConfirm: () => {
        deleteStudent(id);
      },
    });

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

    // const resultExams = await getExamsByStudentId(id);
    // const exams = resultExams.map((item: any) => ({
    //   id: item._id,
    //   name: item.name,
    //   description: item.description,
    //   subject: item.subject,
    //   date: item.date,
    //   time: item.time,
    //   marks: item.marks,
    // }));

    // //get the last 6 exams
    // const lastSixExams = exams.slice(Math.max(exams.length - 6, 0));
    // //get the last 6 exams marks of logged in student
    // const studentID = id;
    // const studentMarks = [0, 0, 0, 0, 0, 0];

    // for (let i = 0; i < lastSixExams.length; i++) {
    //   for (let j = 0; j < lastSixExams[i].marks.length; j++) {
    //     if (lastSixExams[i].marks[j].id === studentID) {
    //       studentMarks[i] = lastSixExams[i].marks[j].marks;
    //     }
    //   }
    // }

    //   //reverse the array to show the latest exam first
    //   studentMarks.reverse();

    //   const performanceData = {
    //   labels,
    //   datasets: [
    //     {
    //       label: "Student Performance (Last 6 Exams)",
    //       data: studentMarks,
    //       borderColor: "rgb(255, 99, 132)",
    //       backgroundColor: "rgba(255, 99, 132, 0.5)",
    //     },
    //   ],
    // };
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
      <td>{new Date(row.birthDate).toLocaleDateString("en-GB")}</td>
      <td>{row.gender}</td>
      <td>{row.address}</td>
      <td>
        {parents.map((parentObj: RowDataParent) => {
          if (parentObj._id === row.parent) {
            return parentObj.name;
          }
        })}
      </td>
      <td>
        <Menu
          position="bottom"
          shadow="md"
          width={150}
          withArrow
          arrowPosition="center"
          transition={"slide-up"}
          transitionDuration={100}
        >
          <Menu.Target>
            <ActionIcon>
              <IconDots size={20} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            {/* <Menu.Label>Enroll Students</Menu.Label> */}
            <Menu.Item
              lh={0}
              color={"blue"}
              icon={<IconLink size={14} />}
              onClick={() => {
                loadStudentPerformance(row.id);
              }}
            >
              Performance
            </Menu.Item>

            <Menu.Divider />
            {/* <Menu.Label>Edit Class Details</Menu.Label> */}
            <Menu.Item
              lh={0}
              color={"green"}
              icon={<IconEdit size={14} />}
              onClick={() => {
                editForm.setValues({
                  _id: row._id,
                  id: row.id,
                  name: row.name,
                  email: row.email,
                  phone: row.phone,
                  school: row.school,
                  grade: row.grade,
                  birthDate: new Date(row.birthDate).toLocaleDateString("en-GB"),
                  gender: row.gender,
                  address: row.address,
                  parent: row.parent,
                });
                setEditOpened(true);
                fetchParentDetails();
              }}
            >
              Edit
            </Menu.Item>
            <Menu.Divider />
            {/* <Menu.Label>Delete Class Details</Menu.Label> */}
            <Menu.Item
              lh={0}
              color={"red"}
              icon={<IconTrash size={14} />}
              onClick={() => openDeleteModal(row._id)}
            >
              Delete{" "}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      {/* <Modal
        opened={performanceOpened}
        onClose={() => {
          setPerformanceOpened(false);
        }}
        title="Student Performance"
      >
      <Line options={options} data={performanceData} />
      </Modal> */}
      <Modal
        opened={opened}
        onClose={() => {
          addForm.reset();
          setOpened(false);
        }}
        title="Add student"
      >
        <form onSubmit={addForm.onSubmit((values) => addStudent(values))}>
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...addForm.getInputProps("name")}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            {...addForm.getInputProps("email")}
            required
          />
          <TextInput
            label="Phone"
            placeholder="Enter phone"
            {...addForm.getInputProps("phone")}
            required
          />
          <TextInput
            label="School"
            placeholder="Enter school"
            {...addForm.getInputProps("school")}
            required
          />
          <TextInput
            label="Grade"
            placeholder="Enter grade"
            {...addForm.getInputProps("grade")}
            required
          />

          <DatePicker
            placeholder="Select Birth Date"
            label="Birth Date"
            withAsterisk
            required
            allowFreeInput
            {...addForm.getInputProps("birthDate")}
          />

          <TextInput
            label="Address"
            placeholder="Enter address"
            {...addForm.getInputProps("address")}
            required
          />
          <Select
            label="Gender"
            placeholder="Select gender"
            {...addForm.getInputProps("gender")}
            required
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />

          <Select
            label="Parent"
            placeholder="Enter Parent"
            {...addForm.getInputProps("parent")}
            data={parents.map((parent: RowDataParent) => {
              return { value: parent._id, label: parent.name };
            })}
            required
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Add
          </Button>
        </form>
      </Modal>
      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          setEditOpened(false);
        }}
        title="Edit student"
      >
        <form onSubmit={editForm.onSubmit((values) => editStudent(values))}>
          <TextInput
            label="ID"
            placeholder="Enter ID"
            disabled
            {...editForm.getInputProps("id")}
            required
          />
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...editForm.getInputProps("name")}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            {...editForm.getInputProps("email")}
            required
          />
          <TextInput
            label="Phone"
            placeholder="Enter phone"
            {...editForm.getInputProps("phone")}
            required
          />
          <TextInput
            label="School"
            placeholder="Enter school"
            {...editForm.getInputProps("school")}
            required
          />
          <TextInput
            label="Grade"
            placeholder="Enter grade"
            {...editForm.getInputProps("grade")}
            required
          />
          <TextInput
            label="Birth Date"
            placeholder="Enter birth date"
            {...editForm.getInputProps("birthDate")}
            required
          />
          <TextInput
            label="Address"
            placeholder="Enter address"
            {...editForm.getInputProps("address")}
            required
          />
          <Select
            label="Gender"
            placeholder="Select gender"
            {...editForm.getInputProps("gender")}
            required
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            defaultValue={editForm.values.gender}
          />
          <Select
            label="Parent"
            placeholder="Enter Parent"
            defaultValue={editForm.values.parent}
            {...editForm.getInputProps("parent")}
            data={parents.map((parent: RowDataParent) => {
              return { value: parent._id, label: parent.name };
            })}
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
      <Box sx={{ margin: "20px", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <TextInput
            placeholder="Search by any field"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
            sx={{ width: "475px" }}
          />

          {/* <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            sx={{ width: "200px", marginRight: "20px", marginLeft: 20 }}
          // onClick={() => setOpened(true)}
          >
            Generate Report
          </Button> */}
          {/* download Report button */}
          <PDFDownloadLink
            document={
              <StudentPDF data={data} parent={parents} user={adminName} />
            }
            fileName={`STUDENTDETAILS_${year}_${month}_${date}`}
          >
            {({ loading }) =>
              loading ? (
                <Button
                  color="red"
                  disabled
                  loading
                  leftIcon={<IconFileAnalytics size={16} />}
                >
                  Generating...
                </Button>
              ) : (
                <Button color="red" leftIcon={<IconFileAnalytics size={16} />}>
                  Generate Report
                </Button>
              )
            }
          </PDFDownloadLink>

          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            sx={{ width: "200px", marginRight: "20px" }}
            onClick={() => {
              setOpened(true);
              fetchParentDetails();
            }}
          >
            Add Student
          </Button>
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
            horizontalSpacing="md"
            verticalSpacing="xs"
            sx={{ minWidth: 700 }}
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

export default ManageStudents;
