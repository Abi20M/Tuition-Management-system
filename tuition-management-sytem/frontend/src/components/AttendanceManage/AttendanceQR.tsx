import QrReader from "react-qr-reader";
import { useState } from "react";
import { Paper, Group, Card, Text, Badge } from "@mantine/core";
import QrHeader from "../AttendanceHeader/QrHeader";
import { Footer } from "..";

const AttendanceQR = () => {
  document.title = "Attendance QR";

  const [qrData, setQrData] = useState("");

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

  return (
    <>
      <QrHeader />
      <Card shadow="sm" p="lg" m={30} radius="md" withBorder>
        <Group position="apart" p={30}>
          <Badge size={"xl"}>{`Class Id : CLS-001`}</Badge>
          <Badge size={"xl"}>{`Class Name : Vidura's class`}</Badge>
          <Badge size={"xl"}>{`Time : 5.00 - 12.00`}</Badge>
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
