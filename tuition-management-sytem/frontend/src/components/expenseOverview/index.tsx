import { Avatar, Divider, Group, Paper, Text } from "@mantine/core";
import { IconSchool, IconUser, IconUsers, IconX } from "@tabler/icons";
import { IconUserBolt } from "@tabler/icons-react";
import { IconBrandCashapp } from '@tabler/icons-react';
import { useEffect, useState } from "react";
import expensesAPI from "../../API/expensesAPI";
import { showNotification } from "@mantine/notifications";


const ExpenseStatus = () => {
  const [expenseCount, setExpenseCount] = useState(0);
  

  const fetchUserCounts = async () => {
    await expensesAPI
      .getExpenseCount()
      .then((res) => {
        setExpenseCount(res.data);
      })
      .catch((error) => {
        showNotification({
          id: "while-fetching-halls",
          disallowClose: false,
          autoClose: 2000,
          title: "Something Went Wrong!",
          message: "There is an error while fetching expense count",
          color: "red",
          icon: <IconX />,
          loading: false,
        });
      });
    }
  useEffect(() => {
    fetchUserCounts();
  }, []);

  //call above function in every 5mins to collect updated data
  setInterval(fetchUserCounts,3000000)

  return (
    <Group position="apart" p={5}>
      <Paper
        shadow="md"
        radius={"md"}
        sx={{ width: "200px", height: "180px" }}
        withBorder
      >
        <Text fz={20} fw={"bold"} pl={35} pr={35} pt={3} pb={3}>
          Expenses
        </Text>
        <Divider variant="solid" my={2} />
        <Group position="center">
          <Avatar radius={"xl"} size={"lg"} color="cyan" mt={10}>
            <IconBrandCashapp />
          </Avatar>
        </Group>
        <Group position="center">
          <Text fz={40} fw={"bolder"}>
            {expenseCount}
          </Text>
        </Group>
      </Paper>
    </Group>
  );
};

export default ExpenseStatus;
