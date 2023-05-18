import { Table, Group, Title, Paper, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { ClassAPI } from "../../API/classAPI";

const fetchHallSchedule = async () => {
  return await ClassAPI.getHallSchedule()
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

const HallSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    fetchHallSchedule()
      .then((data: any) => {
        setScheduleData(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <>
      <>
        <Group position="center" mb={10}>
          <Title order={3} size="h1">
            HLS-004
          </Title>
        </Group>
        <Paper p={20} shadow="xl" radius={"md"} mb={30}>
          <Table
            horizontalSpacing="xl"
            verticalSpacing="xl"
            withBorder
            withColumnBorders
          >
            <thead>
              <tr>
                <th>Time</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
                <th>Sunday</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((schedule: any) =>
                schedule.hallId === "HLS-004" && schedule.day === "Monday"
                  ? schedule.classes.map((classes: any) => (
                      <>
                        <tr>
                          <td>
                            <h4>
                              {new Date(classes.startTime).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: false,
                                }
                              )}
                            </h4>{" "}
                            <h4>
                              {" "}
                              {new Date(classes.endTime).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: false,
                                }
                              )}
                            </h4>
                          </td>
                          <td>
                            <h3>{classes.id}</h3>
                          </td>
                        </tr>
                      </>
                    ))
                  : schedule.hallId === "HLS-004" && schedule.day === "Tuesday"
                  ? schedule.classes.map((classes: any) => (
                      <>
                        <tr>
                          <td>
                            <h4>
                              {new Date(classes.startTime).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: false,
                                }
                              )}
                            </h4>{" "}
                            <h4>
                              {" "}
                              {new Date(classes.endTime).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: false,
                                }
                              )}
                            </h4>
                          </td>
                          <td>
                            <h3>{classes.id}</h3>
                          </td>
                        </tr>
                      </>
                    ))
                  : null
              )}
            </tbody>
          </Table>
        </Paper>
      </>
    </>
  );
};

export default HallSchedule;
