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
  onStateChange: (newAdmin : admin) => void;
  adminDetails: {
    _id: string;
    customId: string;
    name: string;
    email: string;
    telephone: string;
    address: string;
  };
}


export const AdminDrawer = (props : iProps) => {
  const [openedPassword, setOpenedPassword] = useState(false);
  const { sidePannel } = props;
  const [editOpened, setEditOpened] = useState(false);

  const [data, setData] = useState<admin>({
    _id: props.adminDetails._id,
    customId: props.adminDetails.customId,
    name: props.adminDetails.name,
    email: props.adminDetails.email,
    telephone: props.adminDetails.telephone,
    address: props.adminDetails.address,
  });

  // useEffect(()=>{
  //   return () => {setOpenedPassword(true)};
  // },[sidePannel]);

  //edit admin form
  const editAdmin = async (values: {
    id: string;
    customId: string;
    name: string;
    email: string;
    telephone: string;
    address: string;
  }) => {
    showNotification({
      id: "edit-admin",
      loading: true,
      title: "Updating admin of " + values.name,
      message: "Updating admin record..",
      autoClose: false,
      disallowClose: true,
    });
    adminAPI
      .editAdmin(values)
      .then((response) => {
        updateNotification({
          id: "edit-admin",
          color: "teal",
          title: "admin record updated successfully",
          message: "Updated admin record of " + values.name,
          icon: <IconCheck size={16} />,
          autoClose: 5000,
        });
        editForm.reset();
        setEditOpened(false);

        const editedAdminObj = {
          _id: values.id,
          customId: values.customId,
          name: values.name,
          address: values.address,
          telephone: values.telephone,
          email: values.email,
        }

        setData(editedAdminObj);
        props.onStateChange(editedAdminObj)

      })
      .catch((error) => {
        updateNotification({
          id: "edit-admin",
          color: "red",
          title: "Update failed",
          message: "We were unable to update admin data.",
          icon: <IconAlertTriangle size={16} />,
          autoClose: 5000,
        });
      });
  };

  //declare edit form
  const editForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      id: "",
      customId: "",
      name: "",
      email: "",
      telephone: "",
      address: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? null
          : "Invalid email",

      telephone: (value) =>
        value.length != 10 ? "Telephone must have at least 10 numbers" : null,
    },
  });

  return (
    <Container>
      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          setEditOpened(false);
        }}
        title="Edit Administator"
      >
        <form onSubmit={editForm.onSubmit((values) => editAdmin(values))}>
          <TextInput
            label="ID"
            placeholder="Enter ID"
            disabled
            {...editForm.getInputProps("customId")}
            required
          />
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...editForm.getInputProps("name")}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            {...editForm.getInputProps("email")}
            required
          />

          <TextInput
            label="Telephone"
            placeholder="Enter telephone"
            {...editForm.getInputProps("telephone")}
            required
          />

          <TextInput
            label="Address"
            placeholder="Enter address"
            {...editForm.getInputProps("address")}
            required
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Save
          </Button>
        </form>
      </Modal>
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
          onClick={() => {
            editForm.setValues({
              id: props.adminDetails._id,
              customId: props.adminDetails.customId,
              name: props.adminDetails.name,
              email: props.adminDetails.email,
              telephone: props.adminDetails.telephone,
              address: props.adminDetails.address,
            });
            setEditOpened(true);
          }}
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
