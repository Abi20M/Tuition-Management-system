import { showNotification, updateNotification } from "@mantine/notifications";
import { ClassAPI } from "../../API/classAPI";
import { useState, useEffect } from "react";
import { IconCalendar, IconCheck, IconSchool, IconX } from "@tabler/icons";
import { Title, Group, Paper, Text, Badge,Button  } from "@mantine/core";
import { IconCalendarCheck } from "@tabler/icons-react";
import {Link, useNavigate} from 'react-router-dom';

interface RowClass {
  _id: string;
  id: string;
  name: string;
  day: string;
  teacher: string;
  subject: string;
  startTime: string;
  endTime: string;
  students: [];
  venue: string;
}


const getTodayClasses = async () => {
  return await ClassAPI.getClassByDate()
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      return error;
    });
};

const MarkAttendence = () => {

  const [classes, setClasses] = useState<RowClass[]>([]);
  const [day, setDay] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetch = async () => {
      const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const date = new Date();
      const day = date.getDay();
      setDay(weekday[day]);

      showNotification({
        id: "while-fetching-classes",
        title: "Getting class details",
        message: "We are trying to fetch class details",
        loading: true,
        autoClose: false,
      });

      const classData = await getTodayClasses().catch((error) => {
        updateNotification({
          id: "while-fetching-classes",
          disallowClose: false,
          autoClose: 2000,
          title: "Something Went Wrong!",
          message: "There is an error while fetching class Data",
          color: "red",
          icon: <IconX />,
          loading: false,
        });
      });

      setClasses(classData);

      console.log(classes);

      updateNotification({
        id: "while-fetching-classes",
        disallowClose: false,
        autoClose: 2000,
        title: "Success",
        message: "Class data are fetched!",
        color: "teal",
        icon: <IconCheck />,
        loading: false,
      });
    };

    fetch();
  }, []);


  const handleClick = (classId : string,className : string, startTime : string, endTime : string, objectId : string) =>{

    let convertedStartTime = new Date(Date.parse(startTime)).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      });
    
      let converetedEndTime = new Date(Date.parse(endTime)).toLocaleTimeString('en-US',{
        hour:"numeric",
        minute : "numeric",
        hour12 : false
        
      })
    const timeRange = `${convertedStartTime}-${converetedEndTime}`;
    window.open(`/attendance/qr?classID=${classId}&clsName=${className}&Time=${timeRange}&objectID=${objectId}`);
  }

  return (
    <>
      <Group position="apart">
        <Title order={2}>
          <IconCalendar />
          {`   ${new Date().toLocaleDateString("en-GB")}`}
        </Title>
        <Title order={2}>
          <IconCalendarCheck />
          {`   ${day}`}
        </Title>
        <Title order={2}>
          <IconSchool />
          {`   Classes : ${classes.length}`}
        </Title>
      </Group>

      <Group position="center">
        {classes.map((item,_) => (
          <Paper shadow="md" w={400} h={265} p={20} mt={20}>
            <Group position="apart">
              <Text weight={800}>{item.name}</Text>
              <Badge size="lg" variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>
                {item.subject}
              </Badge>
            </Group>
            <Text  mt={15}><b>Class Id :</b> {item.id}</Text>
            <Text><b>Teacher : </b>{item.teacher}</Text>
            <Text><b>Start Time : </b>
              {new Date(Date.parse(item.startTime)).toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }
              )}
            </Text>
            <Text><b>
              End time :</b>
              {new Date(Date.parse(item.endTime)).toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }
              )}
            </Text>
            <Text><b>Venue : </b>{item.venue}</Text>
            <Group position="center">
                <Button variant="light" color="blue" fullWidth mt="lg" mb={"lg"} radius="md" onClick={() => handleClick(item.id,item.name,item.startTime,item.endTime,item._id)}>Mark Attendance</Button>
            </Group>
          </Paper>
        ))}
      </Group>
    </>
  );
};

export default MarkAttendence;
