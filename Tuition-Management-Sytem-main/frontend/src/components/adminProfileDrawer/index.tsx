import {
  Avatar,
  Button,
  Container,
  Group,
  Input,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconEdit, IconLock, IconPassword, IconTrash } from "@tabler/icons";
import { useState, useContext, SetStateAction, Dispatch, useEffect } from "react";
import defaultUser from "../../assets/defaultprofile.png";

interface iProps {
  sidePannel: (value: boolean) => void;
  adminDetails :{
      name : string,
      email : string
  }
}


export const AdminDrawer = (props: iProps) => {
  const [openedPassword, setOpenedPassword] = useState(false);
  const { sidePannel } = props;

  // useEffect(()=>{
  //   return () => {setOpenedPassword(true)};
  // },[sidePannel]);

  return (
    <Container>
      {/* profile Picture */}
      <Group position="center">
        <Avatar src={defaultUser} style={{ width: "100px", height: "100px" }} />
      </Group>
      {/* user Username and Email show under the profile picture */}
      <h3 style={{ textAlign: "center" }}>{props.adminDetails.name}</h3>
      <h6
        style={{ textAlign: "center", color: "GrayText", marginTop: "-10px" }}
      >
        <i>{props.adminDetails.email}</i>
      </h6>
      {/* input fields of user data */}
      <Stack p={20} mt={-10}>
        <TextInput
          label="Name"
          value={props.adminDetails.name}
          contentEditable={false}
          readOnly
        />
        <TextInput
          label="Email"
          value={props.adminDetails.email}
          contentEditable={false}
          readOnly
        />
        <TextInput
          label="Address"
          value={"No.84,Wendala,Ruwanwella"}
          contentEditable={false}
          readOnly
        />
        <TextInput
          label="Mobile No."
          value={"0712906815"}
          contentEditable={false}
          readOnly
        />
      </Stack>
      <Group position="apart" pl={20} pr={20}>
        <Button
          mt={10}
          size={"xs"}
          variant={"light"}
          leftIcon={<IconLock size={10} />}
          onClick={() => {
            setOpenedPassword(true);           
          }}
        >
          Change Password
        </Button>
        <Button
          type="submit"
          mt={10}
          size={"xs"}
          variant={"light"}
          color={"teal"}
          leftIcon={<IconEdit size={10} />}
        >
          Update Profile
        </Button>
        <Button
          mt={10}
          size={"xs"}
          variant={"light"}
          color={"red"}
          leftIcon={<IconTrash size={10} />}
        >
          Delete Profile
        </Button>
      </Group>


      {/* edit password modal */}
      <Modal
        opened={openedPassword}
        onClose={() => setOpenedPassword(false)}
        title="Change password"
        centered
        closeOnEscape
        closeOnClickOutside
      >
        <Stack>
          <TextInput
            label="Current Password"
            type={"password"}
            placeholder="current password"
          />
          <TextInput
            label="New Password"
            type={"password"}
            placeholder="new password"
          />
        </Stack>
      </Modal>
    </Container>
  );
};

export default AdminDrawer;
