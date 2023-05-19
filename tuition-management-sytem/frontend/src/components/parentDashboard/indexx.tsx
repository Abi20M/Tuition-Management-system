import { Text, SimpleGrid, Paper, Group, Box, Modal,PasswordInput,Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
//import { useState } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import ParentAPI from "../../API/ParentAPI";
import { Line } from "react-chartjs-2";

import { IconAlertTriangle, IconCheck } from "@tabler/icons";

//Line graph and password change model
// export const  LineGraph = () =>{
//     const [data, setData] = useState({
       
//     })
//     return(

//     );
// }

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );
  
  interface RowDataClasses {
    id: string;
    name: string;
    description: string;
    teacher: string;
    subject: string;
    date: string;
    time: string;
    duration: string;
    students: [];
  }
  
  interface RowDataStudents {
    id: string;
    name: string;
    email: string;
    phone: string;
    school: string;
    grade: string;
    birthDate: string;
    address: string;
    gender: string;
    parent: string;
  }
  
 
  
  //Get stored parnet Details
  const parent = JSON.parse(localStorage.getItem("parent") || "{}");
  
  export const options = {
    responsive: true,
    plugins: {
      //Dont show the legend
      legend: {
        display: false,
      },
    },
    scales: {
      xAxes: {
        title: {
          display: true,
          text: "Results",
        },
      },
      yAxes: {
        title: {
          display: true,
          text: "No Of Students",
        },
      },
    },
  };
  
  export const options2 = {
    responsive: true,
    plugins: {
      //Dont show the legend
      legend: {
        display: false,
      },
    },
    scales: {
      xAxes: {
        title: {
          display: true,
          text: "Grades",
        },
      },
      yAxes: {
        title: {
          display: true,
          text: "No Of Students",
        },
      },
    },
  };
  
  const labels = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "F"];
  
  
  
  
    export const ParentOver = () => {
      const [classes, setClasses] = useState(0);
      const [students, setStudents] = useState(0);
      const [subjects, setSubjects] = useState([]);
     // const [examData, setExamData] = useState(examResultsData1);
      const [openedPasswordModal, setOpenedPasswordModal] = useState(false);
      const [newPassword, setNewPassword] = useState("");
      const [error, setError] = useState(true);
      const [gradeDistributionData, setGradeDistributionData] = useState([
        0, 0, 0, 0, 0, 0, 0, 0,
      ]);
  
      useEffect(() => {
      if(parent.isChangedPassoword === false){
        setOpenedPasswordModal(true);
      }
      const fetchData = async () => {
        showNotification({
          id: "loding-data",
          loading: true,
          title: "Loading Parent Dashboard Data",
          message: "Please wait while we load the data",
          autoClose: true,
          disallowClose: false,
        });
  
       
  
        //create grade distribution data array - grade 6 to 13
        const gradeDisData = [0, 0, 0, 0, 0, 0, 0, 0];
       
        setGradeDistributionData(gradeDisData);
  
       
  
        let classCount = 0;
  
       
  
        setClasses(classCount);
  
        updateNotification({
          id: "loding-data",
          color: "teal",
          title: "Teacher Dashboard data loaded",
          message: "Teacher Dashboard data loaded successfully",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });
  
  
  
      };
      fetchData();
    }, []);
  
    

    //validate confirm parent password
    const validatePassword = (confirmPassword: string) => {
      if (confirmPassword.length != 0) {
        if (newPassword === confirmPassword) {
          setError(false);
          const error = document.getElementById("confirmPasswordError");
          if (error) error.innerHTML = "Password is match!";
        } else {
          setError(true);
          const error = document.getElementById("confirmPasswordError");
          if (error) error.innerHTML = "Password is not match!";
        }
      }
    };
  
    // Password Changing function
    const submitPassword = (values: {
      documentId: string;
      parentId: string;
      currentPassword: string;
      newPassword: string;
    }) => {
      showNotification({
        id: "update-password",
        title: "Changing password",
        message: "We are trying to update your password",
        loading: true,
      });
  
      ParentAPI.setNewPassword(values).then((res) => {
          setOpenedPasswordModal(false);
  
          updateNotification({
            id: "update-password",
            title: "Changed password",
            message: "We are updated your password",
            color: "teal",
            icon: <IconCheck />,
            autoClose: 3000,
          });
        })
        .catch((error) => {
          updateNotification({
            id: "update-password",
            title: "Error while changing password",
            message: "Check your current password or network connection",
            color: "red",
            icon: <IconAlertTriangle />,
          });
        });
    };
  
    // password changing modal
    const changePasswordForm = useForm({
      initialValues: {
        documentId: parent._id,
        parentId: parent.id,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    });
  
    return (
      <>
        {/* password chaging modal */}
        <Modal
          opened={openedPasswordModal}
          closeOnClickOutside={false}
          closeOnEscape={false}
          withCloseButton={false}
          onClose={() => {
            setOpenedPasswordModal(false);
          }}
          title={"Change Password for First Time"}
          centered
        >
          <form
            onSubmit={changePasswordForm.onSubmit((values) =>
              submitPassword(values)
            )}
          >
            <PasswordInput
              label="Current Password"
              withAsterisk
              placeholder="current password"
              {...changePasswordForm.getInputProps("currentPassword")}
              required
            />
            <PasswordInput
              label="New Password"
              withAsterisk
              placeholder="new password"
              {...changePasswordForm.getInputProps("newPassword")}
              onChange={(event) => {
                setNewPassword(event.target.value);
                changePasswordForm.setFieldValue(
                  "newPassword",
                  event.target.value
                );
              }}
              required
            />
            <PasswordInput
              label="Confirm Password"
              withAsterisk
              placeholder="confirm password"
              onChange={(event) => {
                changePasswordForm.setFieldValue(
                  "confirmPassword",
                  event.target.value
                );
                validatePassword(event.target.value);
              }}
              required
            />
            <p
              id="confirmPasswordError"
              style={{
                color: error === false ? "green" : "red",
                marginTop: "10px",
              }}
            ></p>
  
            <Button
              fullWidth
              mt={20}
              type="submit"
              disabled={error ? true : false}
            >
              Change Password
            </Button>
          </form>
        </Modal>
      </>
    );
  };


