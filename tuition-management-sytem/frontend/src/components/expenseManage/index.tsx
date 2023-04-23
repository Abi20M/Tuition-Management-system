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
  Select,
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
import ExpensesAPI from "../../API/expensesAPI";
import { IconCheck, IconAlertTriangle } from "@tabler/icons";
import { useForm } from "@mantine/form";

//Interface for expense data - (Raw data)
interface RowData {
  _id : string;
  id: string;
  name: string;
  description: string;
  category: string;
  amount: string;
}

//Get all expense records from the database
const getAllExpenses = async () => {
  const response = await ExpensesAPI.getExpnses();
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


const ExpenseManage: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch expense data
  useEffect(() => {
    const fetchData = async () => {
      showNotification({
        id: "loding-data",
        loading: true,
        title: "Loading data",
        message: "expense data is loading..",
        autoClose: false,
        disallowClose: true,
      });
      const result = await getAllExpenses();
      const data = result.map((item: any) => {
        return {
          _id: item._id,
          id: item.id,
          name: item.name,
          description: item.description,
          category : item.category,
          amount: item.amount,
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
          "You can now manage expense by adding, editing or deleting them.",
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
  const [categorySearchValue, setcategorySearchValue] = useState("");


  //edit expense function
  const editExpenses = async (values: {
    _id : string,
    id: string;
    name: string;
    description: string;
    category: string;
    amount: string;
  }) => {
    showNotification({
      id: "edit-expense",
      loading: true,
      title: "Updating expense of " + values.name,
      message: "Updating expense record..",
      autoClose: false,
      disallowClose: true,
    });
    ExpensesAPI.editExpenses(values)
      .then((response) => {
        updateNotification({
          id: "edit-expense",
          color: "teal",
          title: "expense record updated successfully",
          message: "Updated expense record of " + values.name,
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        editForm.reset();
        setEditOpened(false);
        const newData = data.map((item) => {
          if (item._id === values._id) {
            return {
              _id : values._id,
              id: values.id,
              name: values.name,
              description: values.description,
              category: values.category,
              amount: values.amount,
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
          id: "edit-expense",
          color: "red",
          title: "Update failed",
          message: "We were unable to update expense data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  
  //add expense
  const addExpenses = async (values: {
    name: string;
    description: string;
    category : string;
    amount: string;
  }) => {
    showNotification({
      id: "add-expense",
      loading: true,
      title: "Adding expense record",
      message: "Please wait while we add expense record..",
      autoClose: false,
      disallowClose: true,
    });
    ExpensesAPI.addExpenses(values)
      .then((response) => {
        updateNotification({
          id: "add-expense",
          color: "teal",
          title: "expense added successfully",
          message: "expense data added successfully.",
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        addForm.reset();
        setOpened(false);
        const newData = [
          ...data,
          {
            _id:response.data._id,
            id: response.data.id,
            name: values.name,
            description: values.description,
            category:values.category,
            amount: values.amount,
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
          id: "add-expense",
          color: "red",
          title: "Adding expense failed",
          message: "We were unable to add the expense to the database",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //delete expense
  const deleteExpenses = async (id: string) => {
    showNotification({
      id: "delete-expense",
      loading: true,
      title: "Deleting expense",
      message: "Please wait while we delete the expense record",
      autoClose: false,
      disallowClose: true,
    });
    ExpensesAPI.deleteExpenses(id)
      .then((response) => {
        updateNotification({
          id: "delete-expense",
          color: "teal",
          title: "expense record deleted successfully",
          message: "The expense record has been deleted successfully",
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
          id: "delete-expense",
          color: "red",
          title: "Deleting expense record failed",
          message: "We were unable to delete the expense record",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //declare edit form
  const editForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      _id:"",
      id: "",
      name: "",
      description: "",
      category:"",
      amount: "",
    },
    
  });

  //declare add form
  const addForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: "",
      description: "",
      category:"",
      amount: "",
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
      title: "Delete this expense record?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this expense record? This action cannot
          be undone.
        </Text>
      ),
      labels: {
        confirm: "Delete expense record",
        cancel: "No don't delete it",
      },
      confirmProps: { color: "red" },
      onCancel: () => {
        showNotification({
          title: "Cancelled",
          message: "The expense record was not deleted",
          color: "teal",
        });
      },
      onConfirm: () => {
        deleteExpenses(id);
      },
    });

  //create rows
  const rows = sortedData.map((row) => (
    <tr key={row._id}>
      <td>{row.id}</td>
      <td>{row.name}</td>
      <td>{row.description}</td>
      <td>{row.category}</td>
      <td>{row.amount}</td>
      <td>
        <Button
          color="teal"
          leftIcon={<IconEdit size={14} />}
          onClick={() => {
            editForm.setValues({
              _id: row._id,
              id: row.id,
              name: row.name,
              description: row.description,
              category: row.category,
              amount: row.amount,
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
        title="Add expense Record"
      >
        <form onSubmit={addForm.onSubmit((values) => addExpenses(values))}>
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...addForm.getInputProps("name")}
            required
          />
          <TextInput
            label="description"
            placeholder="Enter description"
            {...addForm.getInputProps("description")}
            required
          />
         
         <Select
                  mb={10}
                  label="category"
                  withAsterisk
                  searchable
                  placeholder="Select Category"
                  onSearchChange={setcategorySearchValue}
                  searchValue={categorySearchValue}
                  nothingFound="Not Found"
                  data={[
                    { value: "Building expense", label: "Building Expense" },
                    { value: "Infrastructure expense", label: "Infrastructure expense" },
                    { value: "Transportation expenses", label: "Transportation expenses" },
                    { value: "Food expenses", label: "Food expenses" },
                    { value: "Textbooks and materials", label: "Textbooks and materials" },
                    { value: "Technology expenses", label: "Technology expenses" },
                    { value: "Maintains", label: "Maintains" },
                    { value: "Other education-related expenses", label: "Other education-related expenses" },

                  ]}
                  {...addForm.getInputProps("category")}
                />

          <TextInput
            label="amount"
            placeholder="Enter amount"
            {...addForm.getInputProps("amount")}
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
        title="Edit expense Record"
      >
        <form onSubmit={editForm.onSubmit((values) => editExpenses(values))}>
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
            label="description"
            placeholder="Enter description"
            {...editForm.getInputProps("description")}
            required
          />
          <Select
                  mb={10}
                  label="category"
                  withAsterisk
                  searchable
                  placeholder="Select Category"
                  onSearchChange={setcategorySearchValue}
                  searchValue={categorySearchValue}
                  nothingFound="Not Found"
                  data={[
                    { value: "Building expense", label: "Building Expense" },
                    { value: "Infrastructure expense", label: "Infrastructure expense" },
                    { value: "Transportation expenses", label: "Transportation expenses" },
                    { value: "Food expenses", label: "Food expenses" },
                    { value: "Textbooks and materials", label: "Textbooks and materials" },
                    { value: "Technology expenses", label: "Technology expenses" },
                    { value: "Maintains", label: "Maintains" },
                    { value: "Other education-related expenses", label: "Other education-related expenses" },

                  ]}
                  {...editForm.getInputProps("category")}
                />
          <TextInput
            label="amount"
            placeholder="Enter amount"
            {...editForm.getInputProps("amount")}
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
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
            sx={{ minWidth: 600 }}
          />
          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            sx={{ width: "200px", marginRight: "20px" }}
            onClick={() => setOpened(true)}
          >
            Add expense
          </Button>

        </Box>
        

        <ScrollArea>
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            sx={{ tableLayout: "auto", width: "100%", }}
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
                  sorted={sortBy === "description"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("description")}
                >
                  Description
                </Th>
                  
                <Th
                  sorted={sortBy === "category"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("category")}
                >
                  Category
                </Th>

                <Th
                  sorted={sortBy === "amount"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("amount")}
                >
                  Amount
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

export default ExpenseManage;
