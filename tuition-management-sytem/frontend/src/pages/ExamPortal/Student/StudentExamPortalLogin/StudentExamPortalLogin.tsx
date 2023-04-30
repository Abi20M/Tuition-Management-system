import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconAlertTriangle, IconArrowBackUp } from "@tabler/icons";
import StudentAPI from "../../../../API/studentAPI";
import { Link } from "react-router-dom";

const StudentExamPortalLogin: React.FC = () => {
  if (localStorage.getItem("role")) {
    if (localStorage.getItem("role") === "student") {
      window.location.href = "/exam-portal/student/dashboard   ";
    } else {
      //to do
    }
  }

  const studentLogin = (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    showNotification({
      id: "login-student",
      loading: true,
      title: "Logging in...",
      message: "Please wait while we log you in to the student dashboard",
      autoClose: false,
      disallowClose: true,
    });

    StudentAPI.studentLogin(values.email, values.password)
      .then((response) => {
        updateNotification({
          id: "login-student",
          color: "teal",
          title: "Logged in successfully",
          message:
            "You have been logged in successfully. Redirecting you to the student dashboard...",
          icon: <IconCheck size={16} />,
          autoClose: 1000,
        });
        //add data to local storage
        localStorage.setItem("student", JSON.stringify(response.data));
        //wait to notification to close and redirect to student dashboard
        setTimeout(() => {
          //Add role to local storage
          localStorage.setItem("role", "student");
          window.location.href = "/exam-portal/student/dashboard   ";
        }, 1000);
      })
      .catch((error) => {
        updateNotification({
          id: "login-student",
          color: "red",
          title: "Login failed",
          message:
            "We were unable to log you in. Please check your email and password and try again.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { email: "", password: "", remember: false },

    validate: {
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",
    },
  });

  //set the page title
  document.title = "Student Login - Exam Portal";
  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Student Login
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Enter your credentials to access the Student Dashboard
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => studentLogin(values))}>
          <TextInput
            label="Email"
            placeholder="you@example.dev"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Group position="apart" mt="md">
            <Checkbox label="Remember me" {...form.getInputProps("remember")} />
            <Anchor<"a"> href="/student-forget-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>
        <Link to="/exam-portal" style={{ textDecoration: "none" }}>
          <Box
            sx={{
              width: "70%",
              marginTop: "20px",
              marginLeft: "auto",
              marginRight: "auto",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconArrowBackUp size={16} />
            <Text align="center" color="blue" ml={10}>
              Go back to Exam Portal
            </Text>
          </Box>
        </Link>
      </Paper>
    </Container>
  );
};

export default StudentExamPortalLogin;
