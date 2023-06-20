import { useState } from "react";
import {
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Burger,
  useMantineColorScheme,
  Image,
  createStyles,
  Container,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout, IconChevronDown } from "@tabler/icons";
import adminDashboardLogoDark from "../../assets/adminDashboardLogoDark.png";
import adminDashboardLogoLight from "../../assets/adminDashboardLogoLight.png";
import defaultUserImage from "../../assets/defaultprofile.png";
import LightDarkButton from "../lightDarkButton";

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
  },

  mainSection: {
    paddingBottom: 55,
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

const StudentHeader = () => {
  const { classes, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const user = JSON.parse(localStorage.getItem("student") || "{}");

  return (
    <Box className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          {/* dashboard logo */}
          <Image
            src={dark ? adminDashboardLogoDark : adminDashboardLogoLight}
            width={100}
          />
          {/* profileDropDown */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {/* dark mode button implementation */}
            <LightDarkButton marginLeft={10} marginTop={10} marginBottom={10} />
            <Burger
              opened={opened}
              onClick={toggle}
              className={classes.burger}
              size="sm"
            />
            <Menu
              width={260}
              position="bottom-end"
              transition="pop-top-right"
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group spacing={7}>
                    {/* profile picture */}
                    <Avatar
                      src={defaultUserImage}
                      alt={user.name}
                      radius="xl"
                      size={20}
                    />
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {user.name}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{user.name.toUpperCase()}</Menu.Label>
                <Menu.Label>{user.email.toUpperCase()}</Menu.Label>
                <Menu.Divider />
                <Menu.Item icon={<IconLogout size={14} stroke={1.5} />}>
                  <a
                    href="/logout"
                    style={{
                      color: "inherit",
                      textDecoration: "inherit",
                    }}
                  >
                    Logout
                  </a>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        </Group>
      </Container>
    </Box>
  );
};

export default StudentHeader;
