import { Avatar, Divider, Group, Paper, Text } from "@mantine/core";
import { IconSchool, IconUser, IconUsers, IconX } from "@tabler/icons";
import { IconUserBolt } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import adminAPI from "../../API/adminAPI";
import { showNotification } from "@mantine/notifications";

const AdminStats = () => {
  const [adminCount, setAdminCount] = useState(0);

  useEffect(() => {
    const fetchUserCounts = async () => {
      await adminAPI
        .getAdminCount()
        .then((res) => {
            console.log(res.data);
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

      
    };


    fetchUserCounts();
  }, []);

  return (
    <Group position="apart" p={5}>
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
            10
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
            10
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
            10
          </Text>
        </Group>
      </Paper>
    </Group>
  );
};

export default AdminStats;
