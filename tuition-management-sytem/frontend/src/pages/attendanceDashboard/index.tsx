import { createStyles, Container, Tabs } from "@mantine/core";
import AdminHeader from "../../components/adminHeader";
import WebsiteFooter from "../../components/Footer";
import React, { useState } from 'react';
import MarkAttendence from "../../components/AttendanceManage/markAttendance";
import AttendanceHeader from "../../components/AttendanceHeader";


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
  "Attendance Section",
 
];

export const AttendanceDashboard = () => {
    
  //change the tab Title
  document.title = "Attendance Dashboard - Tuition Management System";

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
    customId : admin.adminId,
    name: admin.name,
    email : admin.email,
    telephone : admin.telephone,
    address : admin.address
  };

  return (
    <div>
      {/* import admin Header */}
    <AttendanceHeader user ={user}/>

    {/* Tabs */}
    <Container>
      <Tabs
        defaultValue="Attendance Section"
        variant="outline"
        classNames={{
          root: classes.tabs,
          tabsList: classes.tabsList,
          tab: classes.tab,
        }}
      >
        
        <Tabs.List grow>{items}</Tabs.List>

        {/* Here you can add your own Component to here */}
        <Tabs.Panel value="Attendance Section">
          <MarkAttendence/>
        </Tabs.Panel>
      </Tabs>
    </Container>

    <WebsiteFooter/>
    </div>
  );
};


