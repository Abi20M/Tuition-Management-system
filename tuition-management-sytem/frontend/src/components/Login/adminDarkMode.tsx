import {Group, Button} from '@mantine/core';
import LightDarkButton from '../lightDarkButton';
export const AdminLoginDarkMode = () =>{

    return (
        <Group position="right" spacing="sm" mt={-220}>
            <LightDarkButton/>
            <Button color="red" mr={5}component="a" href="admin/login">Login as an Admin</Button>
        </Group>
    )
}