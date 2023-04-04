import { ActionIcon, useMantineColorScheme, Tooltip } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons";

function LightDarkButton(props : any) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Tooltip
      label={dark ? "Light Mode" : "Dark Mode"}
      withArrow
      arrowSize={6}
      offset={10}
      color={dark ? "yellow" : "black"}
      transition ="pop"
      openDelay={100}
    >
      <ActionIcon
        variant="outline"
        color={dark ? "yellow" : "blue"}
        onClick={() => toggleColorScheme()}
        title="Toggle color scheme"
        ml={props.marginLeft}
        mt={props.marginTop}
        mb={props.marginBottom}
      >
        {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
      </ActionIcon>
    </Tooltip>
  );
}

export default LightDarkButton;
