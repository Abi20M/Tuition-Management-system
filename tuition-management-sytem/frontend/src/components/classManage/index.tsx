import { useEffect, useRef, useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Button,
  Menu,
  ActionIcon,
  Box,
  Modal,
  useMantineTheme,
  Select,
  NativeSelect,
  Space,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconDots,
  IconEdit,
  IconTrash,
  IconLink,
  IconPlus,
  IconFileAnalytics,
  IconCheck,
  IconX,
  IconClock,
  IconAlertTriangle,
} from "@tabler/icons";
import { useForm } from "@mantine/form";
import { ClassAPI } from "../../API/classAPI";
import { showNotification, updateNotification } from "@mantine/notifications";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ClassPDF } from "../PDFRender/ClassPDFTemplate";
import { openConfirmModal } from "@mantine/modals";
import StudentAPI from "../../API/studentAPI";
import { isConstructorDeclaration } from "typescript";

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
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

interface RowData {
  _id: string;
  name: string;
  id: string;
  teacher: string;
  subject: string;
  day: string;
  startTime: string;
  venue: string;
  endTime: string;
}

interface HallData {
  _id: String;
  hallID: String;
  capacity: Number;
}

interface StudentDetails {
  _id: string;
  id: string;
  name: string;
  email: string;
  grade: string;
  phone: string;
}

interface TableSortProps {
  data: RowData[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

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

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

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

//get All class details seperated function
const getAllClasses = async () => {
  try {
    const rowClassDetails = await ClassAPI.getAllClasses();
    return rowClassDetails.data;
  } catch (error) {
    return error;
  }
};

//get hall details function

const getAllHallDetails = async () => {
  try {
    const rowHallDetails = await ClassAPI.getAllHallDetails();
    return rowHallDetails.data;
  } catch (error) {
    return error;
  }
};

// get registered student details
const getStudentDetails = async () => {
  try {
    const rowStudetDetails = await StudentAPI.getStudents();
    return rowStudetDetails.data;
  } catch (error) {
    return error;
  }
};

// get enrolled student details
const fethClassDetailsById = async (classId: string) => {
  return ClassAPI.getClassById(classId)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

//created prop type
interface adminName {
  user: {
    name: string;
  };
}

//prop { data }: TableSortProps
const ClassManage = ({ user }: adminName) => {
  const [classDetails, setClassDetails] = useState<RowData[]>([]); //set class details
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(classDetails);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openedAddClassModal, setOpenedAddClassModal] = useState(false);
  const [daySearchValue, setDaySearchValue] = useState("");
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  const [hallDetails, setHallDetails] = useState<HallData[]>([]);
  const [openEditClassModal, setOpenEditClassModal] = useState(false);
  const [openEnrollModal, setOpenEnrollModel] = useState(false);
  const [enrollClassName, setEnrollClassName] = useState("");
  const [selectedEnrollClassId, setSelectedEnrollClassId] = useState("");
  const [studentDetails, setStudentDetails] = useState<StudentDetails[]>([]);
  const [selectEnrollStudent, setSelectEnrollStudent] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState<StudentDetails[]>([]);

  //set admin name
  const adminName = user.name;

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(classDetails, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(classDetails, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  // delete class modal
  const openDeleteModal = (name: string, id: string) =>
    openConfirmModal({
      title: `Do you want to delete ${name} ? `,
      centered: true,
      children: (
        <Text size={"sm"}>
          Are you sure you want to delete this class ? This action cannot be
          undone!
        </Text>
      ),
      labels: { confirm: "Delete class", cancel: "No don't delete it" },
      confirmProps: { color: "red", leftIcon: <IconTrash size={16} /> },
      onConfirm: () => deleteClass(name, id),
      onCancel: () => {
        showNotification({
          id: "cancel-delete",
          autoClose: 3000,
          title: `${name} was not deleted!`,
          message: "Deletetion process was canceled!",
          color: "red",
          icon: <IconAlertTriangle />,
        });
      },
    });

  // delete class
  const deleteClass = (name: string, id: string) => {
    showNotification({
      id: "class-delete",
      title: "Deleting....",
      message: `We are trying to delete ${name}`,
      loading: true,
    });
    ClassAPI.deleteClass(id)
      .then((data) => {
        const newClassData = classDetails.filter((value) => {
          return value._id !== id;
        });

        setClassDetails(newClassData);
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };
        setSortedData(sortData(newClassData, payload));

        updateNotification({
          id: "class-delete",
          autoClose: 3000,
          title: `${name} was deleted!`,
          message: "Class was delete successfully!",
          color: "teal",
          icon: <IconCheck />,
        });
      })
      .catch((error) => {
        updateNotification({
          id: "class-delete",
          autoClose: 3000,
          title: `${name} was not deleted!`,
          message: `There is an error while deleting ${name}!`,
          color: "red",
          icon: <IconAlertTriangle />,
        });
      });
  };

  // Edit class function
  const editClass = async (values: {
    _id: string;
    name: string;
    teacher: string;
    subject: string;
    day: string;
    startTime: Date;
    endTime: Date;
    venue: string;
  }) => {
    showNotification({
      id: "class-edit",
      title: "Updating....",
      message: `We are trying to update ${values.name}`,
      loading: true,
    });

    await ClassAPI.editClassDetails(values)
      .then((data) => {
        updateNotification({
          id: "class-edit",
          autoClose: 3000,
          title: `${values.name} details were edited!`,
          message: "Class details were edited successfully!",
          color: "teal",
          icon: <IconCheck />,
        });

        editForm.reset();
        setOpenEditClassModal(false);

        const newData = classDetails.map((item: any) => {
          if (item._id === data.data._id) {
            return {
              _id: data.data._id,
              id: data.data.id,
              name: data.data.name,
              teacher: data.data.teacher,
              subject: data.data.subject,
              day: data.data.day,
              startTime: data.data.startTime,
              endTime: data.data.endTime,
              venue: data.data.venue,
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

        setClassDetails(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "class-edit",
          autoClose: 3000,
          title: `${values.name} was not edited!`,
          message: `There is an error while editing ${values.name}!`,
          color: "red",
          icon: <IconAlertTriangle />,
        });
      });
  };

  // Enroll student
  const enrollStudent = (studentObjId: string,studentEmail : string, studentName : string, classId: string,className : string) => {
    showNotification({
      id: "class-enroll",
      title: "Enrolling....",
      message: `We are trying to enroll student into ${enrollClassName}`,
      loading: true,
    });

    ClassAPI.enrollStudent(studentObjId,studentEmail, studentName, classId, className)
      .then((data) => {
        // const newClassObj = data.data.students;
        updateNotification({
          id: "class-enroll",
          title: "Success",
          message: `We are successfully enrolled student into ${enrollClassName}`,
          icon: <IconCheck />,
          color: "teal",
        });
      })
      .catch((error) => {
        updateNotification({
          id: "class-enroll",
          title: "Failed",
          message: `There was an error while enrolling student into ${enrollClassName}`,
          icon: <IconX />,
          color: "red",
        });
      });
  };

  //get Enrolled Students details
  const getEnrollmentStudentDetails = async (classId: string) => {
    const result = await fethClassDetailsById(classId);

    setEnrolledStudents(result);
  };

  // UnEnroll Students

  const removeEnrollStudent = async (studentId: string, studentName : string, studentEmail : string, classId: string, className : string) => {
    showNotification({
      id: "student-unenroll",
      title: "Unenrolling....",
      message: `We are trying to unenroll student from ${enrollClassName}`,
      loading: true,
    });

    ClassAPI.unEnrollStudent(studentId, studentName, studentEmail ,classId, className)
      .then((response) => {
        setEnrolledStudents(
          enrolledStudents.filter(
            (student: {
              email: string;
              _id: string;
              grade: string;
              phone: string;
              name: string;
              id: string;
            }) => {
              return student._id !== studentId;
            }
          )
        );

        updateNotification({
          id: "student-unenroll",
          title: "Success",
          message: `We are successfully enrolled student into ${enrollClassName}`,
          icon: <IconCheck />,
          color: "teal",
        });
      })
      .catch((err) => {
        updateNotification({
          id: "student-unenroll",
          title: "Failed",
          message: `There was an error while enrolling student into ${enrollClassName}`,
          icon: <IconX />,
          color: "red",
        });
      });
  };

  //enrolled Students row
  const enrolledStudentRows = enrolledStudents.map(
    (student: {
      email: string;
      _id: string;
      grade: string;
      phone: string;
      name: string;
      id: string;
    }) => (
      <tr key={student._id}>
        <td>{student.id}</td>
        <td>{student.name}</td>
        <td>{student.email}</td>
        <td>{student.phone}</td>
        <td>
          <Button
            color="red"
            leftIcon={<IconX size={16} />}
            ml={-30}
            onClick={() =>
              removeEnrollStudent(student._id, student.name, student.email, selectedEnrollClassId, enrollClassName)
            }
          >
            Unenroll Student
          </Button>
        </td>
      </tr>
    )
  );

  // table Rows
  const rows = sortedData.map((row) => (
    <tr key={row._id}>
      <td>{row.id}</td>
      <td>{row.name}</td>
      <td>{row.teacher}</td>
      <td>{row.subject}</td>
      <td>{row.day}</td>
      <td>{row.startTime}</td>
      <td>{row.endTime}</td>
      <td>{row.venue}</td>
      <td>
        <Menu
          position="bottom"
          shadow="md"
          width={120}
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
                setEnrollClassName(row.name);
                setSelectedEnrollClassId(row._id);
                getEnrollmentStudentDetails(row._id);
                setOpenEnrollModel(true);
              }}
            >
              Enroll
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
                  name: row.name,
                  day: row.day,
                  teacher: row.teacher,
                  subject: row.subject,
                  startTime: new Date(),
                  endTime: new Date(),
                  venue: row.venue,
                });
                setOpenEditClassModal(true);
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
              onClick={() => openDeleteModal(row.name, row._id)}
            >
              Delete{" "}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));

  //todo Create this function real time when admin enrolled student into the class, then the system update that student as a enrolled student
  // registered student details rows
  const studentRows = studentDetails.map((studentRow: StudentDetails) => {
    var count = 0;
    enrolledStudents.map((student: StudentDetails) => {
      if (studentRow._id === student._id) {
        count++;
      }
    });

    if (count === 1) {
      return (
        <tr key={studentRow._id}>
          <td>{studentRow.id}</td>
          <td>{studentRow.name}</td>
          <td>{studentRow.email}</td>
          <td>{studentRow.phone}</td>
          <td>{studentRow.grade}</td>
          <td>
            <Button leftIcon={<IconCheck size={16} />} ml={-30} disabled>
              Already Enrolled
            </Button>
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={studentRow._id}>
          <td>{studentRow.id}</td>
          <td>{studentRow.name}</td>
          <td>{studentRow.email}</td>
          <td>{studentRow.phone}</td>
          <td>{studentRow.grade}</td>
          <td>
            <Button
              color="teal"
              leftIcon={<IconPlus size={16} />}
              ml={-30}
              onClick={() =>{
                enrollStudent(studentRow._id, studentRow.email,studentRow.name, selectedEnrollClassId,enrollClassName);
                setEnrolledStudents(prevState => ([...prevState,{
                  _id : studentRow._id,
                  id : studentRow.id,
                  name : studentRow.name,
                  email : studentRow.email,
                  phone : studentRow.phone,
                  grade : studentRow.grade
                }]))
              }}
            >
              Enroll Student
            </Button>
          </td>
        </tr>
      );
    }
  });

  // validate add Class Form
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: "",
      teacher: "",
      subject: "",
      day: "",
      startTime: new Date(),
      venue: "",
      endTime: new Date(),
    },

    validate: {
      name: (val) =>
        val.length >= 2
          ? null
          : "Invalid class name, Class name should have more than 3 characters!",
    },
  });

  //call add Class funtion in Class API
  const addClass = async (values: {
    name: string;
    teacher: string;
    subject: string;
    day: string;
    startTime: Date;
    venue: string;
    endTime: Date;
  }) => {
    await ClassAPI.addClass(values)
      .then((data) => {
        showNotification({
          id: "class-add",
          disallowClose: false,
          autoClose: 1800,
          title: "Class Added Successfully!",
          message: `${data.data.name} added successfully!`,
          color: "teal",
          icon: <IconCheck />,
          loading: false,
        });
        form.reset(); //reset form data after entering new details
        setOpenedAddClassModal(false); //Auto Close the class adding modal

        //then update the Table with new Details
        const newData = [
          ...classDetails,
          {
            _id: data.data._id,
            id: data.data.id,
            name: data.data.name,
            teacher: data.data.teacher,
            subject: data.data.subject,
            day: data.data.day,
            startTime: data.data.startTime,
            endTime: data.data.endTime,
            venue: data.data.venue,
          },
        ];
        const payload = {
          sortBy: null,
          reversed: false,
          search: "",
        };

        setClassDetails(newData);
        setSortedData(sortData(newData, payload));
      })
      .catch((error) => {
        updateNotification({
          id: "class-add",
          disallowClose: false,
          autoClose: 1800,
          title: "Something Went Wrong!",
          message: `class not added!`,
          color: "red",
          icon: <IconX />,
          loading: false,
        });
      });
  };

  //fetch all detailss
  useEffect(() => {
    const fetch = async () => {
      showNotification({
        id: "while-fetching-classes",
        disallowClose: false,
        autoClose: 2000,
        title: "Fetching Classses Details",
        message: "We are trying to fetch classes details",
        loading: true,
      });

      showNotification({
        id: "while-fetching-halls",
        disallowClose: false,
        autoClose: 2000,
        title: "Fetching Hall Details",
        message: "We are trying to fetch hall details",
        loading: true,
      });

      showNotification({
        id: "while-fetching-students",
        disallowClose: false,
        autoClose: 2000,
        title: "Fetching Registered Student Details",
        message: "We are trying to fetch registered student details",
        loading: true,
      });

      const classDetails = await getAllClasses().catch((error) => {
        updateNotification({
          id: "while-fetching-classes",
          disallowClose: false,
          autoClose: 2000,
          title: "Something Went Wrong!",
          message: "There is an error while fetching class Data",
          color: "red",
          icon: <IconX />,
          loading: false,
        });
      });

      //getting hall details and when error is occured show an ERROR message
      const hallDetails = await getAllHallDetails().catch((error) => {
        updateNotification({
          id: "while-fetching-halls",
          disallowClose: false,
          autoClose: 2000,
          title: "Something Went Wrong!",
          message: "There is an error while fetching hall details",
          color: "red",
          icon: <IconX />,
          loading: false,
        });
      });

      const classes = classDetails.map((item: any) => ({
        name: item.name,
        id: item.id,
        _id: item._id,
        teacher: item.teacher,
        subject: item.subject,
        day: item.day,
        startTime: item.startTime,
        venue: item.venue,
        endTime: item.endTime,
      }));

      const halls = hallDetails.map((item: any) => ({
        _id: item._id,
        hallID: item.hallID,
        capacity: item.capacity,
      }));

      const payload = {
        sortBy: null,
        reversed: false,
        search: "",
      };

      setClassDetails(classes);
      setSortedData(sortData(classes, payload));
      setLoading(false);

      // set halldetails
      setHallDetails(halls);

      //this shows success message after class loaded
      setTimeout(() => {
        updateNotification({
          id: "while-fetching-classes",
          disallowClose: false,
          autoClose: 2000,
          title: "Done",
          message: "Done! Classes are fetched!",
          icon: <IconCheck />,
          color: "teal",
          loading: false,
        });

        updateNotification({
          id: "while-fetching-halls",
          disallowClose: false,
          autoClose: 2000,
          title: "Done",
          message: "Done! All halls are fetched!",
          icon: <IconCheck />,
          color: "teal",
          loading: false,
        });

        updateNotification({
          id: "while-fetching-students",
          disallowClose: false,
          autoClose: 2000,
          title: "Done",
          message: "Done! All registered student details are fetched!",
          icon: <IconCheck />,
          color: "teal",
          loading: false,
        });
      }, 500);
    };
    fetch();
  }, []);

  //fetch Registered Students
  const fetchRegisteredStudents = async () => {
    // fetch student data
    const newStudentDetails = await getStudentDetails().catch((error) => {
      updateNotification({
        id: "while-fetching-students",
        disallowClose: false,
        autoClose: 2000,
        title: "Something Went Wrong!",
        message: "There is an error while fetching students details",
        color: "red",
        icon: <IconX />,
        loading: false,
      });
    });

    const registeredStudents = newStudentDetails.map((item: any) => ({
      _id: item._id,
      id: item.id,
      name: item.name,
      email: item.email,
      grade: item.grade,
      phone: item.phone,
    }));

    // set studentDetails
    setStudentDetails(registeredStudents);
  };

  //get current Full Date
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  const editForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      _id: "",
      name: "",
      teacher: "",
      subject: "",
      day: "",
      startTime: new Date(),
      venue: "",
      endTime: new Date(),
    },

    validate: {
      name: (val) =>
        val.length >= 2
          ? null
          : "Invalid class name, Class name should have more than 3 characters!",
    },
  });

  return (
    <div>
      {/* Enroll Student Modal */}
      <Modal
        size={"70%"}
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        opened={openEnrollModal}
        onClose={() => {
          setOpenEnrollModel(false);
          setEnrolledStudents([]);
        }}
        title={`Enroll Students into ${enrollClassName}`}
      >
        <Box>
          <Group mt={20}>
            <TextInput
              placeholder="Search by any field"
              mb="md"
              icon={<IconSearch size="0.9rem" stroke={1.5} />}
              value={search}
              onChange={handleSearchChange}
              sx={{ minWidth: 750 }}
            />
            <Button
              mt={-15}
              mr={20}
              onClick={() => {
                fetchRegisteredStudents();
                setSelectEnrollStudent(true);
              }}
            >
              Enroll Student
            </Button>
          </Group>
          <ScrollArea>
            <Table
              horizontalSpacing="md"
              verticalSpacing="xs"
              miw={700}
              sx={{ tableLayout: "fixed" }}
              mt={10}
            >
              <thead>
                <tr>
                  {/* <Th
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              SID
            </Th>
            <Th
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Email
            </Th> */}
                  <th>SID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudentRows.length > 0 ? (
                  enrolledStudentRows
                ) : (
                  <tr>
                    <td>
                      <Text weight={500} align="center">
                        No Item Found
                      </Text>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ScrollArea>
        </Box>
      </Modal>

      {/* Select Enroll students */}
      <Modal
        size={"auto"}
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        opened={selectEnrollStudent}
        onClose={() => {
          setSelectEnrollStudent(false);
        }}

      >
        <TextInput
          placeholder="Search by any field"
          mb="md"
          icon={<IconSearch size="0.9rem" stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
          sx={{ minWidth: "750" }}
        />
        <Box>
          <ScrollArea
            sx={{ height: 400 }}
            onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
          >
            <Table
              horizontalSpacing="xl"
              verticalSpacing="sm"
              highlightOnHover
              miw={700}
              sx={{ tableLayout: "fixed" }}
              mt={10}
            >
              <thead
                className={cx(classes.header, { [classes.scrolled]: scrolled })}
              >
                <tr>
                  <th>SID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Grade</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {studentRows.length > 0 ? (
                  studentRows
                ) : (
                  <tr>
                    <td>
                      <Text weight={500} align="center">
                        No items found
                      </Text>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ScrollArea>
        </Box>
      </Modal>

      {/* //open edit class modal */}
      <Modal
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        opened={openEditClassModal}
        onClose={() => setOpenEditClassModal(false)}
        overlayOpacity={0.55}
        overlayBlur={3}
        title="Edit a Class"
        sx={{ marginTop: "-20px" }}
      >
        <Box>
          <form onSubmit={editForm.onSubmit((values) => editClass(values))}>
            {/* get class name */}
            <TextInput
              required
              withAsterisk
              label="Class Name"
              placeholder="Enter Class Name"
              {...editForm.getInputProps("name")}
              mb={10}
            />

            {/* get teacher name */}
            <TextInput
              required
              withAsterisk
              label="Teacher"
              placeholder="Enter teacher Name"
              {...editForm.getInputProps("teacher")}
              mb={10}
            />

            {/* get subject name */}
            <TextInput
              required
              withAsterisk
              label="Subject"
              placeholder="Enter subject Name"
              {...editForm.getInputProps("subject")}
              mb={10}
            />

            {/* get Day */}
            <Select
              mb={10}
              label="Day"
              withAsterisk
              searchable
              placeholder="Select Day"
              onSearchChange={setDaySearchValue}
              searchValue={daySearchValue}
              nothingFound="Not Found"
              data={[
                { value: "Monday", label: "Monday" },
                { value: "Tuesday", label: "Tuesday" },
                { value: "Wednesday", label: "Wednesday" },
                { value: "Thursday", label: "Thursday" },
                { value: "Friday", label: "Friday" },
                { value: "Saturday", label: "Saturday" },
                { value: "Sunday", label: "Sunday" },
              ]}
              {...editForm.getInputProps("day")}
            />

            {/* Get Start Time */}
            <TimeInput
              label="Start Time"
              format="12"
              withAsterisk
              clearable
              rightSection={<IconClock size="1rem" stroke={1.5} />}
              maw={400}
              mx="auto"
              required
              {...editForm.getInputProps("startTime")}
            />

            {/* Class End Time */}
            <TimeInput
              label="End time"
              format="12"
              withAsterisk
              required
              clearable
              rightSection={<IconClock size="1rem" stroke={1.5} />}
              maw={400}
              mx="auto"
              {...editForm.getInputProps("endTime")}
            />

            {/* select Venue/hall */}
            <Select
              label="Venue"
              placeholder="Pick one"
              searchable
              required
              clearable
              withAsterisk
              nothingFound="No Hall"
              data={hallDetails.map((data: any) => {
                return {
                  value: data.hallID,
                  label: data.hallID,
                  group: "Capacity:  " + data.capacity.toString(),
                };
              })}
              defaultValue={editForm.values.venue}
              {...editForm.getInputProps("venue")}
              mb={10}
            />

            <Group position="center" grow mt={20} mb={5}>
              <Button color={"green"} type={"submit"}>
                Edit Class
              </Button>
            </Group>
          </form>
        </Box>
      </Modal>

      <Box
        sx={{ display: "flex", justifyContent: "space-between" }}
        mb={30}
        mt={10}
      >
        <TextInput
          placeholder="Search by any field"
          icon={<IconSearch size={14} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
          sx={{ minWidth: 600 }}
        />
        <Group position="right">
          {/* download Report button */}
          <PDFDownloadLink
            document={<ClassPDF data={classDetails} user={adminName} />}
            fileName={`CLASSDETAILS_${year}_${month}_${date}`}
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

          {/* Add Class Modal, This will apear when Add class Button Clicked */}
          <Modal
            overlayColor={
              theme.colorScheme === "dark"
                ? theme.colors.dark[9]
                : theme.colors.gray[2]
            }
            opened={openedAddClassModal}
            onClose={() => setOpenedAddClassModal(false)}
            overlayOpacity={0.55}
            overlayBlur={3}
            title="Add a Class"
            sx={{ marginTop: "-20px" }}
          >
            <Box>
              <form onSubmit={form.onSubmit((values) => addClass(values))}>
                {/* get class name */}
                <TextInput
                  required
                  withAsterisk
                  label="Class Name"
                  placeholder="Enter Class Name"
                  {...form.getInputProps("name")}
                  mb={10}
                />

                {/* get teacher name */}
                <TextInput
                  required
                  withAsterisk
                  label="Teacher"
                  placeholder="Enter teacher Name"
                  {...form.getInputProps("teacher")}
                  mb={10}
                />

                {/* get subject name */}
                <TextInput
                  required
                  withAsterisk
                  label="Subject"
                  placeholder="Enter subject Name"
                  {...form.getInputProps("subject")}
                  mb={10}
                />

                {/* get Day */}
                <Select
                  mb={10}
                  label="Day"
                  withAsterisk
                  searchable
                  placeholder="Select Day"
                  onSearchChange={setDaySearchValue}
                  searchValue={daySearchValue}
                  nothingFound="Not Found"
                  data={[
                    { value: "Monday", label: "Monday" },
                    { value: "Tuesday", label: "Tuesday" },
                    { value: "Wednesday", label: "Wednesday" },
                    { value: "Thursday", label: "Thursday" },
                    { value: "Friday", label: "Friday" },
                    { value: "Saturday", label: "Saturday" },
                    { value: "Sunday", label: "Sunday" },
                  ]}
                  {...form.getInputProps("day")}
                />

                {/* Get Start Time */}
                <TimeInput
                  label="Start Time"
                  format="12"
                  withAsterisk
                  clearable
                  rightSection={<IconClock size="1rem" stroke={1.5} />}
                  maw={400}
                  mx="auto"
                  required
                  {...form.getInputProps("startTime")}
                />

                {/* Class End Time */}
                <TimeInput
                  label="End time"
                  format="12"
                  withAsterisk
                  required
                  clearable
                  rightSection={<IconClock size="1rem" stroke={1.5} />}
                  maw={400}
                  mx="auto"
                  {...form.getInputProps("endTime")}
                />

                {/* select Venue/hall */}
                <Select
                  label="Venue"
                  placeholder="Pick one"
                  searchable
                  required
                  clearable
                  withAsterisk
                  nothingFound="No Hall"
                  defaultValue={editForm.values.venue}
                  data={hallDetails.map((data: any) => {
                    return {
                      value: data.hallID,
                      label: data.hallID,
                      group: "Capacity:  " + data.capacity.toString(),
                    };
                  })}
                  {...form.getInputProps("venue")}
                  mb={10}
                />

                <Group position="center" grow mt={20} mb={5}>
                  <Button color={"green"} type={"submit"}>
                    Add Class
                  </Button>
                </Group>
              </form>
            </Box>
          </Modal>

          {/* Add class Button */}
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={() => setOpenedAddClassModal(true)}
          >
            Add Class
          </Button>
        </Group>
      </Box>
      <ScrollArea
        sx={{ height: 400 }}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table
          highlightOnHover
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{ minWidth: 700 }}
        >
          <thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
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
                sorted={sortBy === "teacher"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("teacher")}
              >
                Teacher
              </Th>
              <Th
                sorted={sortBy === "subject"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("subject")}
              >
                Subject
              </Th>
              <Th
                sorted={sortBy === "day"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("day")}
              >
                Day
              </Th>
              <Th
                sorted={sortBy === "startTime"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("startTime")}
              >
                Start time
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

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <Text weight={500} align="center">
                    Loading...
                  </Text>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td>
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
    </div>
  );
};

export default ClassManage;
