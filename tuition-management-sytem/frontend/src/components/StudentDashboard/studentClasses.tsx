import { Table, useMantineTheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import StudentAPI from '../../API/studentAPI';
import { showNotification } from '@mantine/notifications';

const StudentClasses = () =>{
  const[classData,setClassData] = useState([{}]);
  const theme = useMantineTheme();
    //   const rows =elements.map((element:any) => (
    //     <tr key={element.name}>
    //       <td>{element.position}</td>
    //       <td>{element.name}</td>
    //       <td>{element.symbol}</td>
    //       <td>{element.mass}</td>
    //     </tr>
    //   ));
    
    useEffect(() => {

      StudentAPI.getClassesByStudentId().then((data)=>{
        setClassData(data.data);
      }).catch((erorr)=>{
        showNotification({
          id:'fetch-classes',
          title : "Something went wrong!",
          message : "There is an error while fetching class details"
        });
      })
    },[])
    
      const rows = classData.map((row:any)=>(
        <tr key={row._id}>
          <td>{row.id}</td>
          <td>{row.name}</td>
          <td>{row.teacher}</td>
          <td>{row.subject}</td>
          <td>{row.day}</td>
          <td>{new Date(row.startTime).toLocaleTimeString('en-US',{hour:"numeric",minute:"numeric",hour12:true})}</td>
          <td>{new Date(row.endTime).toLocaleTimeString('en-US',{hour:"numeric",minute:"numeric",hour12:true})}</td>
          <td>{row.venue}</td>
        </tr>
      ))
      return (
        <Table mt={50} highlightOnHover withBorder withColumnBorders horizontalSpacing="md" verticalSpacing="md" fontSize="md" mb={190}>
          <thead style={{backgroundColor:"#000000"}}>
            <tr>
              <th style={{color:theme.colorScheme ==='light' ? 'white' : 'white'}}>ID</th>
              <th style={{color:theme.colorScheme ==='light' ? 'white' : 'white'}}>Name</th>
              <th style={{color:theme.colorScheme ==='light' ? 'white' : 'white'}}>Teacher</th>
              <th style={{color:theme.colorScheme ==='light' ? 'white' : 'white'}}>Subject</th>
              <th style={{color:theme.colorScheme ==='light' ? 'white' : 'white'}}>Day</th>
              <th style={{color:theme.colorScheme ==='light' ? 'white' : 'white'}}>Start Time</th>
              <th style={{color:theme.colorScheme ==='light' ? 'white' : 'white'}}>End Time</th>
              <th style={{color:theme.colorScheme ==='light' ? 'white' : 'white'}}>Venue</th>
            </tr>
          </thead>
          <tbody>
              {rows}
            </tbody>
          {/* <tbody>{rows}</tbody> */}
        </Table>
      );
    }



export default StudentClasses;