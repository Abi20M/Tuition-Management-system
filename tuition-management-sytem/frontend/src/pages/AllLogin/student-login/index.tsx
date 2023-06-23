import {
    Paper,
    Title,
    PasswordInput,
    Checkbox,
    Button,
    TextInput,
    createStyles,
    Center,
    Grid,
    Image,
    Group,
    Stack,
    Divider,
    Anchor,
    useMantineColorScheme,
    Text,

  } from "@mantine/core";
  import { useForm } from "@mantine/form";
  import adminDarkModeLogo from "../../../assets/adminDarkModeLogo.png";
  import adminLoginLogo2 from "../../../assets/studentLoginLogo.jpg";
  import {
    GoogleButton,
    FacebookButton,
  } from "../../../assets/SocialButtons/SocialButtons";
  import LightDarkButton from "../../../components/lightDarkButton";
  import { adminAPI } from "../../../API/adminAPI";
  import { showNotification, updateNotification } from "@mantine/notifications";
  import DarkLogo from "../../../assets/darkMainLogo.png";
  import lightLogo from '../../../assets/logo1.png';
import { IconAlertTriangle, IconCheck } from "@tabler/icons";
import StudentAPI from "../../../API/studentAPI";
  
  //set the page title
  document.title = "Student Login"
  //create a Custom style class
  const useStyles = createStyles((theme) => ({
    form: {
      borderLeft: `1px solid ${
        theme.colorScheme === "dark" ? theme.colors.gray[8] : theme.colors.gray[3]
      }`,
      [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
        maxWidth: "100%",
      },
    },
  
    title: {
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
  }));
  
  //pass the form data to the backend
  const validateAdmin = (values: {
    email: string;
    password: string;
    rememberMe: boolean;
  }): void => {
    //show loading notification in the login page
    showNotification({
      id: "admin-login",
      loading: true,
      title: "Fetching User Details",
      message: "we are tying to validate user information",
      autoClose: false,
      disallowClose: true,
    });
  
    //call the API>adminAPI > loginAdmin funtion and call to the backend
    StudentAPI
      .studentLogin(values.email, values.password)
      .then((response) => {
        //show success Notification
        setTimeout(() => {
          updateNotification({
            id: "admin-login",
            color: "teal",
            title: "User Verified!",
            message: "Congrats! You will be redirected to Admin Dashboard.",
            icon: <IconCheck size={16} />,
            autoClose: 2000,
          });
        }, 1000);
  
        //store student details to local storage for further use
        localStorage.setItem("student", JSON.stringify(response.data));
  
        //store Role key and value as admin in the localStorage, after 2sec browser will be redirected to the admin Dashboard
        setTimeout(() => {
          localStorage.setItem("role", "student");
          window.location.href = "/student/dashboard";
        }, 2000);
      })
      .catch((error) => {
        updateNotification({
          id: "admin-login",
          color: "red",
          title: "Login Failed",
          message: "That email or password doesn't match. Please try again.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 2000,
        });
      });
  };
  
  export const StudentLoginPage = () => {
    const { classes } = useStyles();
  
    //select color mode (DARK, LIGHT)
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  
    const dark = colorScheme === "dark";
  
    //from Structure
    const form = useForm({
      validateInputOnChange: true,
  
      initialValues: {
        email: "",
        password: "",
        rememberMe: false,
      },
      validate: {
        email: (value) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          )
            ? null
            : "Invalid Email",
      },
    });
  
    return (
      <>
        <Group position="right" mt={10} mr={10}>
          <LightDarkButton />
        </Group>
        <Center>
          <Paper
            shadow={"lg"}
            mt={20}
            sx={{ width: 900, height: 550 }}
            withBorder
          >
            <Grid grow>
              <Grid.Col md={6} lg={3}>
                <Image
                  src={dark ? adminDarkModeLogo : adminLoginLogo2}
                  mt={dark ? 40 : 60}
                  ml={10}
                  p={dark ? 50 : 20}
                />
              </Grid.Col>
              <Grid.Col md={6} lg={3}>
                <Paper className={classes.form}>
                  {/* system Logo */}
                  <Center>
                    <Image src={dark ? DarkLogo : lightLogo} width={75} height={75} mt={25}/>
                  </Center>
                  <Title pt={"lg"} align="center" className={classes.title}>
                    Welcome Back to Sysro!
                  </Title>
  
                  {/* Form */}
                  <Paper p={30}>
  
                    {/* FORM STRUCTURE */}
                    <form
                      onSubmit={form.onSubmit((values) => validateAdmin(values))}
                    >
                      <Stack mt={5}>
                        <TextInput
                          label="Email"
                          placeholder="you@email.com"
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
                        <Group position="apart" mt="lg">
                          <Checkbox
                            label="Remember me"
                            sx={{ lineHeight: 1 }}
                            {...form.getInputProps("rememberMe")}
                          />
                          <Anchor<"a">
                            onClick={(event) => event.preventDefault()}
                            href="#"
                            size="sm"
                          >
                            Forgot password?
                          </Anchor>
                        </Group>
                      </Stack>
                      <Button type="submit" fullWidth mt={40} mb={10}>
                        Sign in
                      </Button>
                    </form>
                  </Paper>
                </Paper>
              </Grid.Col>
            </Grid>
          </Paper>
        </Center>
      </>
    );
  };
  