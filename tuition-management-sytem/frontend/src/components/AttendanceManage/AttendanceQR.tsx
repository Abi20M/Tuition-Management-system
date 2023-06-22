import QrReader from "react-qr-reader";
import { useEffect, useState } from "react";
import { Paper, Group, Card, Text, Badge } from "@mantine/core";
import QrHeader from "../AttendanceHeader/QrHeader";
import { Footer } from "..";
import { useSearchParams } from "react-router-dom";
import { ClassAPI } from "../../API/classAPI";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import AttendanceAPI from "../../API/attendaceAPI";


const getStudentDetailsByClassId = async(classId : string) =>{
  try{
    const Class = await AttendanceAPI.getStudentDetailsFromAttendance(classId);
    return Class.data;
  }catch(err){
    return err;
  }
}
const AttendanceQR = () => {
  document.title = "Attendance QR";

  const [qrData, setQrData] = useState("");
  const[students,setStdents] = useState([]);
  const[searchParams,setSearchParams] = useSearchParams();

  const webcamScan = (result: any) => {
    if (result) {
      setQrData(result);
    }
  };

  const webcamError = (error: any) => {
    if (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    const fetch = async(classID: string) =>{
      
      const classStudents = await getStudentDetailsByClassId(classID).catch((error)=>{
        showNotification({
          title : "Something went wrong!",
          message : "We were unable to fetch student Data",
          color: 'red',
          icon : <IconX/>,
          autoClose : 1200
        });
      });

      setStdents(classStudents);

    };

    fetch(searchParams.get("objectID")!!);
  },[])

  return (
    <>
      <QrHeader />
      <Card shadow="sm" p="lg" m={30} radius="md" withBorder>
        <Group position="apart" p={30}>
          <Badge size={"xl"}>{`Class Id : ${searchParams.get("classID")}`}</Badge>
          <Badge size={"xl"}>{`Class Name : ${searchParams.get("clsName")}`}</Badge>
          <Badge size={"xl"}>{`Time : ${searchParams.get("Time")}`}</Badge>
        </Group>
        <Group position="center">
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <center>
              <Text color="red" size={20} weight={500} pb={10}>
                SHOW YOUR QR CODE TO HERE
              </Text>
            </center>
            <QrReader
              delay={10}
              onError={webcamError}
              onScan={webcamScan}
              legacyMode={false}
              facingMode={"user"}
              style={{ width: "300px", height: "300px" }}
            />
          </Card>
        </Group>
        <p>{qrData && `WebCam : ${qrData}`}</p>
      </Card>
      <Footer/>
    </>
  );
};

export default AttendanceQR;
