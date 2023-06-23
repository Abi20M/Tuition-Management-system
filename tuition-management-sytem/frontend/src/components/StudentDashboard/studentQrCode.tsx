import { Group, Paper, Tooltip } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import QRCODE from 'qrcode';
import { useState, useEffect } from "react";

const StudentQrCode = () => {
  //get logged in student details
  const student = JSON.parse(localStorage.getItem("student") || "");

  const [qrCode, setQrCode] = useState("");

  //generate QR function
  const generateQR = () => {
    QRCODE.toDataURL(student._id)
      .then((generatedQR) => {
        setQrCode(generatedQR);
      })
      .catch((error) => {
        showNotification({
          title: "QR Code Error!",
          message: "Something went wrong while generating QR Code",
          color: "red",
          icon: <IconX size={16} />,
          autoClose: 1200,
        });
      });
  };

  useEffect(() => {
    generateQR();
  });


  
  return (
    <>
      <center>
        <h1> Hi {student.name}! here is your qr code. Click to download.</h1>
      </center>
      <h1></h1>
      <Group position="center">
        {qrCode && (
          <Tooltip label="click to download">
            <Paper mt={10} shadow="xl">
              <a href={qrCode} download>
                <img
                  src={qrCode}
                  alt={`${student.name} QR Code`}
                  width={"200%"}
                  height={"200%"}
                />
              </a>
            </Paper>
          </Tooltip>
        )}
      </Group>
    </>
  );
};

export default StudentQrCode;
