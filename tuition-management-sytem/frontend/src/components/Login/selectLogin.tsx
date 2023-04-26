import {
  Grid,
  Paper,
  Avatar,
  Text,
  Button,
  Group,
  Box,
  BackgroundImage,
  useMantineColorScheme,
  Footer,
  createStyles,
} from "@mantine/core";
import teacher from "../../assets/teacher.jpg";
import student from "../../assets/student.jpg";
import parent from "../../assets/parent.jpg";
import instructor from "../../assets/instructor.jpg";
import financeManagement from "../../assets/financeManagement.jpg";
import attendance from "../../assets/attendance.jpg";
import examManage from "../../assets/examManage.jpg";
import "aos/dist/aos.css";
import AOS from "aos";
import { useEffect } from "react";
import React from "react";
import welcomeBackground1 from "../../assets/welcomeBackground1.svg";
import welcomeBackground2 from "../../assets/welcomeBackground2.svg";
import { GetInTouch } from "../contactUs";
import getBack1 from '../../assets/getInTouch1.svg';
import getBack2 from '../../assets/getInTouch2.svg';
import WebsiteFooter from '../Footer/index'


export const SelectLogin = React.forwardRef((props, ref: any) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  useEffect(() => {
    AOS.init({
      duration: 800, // animation duration (in ms)
    });
  }, []);

  return (
    <>
      <Box ref={ref}>
        <BackgroundImage src={dark ? welcomeBackground2 : welcomeBackground1}>
          <Group
            position="center"
            grow
            mr={100}
            ml={100}
            mb={10}
          >
            <Paper
              radius="md"
              withBorder
              p="lg"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.white,
              })}
              mt={20}
            >
              <Avatar src={teacher} size={120} radius={120} mx="auto" />
              <Text align="center" size="lg" weight={"Bold"} mt="md">
                Teacher
              </Text>
              <Text align="center" size="sm" weight="lighter" mt="md">
                Teaching is an profession that teaches all the other
                Professions, A teacher can analize the student performance.Are
                you a Teacher ? Then this Login for you
              </Text>
              <Button
                color="red"
                fullWidth
                mt="md"
                component="a"
                href="/teacher/login"
              >
                Login as a Teacher
              </Button>
            </Paper>

            <Paper
              radius="md"
              withBorder
              p="lg"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.white,
              })}
              mt={20}
              // data-aos = "fade-down" data-aos-delay = "400"
            >
              <Avatar src={student} size={120} radius={120} mx="auto" />
              <Text align="center" size="lg" weight={"bold"} mt="md">
                Student
              </Text>
              <Text align="center" size="sm" weight="lighter" mt="md">
                Student is a valueble human in this world. Our mission to
                protect and feed you with good intenstions, Are you a Student?
                If yes, this login for you!
              </Text>
              <Button
                color="red"
                fullWidth
                mt="md"
                component="a"
                href="/student/login"
              >
                Login as a Student
              </Button>
            </Paper>

            <Paper
              radius="md"
              withBorder
              p="lg"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.white,
              })}
              mt={20}
              // data-aos = "fade-down" data-aos-delay = "600"
            >
              <Avatar src={parent} size={120} radius={120} mx="auto" />
              <Text align="center" size="lg" weight={"bold"} mt="md">
                Parent
              </Text>
              <Text align="center" size="sm" weight="lighter" mt="md">
                There is no such thing as a perfect parent. Parents can analize
                their children performance and their details via this Protal..
                Are you parent? Then. This Portal for you!
              </Text>
              <Button
                color="red"
                fullWidth
                mt="md"
                component="a"
                href="/parent/login"
              >
                Login as a Parent
              </Button>
            </Paper>
          </Group>

          <Group
            position="center"
            grow
            mr={100}
            ml={100}

          >
            <Paper
              radius="md"
              withBorder
              p="lg"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.white,
              })}
              mb = {40}
              // data-aos = "fade-down" data-aos-delay = "800"
            >
              <Avatar src={examManage} size={120} radius={120} mx="auto" />
              <Text align="center" size="lg" weight={"bold"} mt="md">
                Exam Management
              </Text>
              <Text align="center" size="sm" weight="lighter" mt="md">
                Expenses management refers to the process of tracking, analyzing
                and controlling expenses incurred by an individual or
                organization. Are you a financial manager? Then this Login for
                you!
              </Text>
              <Button
                color="red"
                fullWidth
                mt="md"
                component="a"
                href="instructor/login"
              >
                Login as a Teacher
              </Button>
            </Paper>
            <Paper
              radius="md"
              withBorder
              p="lg"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.white,
              })}
              mb = {40}
              // data-aos = "fade-down"  data-aos-delay = "200"
            >
              <Avatar
                src={financeManagement}
                size={120}
                radius={120}
                mx="auto"
              />
              <Text align="center" size="lg" weight={"bold"} mt="md">
                Expense Management
              </Text>
              <Text align="center" size="sm" weight="lighter" mt="md">
                Expenses management refers to the process of tracking, analyzing
                and controlling expenses incurred by an individual or
                organization. Are you a financial manager? Then this Login for
                you!
              </Text>
              <Button
                color="red"
                fullWidth
                mt="md"
                component="a"
                href="/financial/login"
              >
                Manage Expenses
              </Button>
            </Paper>

            <Paper
              radius="md"
              withBorder
              p="lg"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.white,
              })}
              mb = {40}
              // data-aos = "fade-down" data-aos-delay = "400"
            >
              <Avatar src={attendance} size={120} radius={120} mx="auto" />
              <Text align="center" size="lg" weight={"bold"} mt="md">
                Attendance Management
              </Text>
              <Text align="center" size="sm" weight="lighter" mt="md">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus qui alias commodi quo nam nesciunt dicta ab. Totam
                officia quas qui. Eaque reprehenderit nemo autem hic velit?
                Consequatur, dolor voluptatem.
              </Text>
              <Button
                color="red"
                fullWidth
                mt="md"
                component="a"
                href="attendance/login"
              >
                Manage Attendance
              </Button>
            </Paper>
          </Group>
        </BackgroundImage>
      </Box>
      <BackgroundImage
          src= { dark ? getBack2 : getBack1}
          // style={{backgroundRepeat : "no-repeat",backgroundSize : 100}}
          pt={40}
          pb={100}
          mb={-120}
        >
      <Box data-aos = "zoom-in-up" data-aos-delay = "300">

        <GetInTouch />
        
        
      </Box>
      </BackgroundImage>
      

      {/* Footer */}
      <WebsiteFooter/>
    </>
    // <Grid>
    //   {/* Teacher Colum */}
    //   <Grid.Col mt={50} md={6} lg={3} ml={5} mr={-5}  >
    //     <Paper
    //       radius="md"
    //       withBorder
    //       p="lg"
    //       sx={(theme) => ({
    //         backgroundColor:
    //           theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    //       })}
    //       data-aos = "fade-down" data-aos-delay = "200"
    //     >
    //       <Avatar src={teacher} size={120} radius={120} mx="auto" />
    //       <Text align="center" size="lg" weight={"Bold"} mt="md">
    //         Teacher
    //       </Text>
    //       <Text align="center" size="sm" weight="lighter" mt="md">
    //         Teaching is an profession that teaches all the other Professions, A
    //         teacher can analize the student performance.Are you a Teacher ? Then
    //         this Login for you
    //       </Text>
    //       <Button
    //         color="red"
    //         fullWidth
    //         mt="md"
    //         component="a"
    //         href="teacher/login"
    //       >
    //         Login as a Teacher
    //       </Button>
    //     </Paper>
    //   </Grid.Col>

    // {/* Student Colum */}
    // <Grid.Col mt={50} md={6} lg={3} mr={-5} >
    //   <Paper
    //     radius="md"
    //     withBorder
    //     p="lg"
    //     sx={(theme) => ({
    //       backgroundColor:
    //         theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    //     })}
    //     data-aos = "fade-down" data-aos-delay = "400"
    //   >
    //     <Avatar src={student} size={120} radius={120} mx="auto" />
    //     <Text align="center" size="lg" weight={"bold"} mt="md">
    //       Student
    //     </Text>
    //     <Text align="center" size="sm" weight="lighter" mt="md">
    //       Student is a valueble human in this world. Our mission to protect
    //       and feed you with good intenstions, Are you a Student? If yes, this
    //       login for you!
    //     </Text>
    //     <Button
    //       color="red"
    //       fullWidth
    //       mt="md"
    //       component="a"
    //       href="student/login"
    //     >
    //       Login as a Student
    //     </Button>
    //   </Paper>
    // </Grid.Col>

    // {/* Parent Colum */}
    // <Grid.Col mt={50} md={6} lg={3} mr={-5}>
    //   <Paper
    //     radius="md"
    //     withBorder
    //     p="lg"
    //     sx={(theme) => ({
    //       backgroundColor:
    //         theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    //     })}
    //     data-aos = "fade-down" data-aos-delay = "600"
    //   >
    //     <Avatar src={parent} size={120} radius={120} mx="auto" />
    //     <Text align="center" size="lg" weight={"bold"} mt="md">
    //       Parent
    //     </Text>
    //     <Text align="center" size="sm" weight="lighter" mt="md">
    //       There is no such thing as a perfect parent. Parents can analize
    //       their children performance and their details via this Protal.. Are
    //       you parent? Then. This Portal for you!
    //     </Text>
    //     <Button
    //       color="red"
    //       fullWidth
    //       mt="md"
    //       component="a"
    //       href="parent/login"
    //     >
    //       Login as a Parent
    //     </Button>
    //   </Paper>
    // </Grid.Col>

    // {/* Instructor Colum */}
    // <Grid.Col mt={50} md={6} lg={3}>
    //   <Paper
    //     radius="md"
    //     withBorder
    //     p="lg"
    //     sx={(theme) => ({
    //       backgroundColor:
    //         theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    //     })}
    //     data-aos = "fade-down" data-aos-delay = "800"
    //   >
    //     <Avatar src={examManage} size={120} radius={120} mx="auto" />
    //     <Text align="center" size="lg" weight={"bold"} mt="md">
    //       Exam Management
    //     </Text>
    //     <Text align="center" size="sm" weight="lighter" mt="md">
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur, pariatur at! Quas consequatur,
    //       magnam nisi distinctio dolore repudiandae aut rem quos ratione
    //     </Text>
    //     <Button
    //       color="red"
    //       fullWidth
    //       mt="md"
    //       component="a"
    //       href="instructor/login"
    //     >
    //       Login as a Teacher
    //     </Button>
    //   </Paper>
    // </Grid.Col>

    //   {/* Expense Management Login and Attendance Marking System */}
    //   <Group position="center" spacing={-5} mt={-20} mb={10}>
    //     <Grid.Col mt={50} md={6} lg={3}>
    //       <Paper
    //         radius="md"
    //         withBorder
    //         p="lg"
    //         sx={(theme) => ({
    //           backgroundColor:
    //             theme.colorScheme === "dark"
    //               ? theme.colors.dark[8]
    //               : theme.white,
    //         })}
    //         data-aos = "fade-down"  data-aos-delay = "200"
    //       >
    //         <Avatar src={financeManagement} size={120} radius={120} mx="auto" />
    //         <Text align="center" size="lg" weight={"bold"} mt="md">
    //           Expense Management
    //         </Text>
    //         <Text align="center" size="sm" weight="lighter" mt="md">
    //         Expenses management refers to the process of tracking, analyzing and controlling expenses
    //         incurred by an individual or organization.
    //         Are you a financial manager? Then this Login for you!
    //         </Text>
    //         <Button
    //           color="red"
    //           fullWidth
    //           mt="md"
    //           component="a"
    //           href="financial/login"
    //         >
    //           Manage Expenses
    //         </Button>
    //       </Paper>
    //     </Grid.Col>
    //     <Grid.Col mt={50} md={6} lg={3}>
    //       <Paper
    //         radius="md"
    //         withBorder
    //         p="lg"
    //         sx={(theme) => ({
    //           backgroundColor:
    //             theme.colorScheme === "dark"
    //               ? theme.colors.dark[8]
    //               : theme.white,
    //         })}
    //         data-aos = "fade-down" data-aos-delay = "400"
    //       >
    //         <Avatar src={attendance} size={120} radius={120} mx="auto" />
    //         <Text align="center" size="lg" weight={"bold"} mt="md">
    //           Attendance Management
    //         </Text>
    //         <Text align="center" size="sm" weight="lighter" mt="md">
    //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus qui alias
    //           commodi quo nam nesciunt dicta ab. Totam officia quas qui.
    //           Eaque reprehenderit nemo autem hic velit? Consequatur, dolor voluptatem.
    //         </Text>
    //         <Button
    //           color="red"
    //           fullWidth
    //           mt="md"
    //           component="a"
    //           href="instructor/login"
    //         >
    //           Manage Attendance
    //         </Button>
    //       </Paper>
    //     </Grid.Col>
    //   </Group>
    // </Grid>
  );
});
