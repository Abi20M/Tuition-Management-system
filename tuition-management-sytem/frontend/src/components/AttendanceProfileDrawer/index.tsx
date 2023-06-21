import {
    Avatar,
    Button,
    Container,
    Group,
    Text,
    Input,
    Modal,
    Stack,
    TextInput,
  } from "@mantine/core";
  import {
    IconAlertTriangle,
    IconCheck,
    IconEdit,
    IconLock,
    IconPassword,
    IconTrash,
  } from "@tabler/icons";
  import {
    useState,
    useContext,
    SetStateAction,
    Dispatch,
    useEffect,
  } from "react";
  import defaultUser from "../../assets/defaultprofile.png";
  import { showNotification, updateNotification } from "@mantine/notifications";
  import adminAPI from "../../API/adminAPI";
  import { useForm } from "@mantine/form";
  import { openConfirmModal } from "@mantine/modals";
  import Logout from "../logout";
  import { useNavigate } from "react-router-dom";
  
  interface admin {
    _id: string;
    customId: string;
    name: string;
    email: string;
    telephone: string;
    address: string;
  }
  
  interface iProps {
    sidePannel: (value: boolean) => void;
    adminDetails: {
      _id: string;
      customId: string;
      name: string;
      email: string;
      telephone: string;
      address: string;
    };
  }
  
  
  export const AttendanceProfileDrawer = (props : iProps) => {
    const { sidePannel } = props;
    const navigate = useNavigate();
  
    const [data, setData] = useState<admin>({
      _id: props.adminDetails._id,
      customId: props.adminDetails.customId,
      name: props.adminDetails.name,
      email: props.adminDetails.email,
      telephone: props.adminDetails.telephone,
      address: props.adminDetails.address,
    });
  
  
    return (
      <Container>
        {/* profile Picture */}
        <Group position="center">
          <Avatar src={defaultUser} style={{ width: "100px", height: "100px" }} />
        </Group>
        {/* user Username and Email show under the profile picture */}
        <h3 style={{ textAlign: "center" }}>{data.name}</h3>
        <h6
          style={{ textAlign: "center", color: "GrayText", marginTop: "-10px" }}
        >
          <i>{data.email}</i>
        </h6>
        {/* input fields of user data */}
        <Stack p={20} mt={-10}>
          <TextInput
            label="Name"
            value={data.name}
            contentEditable={false}
            readOnly
          />
          <TextInput
            label="Email"
            value={data.email}
            contentEditable={false}
            readOnly
          />
          <TextInput
            label="Address"
            value={data.address}
            contentEditable={false}
            readOnly
          />
          <TextInput
            label="Mobile No."
            value={data.telephone}
            contentEditable={false}
            readOnly
          />
        </Stack>
      </Container>
    );
  };
  
  export default AttendanceProfileDrawer;
  