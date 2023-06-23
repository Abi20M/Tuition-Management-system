import QrReader from "react-qr-reader";
import { useEffect, useState } from "react";
import {
  Paper,
  Group,
  Card,
  Text,
  Badge,
  createStyles,
  Table,
  ScrollArea,
  Avatar,
  Alert,
  Button,
} from "@mantine/core";
import QrHeader from "../AttendanceHeader/QrHeader";
import { Footer } from "..";
import { useSearchParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons";
import AttendanceAPI from "../../API/attendaceAPI";
import beep from "../../assets/sounds/scanner_beep_sound.mp3";
import qrBackground from "../../assets/qrBackground_30.png";
import { openConfirmModal } from "@mantine/modals";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `10px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

const getStudentDetailsByClassId = async (classId: string) => {
  try {
    const Class = await AttendanceAPI.getStudentDetailsFromAttendance(classId);
    return Class.data;
  } catch (err) {
    return err;
  }
};

interface MarkedStudents {
  studentId: string;
  id: string;
  studentName: string;
  Attendance: [];
  status: string;
}
const AttendanceQR = () => {
  document.title = "Attendance QR";

  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [qrData, setQrData] = useState("");
  const [students, setStdents] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [markedStudents, setMarkedStudents] = useState<MarkedStudents[]>([]);

  const HasNotAlreadyMarked = (studentId: string) => {
    if (markedStudents.length == 0) {
      return true;
    } else {
      let count = 0;
      markedStudents.map((student: any) => {
        if (student.studentId === studentId) {
          count++;
        }
      });

      if (count === 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  const calculateWeek = () => {
    const d = new Date();
    const date = d.getDate();

    if (date >= 1 && date <= 7) {
      return 0;
    } else if (date > 7 && date <= 14) {
      return 1;
    } else if (date > 14 && date <= 21) {
      return 2;
    } else {
      return 3;
    }
  };

  //audio function
  const playAudio = () => {
    const audioPlay = new Audio(beep);

    audioPlay.play();
  };

  const webcamScan = (result: any) => {
    let isRegistered = false;

    if (result) {
      setQrData(result);

      students.map((student: any) => {
        if (student.studentId._id === result) {
          if (HasNotAlreadyMarked(student.studentId._id)) {
            const week = calculateWeek();
            const attendance = student.Attendance;
            attendance[week] = 1; //access the attendance array and flip the 0 in to 1 accoding to the week of the month

            const markedAttendance = {
              studentId: student.studentId._id,
              id: student.studentId.id,
              studentName: student.studentId.name,
              Attendance: attendance,
              status: student.studentId.status,
            };

            //push to the marked students into the array
            setMarkedStudents((current) => [...current, markedAttendance]);

            //play sound
            playAudio();

            //set isRegistered Variable to true
            isRegistered = true;

          } else {
            //set isRegistered Variable to true
            isRegistered = true;
          }
        }
      });

      if (!isRegistered) {
        //if the student is not registered into the class, Then this Notification will be appeared on the display
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Not Registered!"
          color="red"
          withCloseButton
        >
          I think you are not registered into this class. Please check your time
          table!
        </Alert>;
      }
    }
  };

  const webcamError = (error: any) => {
    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetch = async (classID: string) => {
      const classStudents = await getStudentDetailsByClassId(classID).catch(
        (error) => {
          showNotification({
            title: "Something went wrong!",
            message: "We were unable to fetch student Data",
            color: "red",
            icon: <IconX />,
            autoClose: 1200,
          });
        }
      );

      setStdents(classStudents);
    };

    fetch(searchParams.get("objectID")!!);
  }, []);

  //remake attendance array using Icons
  const attendanceArray = (row: MarkedStudents) => {
    const newAttendanceArray = row.Attendance.map((attend) => {
      if (attend === 0) {
        return <IconX size={25} color="red" />;
      } else {
        return <IconCheck size={25} color="teal" />;
      }
    });
    return newAttendanceArray;
  };

  //print Table data
  const rows = markedStudents.map((row) => (
    <tr key={row.id}>
      <td>
        <Avatar color="cyan" radius="xl">
          {row.studentName.slice(0, 2).toUpperCase()}
        </Avatar>
      </td>
      <td>
        {
          <Text size={"sm"} weight={500}>
            {row.id}
          </Text>
        }
      </td>
      <td>{row.studentName}</td>
      <td>{attendanceArray(row)}</td>
      <td>
        {row.status.toLowerCase() === "not-paid" ? (
          <Badge color="orange" size="lg">
            Not-Paid
          </Badge>
        ) : (
          <Badge color="teal" size="lg">
            Paid
          </Badge>
        )}
      </td>
    </tr>
  ));

  // Attendance Confirm Modal
  const openAttendanceConfirmModal = () =>
    openConfirmModal({
      title: "Please confirm your action",
      centered: true,
      children: (
        <Text
          size={"sm"}
          weight={300}
        >{`Do you want to submit attendance of the ${searchParams.get(
          "clsName"
        )}? Remember, this action cannot be reversed!`}</Text>
      ),
      confirmProps: { color: "red" },
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => {
        //this executes when Attendance manager clicks the confirm button

        //extract presented students IDs
        const presentStudents = markedStudents.map((student) => {
          return student.studentId;
        });

        const attendanceDetails = {
          classId: `${searchParams.get("objectID")}`,
          week: calculateWeek(),
          students: JSON.stringify(presentStudents),
        };

        // submit attendance
        AttendanceAPI.submitAttendance(attendanceDetails)
          .then((result) => {
            showNotification({
              title: "Attendance Submitted Successfully!",
              message: "Student attendances were submmited successfully",
              color: "teal",
              icon: <IconCheck />,
            });

            setTimeout(()=>//close the window i  three miniutes
            window.close(),2000);
          })
          .catch((error) => {
            showNotification({
              title: "Something went Wrong!",
              message: "There was an error while submitting attendances",
              color: "red",
              icon: <IconX />,
            });
          });
      },
    });

  return (
    <>
      <QrHeader />
      <Card
        shadow="sm"
        m={30}
        radius="md"
        withBorder
        style={{
          backgroundImage: `url(${qrBackground})`,
          backgroundSize: "cover",
        }}
      >
        <Card.Section inheritPadding>
          <Group position="apart" p={10}>
            <Badge size={"xl"}>{`Class Id : ${searchParams.get(
              "classID"
            )}`}</Badge>
            <Badge size={"xl"}>{`Class Name : ${searchParams.get(
              "clsName"
            )}`}</Badge>
            <Badge size={"xl"}>{`Time : ${searchParams.get("Time")}`}</Badge>
          </Group>
        </Card.Section>
        <Card.Section p={30}>
          <Group position="center">
            <Card
              shadow="xl"
              p="lg"
              radius="md"
              withBorder
              style={{ borderColor: "black", borderWidth: 2 }}
            >
              <center>
                <Text color="red" size={20} weight={500} pb={10}>
                  SHOW YOUR QR CODE TO HERE
                </Text>
              </center>
              <QrReader
                delay={800}
                onError={webcamError}
                onScan={webcamScan}
                legacyMode={false}
                facingMode={"user"}
                style={{ width: "300px", height: "300px" }}
              />
            </Card>
          </Group>
        </Card.Section>
      </Card>
      <Group position="right">
        <Text
          size={20}
          weight={500}
        >{`${markedStudents.length} / ${students.length} Marked`}</Text>
        <Button
          variant="filled"
          color="teal"
          mr={30}
          onClick={openAttendanceConfirmModal}
        >
          Submit Attendance
        </Button>
      </Group>
      <ScrollArea
        h={250}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table
          verticalSpacing={"sm"}
          horizontalSpacing={"sm"}
          highlightOnHover
          striped
          withBorder
          withColumnBorders
          captionSide="top"
        >
          <caption>Attendance marked students</caption>
          <thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <tr>
              <th style={{ width: "20px" }}></th>
              <th style={{ textAlign: "center" }}>Student ID</th>
              <th style={{ textAlign: "center" }}>Name</th>
              <th style={{ textAlign: "center" }}>Attendance</th>
              <th style={{ textAlign: "center" }}>Fees</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>{rows}</tbody>
        </Table>
      </ScrollArea>
      <Footer />
    </>
  );
};

export default AttendanceQR;
