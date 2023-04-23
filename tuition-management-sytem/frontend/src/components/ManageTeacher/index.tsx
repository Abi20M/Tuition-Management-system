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
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconFileAnalytics,
} from "@tabler/icons";
import { IconEdit, IconTrash } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import TeacherAPI from "../../API/teacherAPI";
import { IconCheck, IconAlertTriangle } from "@tabler/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TeacherPDF } from "../PDFRender/TeacherPDFTemplate";
import { useForm } from "@mantine/form";

//Interface for teacher data - (Raw data)
interface RowData {
  _id: string,
  id: string;
  name: string;
  email: string;
  phone: string;
}

//Get all teacher records from the database
const getAllTeachers = async () => {
  const response = await TeacherAPI.getTeachers();
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

  //get current Full Date
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  interface adminName {
    user: {
      name: string;
      email:string;
    };
  }

const ManageTeachers = ({ user }: adminName) => {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);

  //set admin name
  const adminName = user.name;


  // fetch teacher data
  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "teacher data is loading..",
        autoClose: false,
        disallowClose: true,
      });
      const result = await getAllTeachers();
      const data = result.map((item: any) => {
        return {
          _id: item._id,
          id : item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
        };
      });
      setData(data);
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
          "You can now manage teacher by adding, editing or deleting them.",
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

  //edit teacher form
  const editTeacher = async (values: {
    _id: string;
    id : string,
    name: string;
    email: string;
    phone: string;
  }) => {
    showNotification({
      id: "edit-teacher",
      loading: true,
      title: "Updating teacher of " + values.name,
      message: "Updating teacher record..",
      autoClose: false,
      disallowClose: true,
    });
    TeacherAPI.editTeacher(values)
      .then((response) => {
        updateNotification({
          id: "edit-teacher",
          color: "teal",
          title: "teacher record updated successfully",
          message: "Updated teacher record of " + values.name,
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        editForm.reset();
        setEditOpened(false);
        const newData = data.map((item) => {
          if (item._id === values._id) {
            return {
              _id: values._id,
              id : values.id,
              name: values.name,
              email: values.email,
              phone: values.phone,
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
          id: "edit-teacher",
          color: "red",
          title: "Update failed",
          message: "We were unable to update teacher data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //add teacher
  const addTeacher = async (values: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    showNotification({
      id: "add-teacher",
      loading: true,
      title: "Adding teacher record",
      message: "Please wait while we add teacher record..",
      autoClose: false,
      disallowClose: true,
    });
    TeacherAPI.addTeacher(values)
      .then((response) => {
        updateNotification({
          id: "add-teacher",
          color: "teal",
          title: "teacher added successfully",
          message: "teacher data added successfully.",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        addForm.reset();
        setOpened(false);
        const newData = [
          ...data,
          {
            _id: response.data._id,
            id : response.data.id,
            name: values.name,
            email: values.email,
            phone: values.phone,
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
          id: "add-teacher",
          color: "red",
          title: "Adding teacher failed",
          message: "We were unable to add the teacher to the database",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //delete teacher
  const deleteTeacher = async (id: string) => {
    showNotification({
      id: "delete-teacher",
      loading: true,
      title: "Deleting teacher",
      message: "Please wait while we delete the teacher record",
      autoClose: false,
      disallowClose: true,
    });
    TeacherAPI.deleteTeacher(id)
      .then((response) => {
        updateNotification({
          id: "delete-teacher",
          color: "teal",
          title: "teacher record deleted successfully",
          message: "The teacher record has been deleted successfully",
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
          id: "delete-teacher",
          color: "red",
          title: "Deleting teacher record failed",
          message: "We were unable to delete the teacher record",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //declare edit form
  const editForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      _id : "",
      id: "",
      name: "",
      email: "",
      phone: "",
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
      password: (value) =>
        value.length < 8 ? "Password must have at least 8 characters" : null,
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
      title: "Delete this teacher record?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this teacher record? This action
          cannot be undone.
        </Text>
      ),
      labels: {
        confirm: "Delete teacher record",
        cancel: "No don't delete it",
      },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "The teacher record was not deleted",
          color: "teal",
        });
      },
      onConfirm: () => {
        deleteTeacher(id);
      },
    });

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row._id}>
      <td>{row.id}</td>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>{row.phone}</td>
      <td>
        <Button
          color="teal"
          leftIcon={<IconEdit size={14} />}
          onClick={() => {
            editForm.setValues({
              _id : row._id,
              id: row.id,
              name: row.name,
              email: row.email,
              phone: row.phone,
            });
            setEditOpened(true);
          }}
          sx={{ margin: "5px", width: "100px" }}
        >
          Edit
        </Button>
        <Button
          color="red"
          leftIcon={<IconTrash size={14} />}
          onClick={() => openDeleteModal(row._id)}
          sx={{ margin: "5px", width: "100px" }}
        >
          Delete
        </Button>
      </td>
    </tr>
  ));

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Modal
        opened={opened}
        onClose={() => {
          addForm.reset();
          setOpened(false);
        }}
        title="Add teacher Record"
      >
        <form onSubmit={addForm.onSubmit((values) => addTeacher(values))}>
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
          <PasswordInput
            placeholder="Your password"
            label="Password"
            {...addForm.getInputProps("password")}
            required
          />
          <TextInput
            label="Phone"
            placeholder="Enter phone"
            {...addForm.getInputProps("phone")}
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
        title="Edit teacher Record"
      >
        <form onSubmit={editForm.onSubmit((values) => editTeacher(values))}>
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
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextInput
            placeholder="Search by any field"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
            sx={{ width: "475px" }}
          />


          

          {/* download Report button */}
          <PDFDownloadLink
            document={<TeacherPDF data={data} user={adminName} />}
            fileName={`TEACHERDETAILS_${year}_${month}_${date}`}
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
            onClick={() => setOpened(true)}
          >
            Add Teacher
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

export default ManageTeachers;