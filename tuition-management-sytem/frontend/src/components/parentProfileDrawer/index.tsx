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
  import ParentAPI from "../../API/ParentAPI";
  import { useForm } from "@mantine/form";
  
  interface parent {
    _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  }
  
  interface iProps {
    sidePannel: (value: boolean) => void;
    onStateChange: (newParent : parent) => void;
    parentDetails: {
        _id: string;
        id: string;
        name: string;
        email: string;
        phone: string;
    };
  }
  
  
  export const ParentDrawer = (props : iProps) => {
    const [openedPassword, setOpenedPassword] = useState(false);
    const { sidePannel } = props;
    const [editOpened, setEditOpened] = useState(false);
  
    const [data, setData] = useState<parent>({
      _id: props.parentDetails._id,
      id: props.parentDetails.id,
      name: props.parentDetails.name,
      email: props.parentDetails.email,
      phone:props.parentDetails.phone,
      
    });
  
    // useEffect(()=>{
    //   return () => {setOpenedPassword(true)};
    // },[sidePannel]);
  
    //edit admin form
    const editParent = async (values: {
        _id: string;
        id: string;
        name: string;
        email: string;
        phone: string;
    }) => {
      showNotification({
        id: "edit-parent",
        loading: true,
        title: "Updating parent of " + values.name,
        message: "Updating parent record..",
        autoClose: false,
        disallowClose: true,
      });
      ParentAPI
        .editParent(values)
        .then((response) => {
          updateNotification({
            id: "edit-parent",
            color: "teal",
            title: "parent record updated successfully",
            message: "Updated parent record of " + values.name,
            icon: <IconCheck size={16} />,
            autoClose: 5000,
          });
          editForm.reset();
          setEditOpened(false);
  
          const editedParentObj = {
            _id: values._id,
            id: values.id,
            name: values.name,
            email:values.email,
            phone: values.phone,
           
          }
  
          setData(editedParentObj);
          props.onStateChange(editedParentObj)
  
        })
        .catch((error) => {
          updateNotification({
            id: "edit-parent",
            color: "red",
            title: "Update failed",
            message: "We were unable to update parent data.",
            icon: <IconAlertTriangle size={16} />,
            autoClose: 5000,
          });
        });
    };
  
    //declare edit form
    const editForm = useForm({
      validateInputOnChange: true,
      initialValues: {
        _id: "",
        id: "",
        name: "",
        email:"",
        phone: "",
       
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
  
        phone: (value) =>
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
          title="Edit Parent"
        >
          <form onSubmit={editForm.onSubmit((values) => editParent(values))}>
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
              label="phone"
              placeholder="Enter telephone"
              {...editForm.getInputProps("telephone")}
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
            label="Mobile No."
            value={data.phone}
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
                _id: props.parentDetails._id,
                id: props.parentDetails.id,
                name: props.parentDetails.name,
                email: props.parentDetails.email,
                phone:props.parentDetails.phone,
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
  
  export default ParentDrawer;
  