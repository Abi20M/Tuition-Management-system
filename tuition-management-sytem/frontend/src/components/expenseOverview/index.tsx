import { Avatar, Divider, Group, Paper, Text } from "@mantine/core";
import { IconSchool, IconUser, IconUsers, IconX } from "@tabler/icons";
import { IconUserBolt } from "@tabler/icons-react";
import { IconBrandCashapp } from '@tabler/icons-react';
import { useEffect, useState } from "react";
import expensesAPI from "../../API/expensesAPI";
import { showNotification } from "@mantine/notifications";
import { Progress, Card, createStyles } from '@mantine/core';



export const ExpenseCount = () => {
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
  setInterval(fetchUserCounts, 60000)

  return (
    <Group position="center" p={5}>
      <Paper
        shadow="md"
        radius={"md"}
        sx={{ width: "2000px", height: "180px" }}
        withBorder
      >
        <Text fz={20} fw={"bold"} pl={35} pr={35} pt={3} pb={3} >
          The total number of expense added to the system
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

//MONTHLY GOAL card
const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.fn.primaryColor(),
  },

  title: {
    color: theme.fn.rgba(theme.white, 0.65),
  },

  stats: {
    color: theme.white,
  },

  progressBar: {
    backgroundColor: theme.white,
  },

  progressTrack: {
    backgroundColor: theme.fn.rgba(theme.white, 0.4),
  },
}));

export const ProgressCardColored = (prop: { totalExpense: number, lastFixed: number }) => {
  const { classes } = useStyles();
  return (
    <Card withBorder radius="md" p="xl" className={classes.card}>
      <Text fz="xs" tt="uppercase" fw={700} className={classes.title}>
        Monthly remaining
      </Text>
      <Text fz="lg" fw={500} className={classes.stats}>
        Rs.{prop.totalExpense} / {prop.lastFixed}
      </Text>
      <Progress
        value={(prop.totalExpense / prop.lastFixed) * 100}
        mt="md"
        size="lg"
        radius="xl"
        classNames={{
          root: classes.progressTrack,
          bar: classes.progressBar,
        }}
      />
    </Card>
  );
}

