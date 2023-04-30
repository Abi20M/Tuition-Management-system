import {
  createStyles,
  Overlay,
  Container,
  Title,
  Button,
  Text,
  Group,
} from "@mantine/core";
import LightDarkButton from "../lightDarkButton";
import EXAMPORTALBG from "../../assets/exam-portal-background.jpg";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  hero: {
    position: "relative",
    backgroundImage: `url(${EXAMPORTALBG})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  container: {
    height: 550,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingBottom: theme.spacing.xl * 6,
    zIndex: 0,
    position: "relative",
    marginLeft: "10%",

    [theme.fn.smallerThan("sm")]: {
      height: 550,
      paddingBottom: theme.spacing.xl * 3,
    },
  },

  title: {
    color: theme.white,
    fontSize: 60,
    fontWeight: 900,
    lineHeight: 1.1,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 40,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 600,

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
      fontSize: theme.fontSizes.sm,
    },
  },

  control: {
    marginTop: theme.spacing.xl * 1.5,

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
}));

const ExamPortalHero: React.FC = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Group position="right" spacing="sm" pt={20}>
        <LightDarkButton />
        <Link to="/">
          <Button color="yellow" mr={30}>
            Go Back to Home
          </Button>
        </Link>
      </Group>
      <Container className={classes.container}>
        <Title className={classes.title}>Welcome to the Exam Portal!</Title>
        <Text className={classes.description} size="xl" mt="xl">
          Whether you're a teacher or student, our Exam Portal makes exam
          management a breeze. With easy access to exam schedules, results, and
          performance statistics, our user-friendly platform simplifies the exam
          experience for all. Welcome to a better way of managing exams with our
          Exam Portal.
        </Text>
        <Button
          variant="gradient"
          size="xl"
          radius="xl"
          className={classes.control}
          component="a"
          href="#select-login-type"
        >
          Get started
        </Button>
      </Container>
    </div>
  );
};

export default ExamPortalHero;
