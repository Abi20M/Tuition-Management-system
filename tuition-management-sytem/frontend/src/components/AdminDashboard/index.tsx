import { Avatar, Divider, Group, Paper, Text } from "@mantine/core";
import { IconSchool, IconUser, IconUsers, IconX } from "@tabler/icons";
import { IconUserBolt } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import adminAPI from "../../API/adminAPI";
import { showNotification } from "@mantine/notifications";
import TeacherAPI from "../../API/teacherAPI";
import StudentAPI from "../../API/studentAPI";
import ParentAPI from "../../API/ParentAPI";
import aos from "aos";
import { Pie } from "react-chartjs-2";

export interface GenderDistribution {
  Male: number;
  Female: number;
}

const AdminStats = () => {
  const [adminCount, setAdminCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [parentCount, setParentCount] = useState(0);
  const [GenderDistribution, setGenderDistribution] = useState({
    Male: 0,
    Female: 0,
  });

  const fetchUserCounts = async () => {
    await adminAPI
      .getAdminCount()
      .then((res) => {
        setAdminCount(res.data);
      })
      .catch((error) => {
        showNotification({
          id: "while-fetching-halls",
          disallowClose: false,
          autoClose: 2000,
          title: "Something Went Wrong!",
          message: "There is an error while fetching admin count",
          color: "red",
          icon: <IconX />,
          loading: false,
        });
      });

    await TeacherAPI.getTeacherCount()
      .then((res) => {
        setTeacherCount(res.data);
      })
      .catch((error) => {
        showNotification({
          id: "while-fetching-halls",
          disallowClose: false,
          autoClose: 2000,
          title: "Something Went Wrong!",
          message: "There is an error while fetching Teacher count",
          color: "red",
          icon: <IconX />,
          loading: false,
        });
      });

    await StudentAPI.getStudentCount()
      .then((res) => {
        setStudentCount(res.data);
      })
      .catch((error) => {
        showNotification({
          id: "while-fetching-halls",
          disallowClose: false,
          autoClose: 2000,
          title: "Something Went Wrong!",
          message: "There is an error while fetching student count",
          color: "red",
          icon: <IconX />,
          loading: false,
        });
      });

    await ParentAPI.getParentCount()
      .then((res) => {
        setParentCount(res.data);
      })
      .catch((error) => {
        showNotification({
          id: "while-fetching-halls",
          disallowClose: false,
          autoClose: 2000,
          title: "Something Went Wrong!",
          message: "There is an error while fetching parent count",
          color: "red",
          icon: <IconX />,
          loading: false,
        });
      });


      await StudentAPI.getStudentGender().then((res)=>{
        console.log(res.data)
        setGenderDistribution(res.data[0])
        console.log(GenderDistribution)
      }).catch((error)=>{
        showNotification({
          id: "while-fetching-halls",
          disallowClose: false,
          autoClose: 2000,
          title: "Something Went Wrong!",
          message: "There is an error while fetching Gender count",
          color: "red",
          icon: <IconX />,
          loading: false,
        });
      })

  };

  useEffect(() => {
    aos.init();
    fetchUserCounts();
  }, []);

  //call above function in every 5mins to collect updated data
  // setInterval(fetchUserCounts,300000)

  const genderDistribution: GenderDistribution = {
    Male: GenderDistribution.Male,
    Female: GenderDistribution.Female,
  };

  // pie chart options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        style: {
          marginTop: "20px",
          marginBottom: "10px",
        },
      },
      title: {
        display: true,
        text: "Geneder Distribution",
        font: {
          size: 20,
        },
      },
    },
  };
  // pie chart settings
  const pieChartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "# of Votes",
        data: [genderDistribution.Male, genderDistribution.Female],
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <Group
        position="apart"
        p={5}
        data-aos="fade-up"
        data-aos-easing="ease-in-sine"
        data-aos-duration="600"
      >
        <Paper
          shadow="md"
          radius={"md"}
          sx={{ width: "200px", height: "180px" }}
          withBorder
        >
          <Text fz={20} fw={"bold"} pl={35} pr={35} pt={3} pb={3}>
            Adminstrators
          </Text>
          <Divider variant="solid" my={2} />
          <Group position="center">
            <Avatar radius={"xl"} size={"lg"} color="cyan" mt={10}>
              <IconUserBolt />
            </Avatar>
          </Group>
          <Group position="center">
            <Text fz={40} fw={"bolder"}>
              {adminCount}
            </Text>
          </Group>
        </Paper>

        <Paper
          shadow="md"
          radius={"md"}
          sx={{ width: "200px", height: "180px" }}
          withBorder
        >
          <Text fz={20} fw={"bold"} pl={55} pr={55} pt={3} pb={3}>
            Teachers
          </Text>
          <Divider variant="solid" my={2} />
          <Group position="center">
            <Avatar radius={"xl"} size={"lg"} color="cyan" mt={10}>
              <IconSchool />
            </Avatar>
          </Group>
          <Group position="center">
            <Text fz={40} fw={"bolder"}>
              {teacherCount}
            </Text>
          </Group>
        </Paper>

        <Paper
          shadow="md"
          radius={"md"}
          sx={{ width: "200px", height: "180px" }}
          withBorder
        >
          <Text fz={20} fw={"bold"} pl={55} pr={55} pt={3} pb={3}>
            Students
          </Text>
          <Divider variant="solid" my={2} />
          <Group position="center">
            <Avatar radius={"xl"} size={"lg"} color="cyan" mt={10}>
              <IconUser />
            </Avatar>
          </Group>
          <Group position="center">
            <Text fz={40} fw={"bolder"}>
              {studentCount}
            </Text>
          </Group>
        </Paper>

        <Paper
          shadow="md"
          radius={"md"}
          sx={{ width: "200px", height: "180px" }}
          withBorder
        >
          <Text fz={20} fw={"bold"} pl={55} pr={55} pt={3} pb={3}>
            Parents
          </Text>
          <Divider variant="solid" my={2} />
          <Group position="center">
            <Avatar radius={"xl"} size={"lg"} color="cyan" mt={10}>
              <IconUsers />
            </Avatar>
          </Group>
          <Group position="center">
            <Text fz={40} fw={"bolder"}>
              {parentCount}
            </Text>
          </Group>
        </Paper>
      </Group>
      <Group position="apart" mt={30}>
        <Paper
          shadow="xl"
          radius={"md"}
          withBorder
          sx={{
            width: "450px",
            paddingLeft: 40,
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
        >
          <Pie data={pieChartData} options={pieChartOptions} />
        </Paper>
      </Group>
    </>
  );
};

export default AdminStats;
