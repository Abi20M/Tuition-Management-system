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
} from "@tabler/icons";
import { IconEdit, IconTrash } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import AdminAPI from "../../API/adminAPI";
import { IconCheck, IconAlertTriangle } from "@tabler/icons";
import { useForm } from "@mantine/form";

//Interface for admin data - (Raw data)
interface RowData {
  id: string;
  customId : string;
  name: string;
  email: string;
  telephone: string;
  address:string;
}

//Get all admin records from the database
const getAllAdmin = async () => {
  const response = await AdminAPI.getAdmins();
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

const ManageAdmins: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch admin data
  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "admin data is loading..",
        autoClose: false,
        disallowClose: true,
      });
      const result = await getAllAdmin();
      const data = result.map((item: any) => {
        return {
          id: item._id,
          customId : item.id,
          name: item.name,
          email: item.email,
          telephone: item.String,
          address: item.string,
          // contactNumber: item.contactNumber,
          // role: item.role,
          // bloodBankId: item.bloodBankId,
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
          "You can now manage admin by adding, editing or deleting them.",
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

  //edit admin form
  const editAdmin = async (values: {
    id: string;
    customId : string,
    name: string;
    email: string;
    telephone: string;
    address:string;
  }) => {
    showNotification({
      id: "edit-admin",
      loading: true,
      title: "Updating admin of " + values.name,
      message: "Updating admin record..",
      autoClose: false,
      disallowClose: true,
    });
    AdminAPI.editAdmin(values)
      .then((response) => {
        updateNotification({
          id: "edit-admin",
          color: "teal",
          title: "admin record updated successfully",
          message: "Updated admin record of " + values.name,
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        editForm.reset();
        setEditOpened(false);
        const newData = data.map((item) => {
          if (item.id === values.id) {
            return {
              id: values.id,
              customId : values.customId,
              name: values.name,
              email: values.email,
              telephone: values.telephone,
              address: values.address,
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
          id: "edit-admin",
          color: "red",
          title: "Update failed",
          message: "We were unable to update admin data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //add admin
  const addAdmin = async (values: {
    name: string;
    email: string;
    password: string;
    telephone: string;
    address:string;
  }) => {
    showNotification({
      id: "add-admin",
      loading: true,
      title: "Adding admin record",
      message: "Please wait while we add admin record..",
      autoClose: false,
      disallowClose: true,
    });
    AdminAPI.addAdmin(values)
      .then((response) => {
        updateNotification({
          id: "add-admin",
          color: "teal",
          title: "admin added successfully",
          message: "admin data added successfully.",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        addForm.reset();
        setOpened(false);
        const newData = [
          ...data,
          {
            id: response.data._id,
            customId : response.data.id,
            name: values.name,
            email: values.email,
            telephone: values.telephone,
            address:values.address,
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
          id: "add-admin",
          color: "red",
          title: "Adding admin failed",
          message: "We were unable to add the admin to the database",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //delete admin
  const deleteAdmin = async (id: string) => {
    showNotification({
      id: "delete-admin",
      loading: true,
      title: "Deleting admin",
      message: "Please wait while we delete the admin record",
      autoClose: false,
      disallowClose: true,
    });
    AdminAPI.deleteAdmin(id)
      .then((response) => {
        updateNotification({
          id: "delete-admin",
          color: "teal",
          title: "admin record deleted successfully",
          message: "The admin record has been deleted successfully",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        const newData = data.filter((item) => item.id !== id);
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
          id: "delete-admin",
          color: "red",
          title: "Deleting admin record failed",
          message: "We were unable to delete the admin record",
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
      customId : "",
      name: "",
      email: "",
      telephone: "",
      address: "",
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

      telephone: (value) =>
          value.length < 11 ? "Telephone must have at least 10 numbers" : null,

    
    },
  });

  //declare add form
  const addForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: "",
      email: "",
      password: "",
      telephone: "",
      address:"",
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
      password: (value) =>
        value.length < 8 ? "Password must have at least 8 characters" : null,

      telephone: (value) =>
        value.length < 11 ? "Telephone must have at least 10 numbers" : null,
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
      title: "Delete this admin record?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this admin record? This action cannot
          be undone.
        </Text>
      ),
      labels: { confirm: "Delete admin record", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "The admin record was not deleted",
          color: "teal",
        });
      },
      onConfirm: () => {
        deleteAdmin(id);
      },
    });

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row.id}>
      <td>{row.customId}</td>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>
        <Button
          color="teal"
          leftIcon={<IconEdit size={14} />}
          onClick={() => {
            editForm.setValues({
              id: row.id,
              customId : row.customId,
              name: row.name,
              email: row.email,
              telephone: row.telephone,
              address: row.address,
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
          onClick={() => openDeleteModal(row.id)}
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
        title="Add Administator"
      >
        <form onSubmit={addForm.onSubmit((values) => addAdmin(values))}>
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
        title="Edit Administator"
      >
        <form onSubmit={editForm.onSubmit((values) => editAdmin(values))}>
          <TextInput
            label="ID"
            placeholder="Enter ID"
            disabled
            {...editForm.getInputProps("customId")}
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
            label="Telephone"
            placeholder="Enter telephone"
            {...editForm.getInputProps("telephone")}
            required
          />

          <TextInput
            label="Address"
            placeholder="Enter address"
            {...editForm.getInputProps("address")}
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
            sx={{ width: "300px" }}
          />
          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            sx={{ width: "200px", marginRight: "20px" }}
            onClick={() => setOpened(true)}
          >
            Add Administator
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

export default ManageAdmins;
