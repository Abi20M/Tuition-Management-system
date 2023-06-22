import { useState, useEffect, createContext } from "react";
import {
  Group,
  Text,
  useMantineColorScheme,
  Image,
  createStyles,
  Container,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import adminDashboardLogoDark from "../../assets/adminDashboardLogoDark.png";
import adminDashboardLogoLight from "../../assets/adminDashboardLogoLight.png";

import LightDarkButton from "../../components/lightDarkButton";


// Custom Theme
const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.md,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[2]
    }`,
    // marginBottom: 120,
  },

  mainSection: {
    paddingBottom: 20,
  },

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },
}));

const QrHeader = () => {
  const { classes, theme, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [sidePanelOpened, setSidePanelOpened] = useState(false); //use to open and close the side pannel of the admin details


  // calculate the week
  const calculateWeek = () =>{
    const d = new Date();
    const date = d.getDate();

    if(date>=1 && date <=7){
      return 1;
    }else if( date >7 && date <= 14){
      return 2;
    }else if( date > 14 && date <=21){
     return 3; 
    }else{
      return 4;
    }
  };

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          {/* dashboard logo */}
          <Image
            src={dark ? adminDashboardLogoDark : adminDashboardLogoLight}
            width={100}
          />
        <Text weight={500} size={30}>{`Marking Attendance (${calculateWeek()}th Week)`}</Text>
          {/* dark mode button implementation */}
          <LightDarkButton marginLeft={10} marginTop={10} marginBottom={10} />
        </Group>
      </Container>
    </div>
  );
};

export default QrHeader;
