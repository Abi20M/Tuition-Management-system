import { Box, createStyles, Group, Text } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderTop: `${1} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },
}));

export const WebsiteFooter = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.footer}>
      <Group position="center">
        <Text color={"dimmed"} size="sm">
          © 2023 Tuition Management System. All rights reserved.
        </Text>
      </Group>
    </Box>
  );
};

export default WebsiteFooter;
