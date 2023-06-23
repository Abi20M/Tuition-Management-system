import { Avatar, Divider, Group, Paper, Text } from "@mantine/core";
import { IconSchool, IconUser, IconUsers, IconX } from "@tabler/icons";
import { IconUserBolt } from "@tabler/icons-react";
import { IconBrandCashapp } from '@tabler/icons-react';
import { useEffect, useState } from "react";
import expensesAPI from "../../API/expensesAPI";
import { showNotification } from "@mantine/notifications";
import { Progress, Card, createStyles } from '@mantine/core';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js"
import { Doughnut } from "react-chartjs-2";
import ExpensesAPI from "../../API/expensesAPI";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);


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
          id: "while-fetching-expense",
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
  //setInterval(fetchUserCounts, 200000)


  return (
    <Group position="center" p={5}>
      <Paper
        shadow="md"
        radius={"md"}
        sx={{ width: "400px", height: "200px" }}
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
    width: "100%",
    height: "150px",
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
        MONTHLY REMAINING
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

//create doughnut chart
export const DoughnutChart = () => {
  const [expenseCategories, setExpenseCategories] = useState([""]);

  const fetchExpenseCategories = async () => {
    await ExpensesAPI
      .getExpensesCategories()
      .then((res) => {
        const categories = res.data.map((item: any) => item.category);
        setExpenseCategories(categories);
        console.log(expenseCategories)
      })
      .catch((error) => {
        showNotification({
          id: "while-fetching-category",
          disallowClose: false,
          autoClose: 2000,
          title: "Something Went Wrong!",
          message: "There is an error while fetching expense categories",
          color: "red",
          icon: <IconX />,
          loading: false,
        });
      });
  };

  useEffect(() => {

    fetchExpenseCategories();
  }, [])

  //setInterval(fetchExpenseCategories, 200000)



  var category1 = 0, category2 = 0, category3 = 0, category4 = 0, category5 = 0, category6 = 0, category7 = 0, category8 = 0;

  //check how many expense in each category
  expenseCategories.forEach((category) => {
    const trimmedCategory = category.trim().toLowerCase();

    if (trimmedCategory === "building expense") {
      category1++;
    } else if (trimmedCategory === "infrastructure expense") {
      category2++;
    } else if (trimmedCategory === "transportation expenses") {
      category3++;
    } else if (trimmedCategory === "food expenses") {
      category4++;
    } else if (trimmedCategory === "textbooks and materials") {
      category5++;
    } else if (trimmedCategory === "technology expenses") {
      category6++;
    } else if (trimmedCategory === "maintains") {
      category7++;
    } else if (trimmedCategory === "other education-related expenses") {
      category8++;
    }
  });


  const data = {
    labels: ['Building',
      'Infrastructure',
      'Transportation',
      'Food',
      'Textbooks and materials',
      'Technology',
      'Maintains ',
      'Other education-related'],


    datasets: [{
      label: 'Category',
      data: [category1, category2, category3, category4, category5, category6, category7, category8],
      backgroundColor: ["red", "pink", "blue", "yellow", "green", "orange", "purple", "#fff7d4"],
    }]
  };
  const options: ChartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          boxWidth: 12,

        },
      },
      title:{
        display : true,
        text:"Expenses Overview",
        font:{
          size : 20,
          weight: "bold",
        },
      },
      
    },
  };



  return (
    <div className="DoughnutChart" 
    style={{
      display: 'flex',
      justifyContent: 'center',}}
    >
      <div style={{ width: '400px', height: '400px', textAlign:"center" }}>
        <Doughnut
          data={data}
          // options={options}
        ></Doughnut>
      </div>
    </div>


  );
}