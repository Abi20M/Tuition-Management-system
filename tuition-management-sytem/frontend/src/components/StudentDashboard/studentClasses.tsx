import { Table } from '@mantine/core';

const StudentClasses = () =>{
    //   const rows =elements.map((element:any) => (
    //     <tr key={element.name}>
    //       <td>{element.position}</td>
    //       <td>{element.name}</td>
    //       <td>{element.symbol}</td>
    //       <td>{element.mass}</td>
    //     </tr>
    //   ));
    
      return (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Teacher</th>
              <th>Subject</th>
              <th>Day</th>
              <th>Venue</th>
            </tr>
          </thead>
          {/* <tbody>{rows}</tbody> */}
        </Table>
      );
    }



export default StudentClasses;