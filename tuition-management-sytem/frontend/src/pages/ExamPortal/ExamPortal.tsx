import { Image, Box, Button, Paper, SimpleGrid } from "@mantine/core";
import teacher from "../../assets/teacher.jpg";
import student from "../../assets/student.jpg";
import { Link } from "react-router-dom";
import { ExamPortalHero, Footer } from "../../components";

//set the page title
document.title = "Exam Portal - Sysro Tution Management System";

const ExamPortal: React.FC = () => {
  return (
    <Box>
      <ExamPortalHero />
      <SimpleGrid
        cols={2}
        w="80%"
        mr="auto"
        ml="auto"
        mt={100}
        id="select-login-type"
      >
        <Paper
          radius="md"
          withBorder
          p="lg"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
          })}
          m="md"
        >
          <Image
            width={300}
            height={300}
            mx="auto"
            radius="md"
            src={teacher}
            alt="Teacher"
          />
          <Link
            to="/exam-portal/teacher-login"
            style={{ textDecoration: "none" }}
          >
            <Button color="red" fullWidth mt="md">
              Continue as a Teacher
            </Button>
          </Link>
        </Paper>
        <Paper
          radius="md"
          withBorder
          p="lg"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
          })}
          m="md"
        >
          <Image
            width={300}
            height={300}
            mx="auto"
            radius="md"
            src={student}
            alt="Student"
          />
          <Link
            to="/exam-portal/student-login"
            style={{ textDecoration: "none" }}
          >
            <Button color="red" fullWidth mt="md">
              Continue as a Student
            </Button>
          </Link>
        </Paper>
      </SimpleGrid>
      <Footer />
    </Box>
  );
};

export default ExamPortal;
