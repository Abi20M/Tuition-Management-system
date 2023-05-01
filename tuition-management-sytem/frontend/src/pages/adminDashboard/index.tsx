import { createStyles, Container, Tabs } from "@mantine/core";
import AdminHeader from "../../components/adminHeader";
import ClassManage from "../../components/classManage";
import WebsiteFooter from "../../components/Footer";
import ManageParents from "../../components/ManageParents";
import ManageStudents from "../../components/ManageStudents";
import ManageTeachers from "../../components/ManageTeacher";
//import ManageTeacher from "../../components/ManageTeacher";
import ManageAdmins from "../../components/ManageAdmin";
import AdminStats from '../../components/AdminDashboard';

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
  "Adminstrators",
  "Teachers",
  "Students",
  "Parents",
  "Classes",
  "Subjects",
  "Fees",
  "Exam"
];

export const AdminDashboard = () => {
  //change the tab Title
  document.title = "Admin Dashboard - Tuition Management System";

  const { classes, theme, cx } = useStyles();

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab} mb={30}>
      {tab}
    </Tabs.Tab>
  ));

  //get Admin information from the localStorage and we convert into that information into JSON object using JSON.parse()
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  
  //user information object
  const user = {
    _id : admin._id,
    customId : admin.id,
    name: admin.name,
    email : admin.email,
    telephone : admin.telephone,
    address: admin.address
  };

  return (
    <div>
      {/* import admin Header */}
    <AdminHeader user ={user}/>

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
          <AdminStats />
        </Tabs.Panel>
        <Tabs.Panel value="Adminstrators">
          <ManageAdmins user={user}/>
        </Tabs.Panel>
        <Tabs.Panel value="Teachers">
        <ManageTeachers user={user}/>
        </Tabs.Panel>
        <Tabs.Panel value="Students">
          <ManageStudents user={user}/>
        </Tabs.Panel>
        <Tabs.Panel value="Parents">
          <ManageParents user={user}/>
        </Tabs.Panel>
        <Tabs.Panel value="Classes">
          <ClassManage user={user}/>
        </Tabs.Panel>
        <Tabs.Panel value="Subjects">
          <h1>Hello Subjects</h1>
        </Tabs.Panel>
        <Tabs.Panel value="Fees">
          <h1>Fees Management</h1>
        </Tabs.Panel>
        <Tabs.Panel value="Exam">
          <h1>Hello Exam Management</h1>
        </Tabs.Panel>
      </Tabs>
    </Container>
    
    <WebsiteFooter/>
    </div>
  );
};
