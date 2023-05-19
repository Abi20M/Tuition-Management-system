import { createStyles, Container, Tabs } from "@mantine/core";
//import TeacherHeader from "../../components/TeacherHeader";
import MyStudentsTeacher from "../../components/MyStudentsTeacher";
import MyClassesTeacher from "../../components/MyClassesTeacher";
import TeacherOverview from "../../components/TeacherDashboard";
import TeacherHeaderLogin from "../../components/TeacherHeader/TeacherHeaderLogin"
// import WebsiteFooter from "../../components/Footer";

const useStyles = createStyles((theme) => ({
  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
    marginTop: -38,
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tab: {
    fontWeight: 500,
    height: 38,
    backgroundColor: "transparent",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    },

    "&[data-active]": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      borderColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[2],
    },
  },
}));

//create tabs List
const tabs = [
  "Dashboard",
  "My Students",
  "My Classes",
];

export const TeacherDashboard = () => {
  //change the tab Title
  document.title = "Teacher Dashboard - Tuition Management System";

  const { classes, theme, cx } = useStyles();

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab} mb={30}>
      {tab}
    </Tabs.Tab>
  ));

  //get Admin information from the localStorage and we convert into that information into JSON object using JSON.parse()
  const teacher = JSON.parse(localStorage.getItem("teacher") || "{}");

  //user information object
  const user = {
    name: teacher.name,
    email : teacher.email,
  //   telephone: admin.telephone,
  //   address : admin.address,
  };

  return (
    <div>
      {/* import admin Header */}
    <TeacherHeaderLogin user ={user}/>

    {/* Tabs */}
    <Container>
      <Tabs
        defaultValue="Dashboard"
        variant="outline"
        classNames={{
          root: classes.tabs,
          tabsList: classes.tabsList,
          tab: classes.tab,
        }}
      >
        <Tabs.List grow>{items}</Tabs.List>

        {/* Here you can add your own Component to here */}
        <Tabs.Panel value="Dashboard">
        <TeacherOverview/>
        </Tabs.Panel>
        <Tabs.Panel value="My Students">
        <MyStudentsTeacher/>
        </Tabs.Panel>
        <Tabs.Panel value="My Classes">
        <MyClassesTeacher/>
        </Tabs.Panel>    
      </Tabs>
    </Container>

    {/* <WebsiteFooter/> */}
    </div>
  );
};