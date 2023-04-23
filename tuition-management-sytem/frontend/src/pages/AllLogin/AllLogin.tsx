import { Title, Image, Box, Grid, useMantineColorScheme, createStyles, Overlay, Container, Text, Button } from "@mantine/core";
import MainLogo from "../../assets/logo1.png";
import darkMianLogo from '../../assets/darkMainLogo.png';
import { AdminLoginDarkMode } from "../../components/Login/adminDarkMode";
import { SelectLogin } from "../../components/Login/selectLogin";
import { useRef } from "react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: 200,
    paddingBottom: 100,
    height: 650,
    backgroundImage:
      'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    [theme.fn.smallerThan('xs')]: {
      paddingTop: 80,
      paddingBottom: 50,
    },
  },

  inner: {
    position: 'relative',
    zIndex: 1,
  },

  title: {
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.white,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('xs')]: {
      fontSize: 28,
      textAlign: 'left',
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][4],
  },

  description: {
    color: theme.colors.gray[0],
    textAlign: 'center',
    paddingTop: "15px",
    paddingBottom: "15px",

    [theme.fn.smallerThan('xs')]: {
      fontSize: theme.fontSizes.md,
      textAlign: 'left',
    },
  },

  controls: {
    marginTop: 30,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  control: {
    height: 42,
    fontSize: theme.fontSizes.md,

    '&:not(:first-of-type)': {
      marginLeft: theme.spacing.md,
    },

    [theme.fn.smallerThan('xs')]: {
      '&:not(:first-of-type)': {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },

  secondaryControl: {
    color: theme.white,
    backgroundColor: 'rgba(255, 255, 255, .4)',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, .45) !important',
    },
  },
}));



export const AllLogin = () => {

  //Home page tab title
  document.title = "SYSRO - Tuition Management System";
  
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { classes, cx } = useStyles();

  const loginSection = useRef(null);

  const dark = colorScheme === "dark";

  const handleScroll = (elmRef: any) => {
    window.scrollTo({ top: elmRef.current.offsetTop, behavior: "smooth" })
  }
  return (
    <Box>
      {/* <Box>
        <Grid>
          <Grid.Col mt={20} mr={-20}>
            <AdminLoginDarkMode />
          </Grid.Col>
          <Grid.Col>
            <Image
              src={dark ? darkMianLogo : MainLogo}
              style={{
                width: 100,
                height: 95,
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "-10px",
              }}
              alt="Business Logo"
              radius="lg"
            />
          </Grid.Col>
          <Grid.Col mt={-10}>
            <Title
              order={1}
              style={{
                fontSize: "30px",
                textAlign: "center",
                marginTop: "5px",
              }}
            >
              Tuition Management System
            </Title>
          </Grid.Col>
        </Grid>
      </Box> */}

      <div className={classes.wrapper}>
        <Overlay color="#000" opacity={0.65} zIndex={1} />
        <div className={classes.inner}>

          <Grid>
            <Grid.Col>
              <Image
                src={darkMianLogo}
                style={{
                  width: 150,
                  height: 100,
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginBottom: "70px",
                  marginTop: "-150px",
                }}
                alt="Business Logo"
                radius="lg"
              /></Grid.Col>
            <Grid.Col>
              <AdminLoginDarkMode />
            </Grid.Col>
          </Grid>


          <Title className={classes.title}>
            <Text component="span" inherit className={classes.highlight}>
              Sysro
            </Text>
            {''} Tuition Management System

          </Title>

          <Container size={680}>
            <Text size="lg" className={classes.description}>
              Welcome to our Tuition Management System, Sysro Institute is a well-established tuition center located in Ruwanwella, Sri Lanka. The
              institute has been providing quality education to students for over a decade, catering to students
              from grade 1 up to A-levels. With a team of highly qualified and experienced teachers, Sysro
              Institute is known for its commitment to delivering excellent academic results and ensuring the
              overall development of its students.
            </Text>
          </Container>

          <div className={classes.controls}>
            <Button className={classes.control} variant="white" size="lg" onClick={() => handleScroll(loginSection)}>
              Get started
            </Button>
          </div>
        </div>
      </div>
      {/* <div ref={loginSection} style={{marginTop : "10px"}}> */}
      <SelectLogin ref={loginSection} />
      {/* </div> */}

    </Box>
  );
};
