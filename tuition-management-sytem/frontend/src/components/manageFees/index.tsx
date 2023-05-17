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
  IconMoneybag,
  IconReportMoney,
} from "@tabler/icons";
import { IconEdit, IconTrash } from "@tabler/icons";
import { openConfirmModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import StudentAPI from "../../API/studentAPI";
import { adminAPI } from "../../API/adminAPI";

import { IconCheck, IconAlertTriangle } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FeePDF } from "../PDFRender/FeePDFTemplate";
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
  amount: string;
  status: string;
}

//Get all students records from the database
const getAllStudents = async () => {
  const response = await StudentAPI.getStudents();
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
    email: string;
  };
}

const ManageFees = ({ user }: adminName) => {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
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

      const data = result.map((item: any) => {
        return {
          _id: item._id,
          id: item.id,
          name: item.name,
          amount: item.amount,
          status: item.status,
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
          "You can now manage student's fees by adding, editing or deleting them.",
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

  //update Fee form
  const updateFee = async (values: {
    _id: string;
    id: string;
    name: string;
    amount: string,
    status: string,
  }) => {
    showNotification({
      id: "Update-Student's Fees",
      loading: true,
      title: "Updating fee of the student " + values.name,
      message: "Please wait while we update the student",
      autoClose: false,
      disallowClose: true,
    });
    StudentAPI.updateFee(values)
      .then((response) => {
        updateNotification({
          id: "Update-Student's Fees",
          color: "teal",
          title: "student's fees updated successfully",
          message: "Fee of the student " + values.name + " been updated successfully",
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
              amount: values.amount,
              status: values.status,
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
          id: "Update-Student's Fees",
          color: "red",
          title: "Update failed",
          message: "We were unable to update student's fee data.",
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
      amount: "",
      status: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      amount: (value) =>
        /^\d+(\.\d{1,2})?$/.test(value)
          ? null
          : "Price must be a valid number with up to 2 decimal places",
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

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row._id}>
      <td>{row.id}</td>
      <td>{row.name}</td>
      <td>{row.amount}</td>
      <td>{row.status}</td>
      <td>
        <Button
          color="teal"
          leftIcon={<IconReportMoney size={14} />}
          onClick={() => {
            editForm.setValues({
              _id: row._id,
              id: row.id,
              name: row.name,
              amount: row.amount,
              status: row.status,
            });
            setEditOpened(true);
          }}
          sx={{ margin: "5px", width: "150px" }}
        >
          Update Fee
        </Button>
      </td>
    </tr>
  ));

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          setEditOpened(false);
        }}
        title="Update Student's Fee"
      >
        <form onSubmit={editForm.onSubmit((values) => updateFee(values))}>
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
            disabled
            {...editForm.getInputProps("name")}
            required
          />
          <TextInput
            label="Amount"
            placeholder="Enter amount"
            {...editForm.getInputProps("amount")}
            required
          />
          <Select
            label="Status"
            placeholder="Status"
            {...editForm.getInputProps("status")}
            required
            data={[
              { value: "Paid", label: "Paid" },
              { value: "Not-Paid", label: "Not-Paid" },
            ]}
            defaultValue={editForm.values.status}
          />

          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Submit
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

          <PDFDownloadLink
            document={
              <FeePDF data={data} user={adminName} />
            }
            fileName={`FeesManagement_${year}_${month}_${date}`}
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
                  sorted={sortBy === "amount"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("amount")}
                >
                  Amount (Rs)
                </Th>
                <Th
                  sorted={sortBy === "status"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("status")}
                >
                  Status
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

export default ManageFees;
