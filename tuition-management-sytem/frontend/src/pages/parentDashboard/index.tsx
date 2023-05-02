import { createStyles, Container, Tabs } from "@mantine/core";
import AdminHeader from "../../components/adminHeader";
import ParentHeader from "../../components/ParentHeader";
import ManageParents from "../../components/ManageParents";
import WebsiteFooter from "../../components/Footer";
import ParentOverview from "../../components/parentDashboard"



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
  "My Children",
  
];

export const ParentDashboard = () => {
  //change the tab Title
  document.title = "Parent Dashboard - Tuition Management System";

  const { classes, theme, cx } = useStyles();

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab} mb={30}>
      {tab}
    </Tabs.Tab>
  ));

  //get Admin information from the localStorage and we convert into that information into JSON object using JSON.parse()
  const parent = JSON.parse(localStorage.getItem("parent") || "{}");

  //user information object
  const user = {
    _id: parent._id,
    id: parent.id,
    name: parent.name,
    email:parent.email,
    phone: parent.phone,
    
  };

  return (
    <div>
      {/* import admin Header */}
    {/* <AdminHeader user ={user}/> */}

    {/* import parent Header */}
    <ParentHeader user = {user}/>

    {/* Tabs */}
    <Container>
      <Tabs
        defaultValue="Overview"
        variant="outline"
        classNames={{
          root: classes.tabs,
          tabsList: classes.tabsList,
          tab: classes.tab,
        }}
      >
        
        <Tabs.List grow>{items}</Tabs.List>

        {/* Here you can add your own Component to here */}
        <Tabs.Panel value="Overview">
          <h1>Hello Overview</h1>
        </Tabs.Panel>
        <Tabs.Panel value="My Children">
          <ParentOverview/>
        </Tabs.Panel>
         
      </Tabs>
    </Container>

    <WebsiteFooter/>
    </div>
  );
};


