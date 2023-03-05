import { Fragment, FunctionComponent, useEffect, useState } from "react";
import  {Breadcrumb, Divider, Table} from 'antd'
import type { ColumnsType } from 'antd/es/table';
import { userClient } from "../clients";

interface EmployeeTablesProps {
    
}
 

interface EmployeeDataType {
    key: React.Key;
    employeeCode: number;
    firstName?: string;
    lastName?: string;
    employeeName?: string;
    role?: string;
    dateOfBirth?: Date;
    genderName?: string;
    phoneNumber?: string;
    email?: string;
    contactAdress?: string;
  }
  
  const columns: ColumnsType<EmployeeDataType> = [
    {
      title: 'Employee Code',
      dataIndex: 'employeeCode',
      key: 'employeeCode'
    },
    {
      title: 'Name',
      dataIndex: 'employeeName',
      key: 'employeeName'
  
    },
    {
      title: 'Job Title',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: 'DOB',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth'
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    }
  
  ]

const EmployeeTables: FunctionComponent<EmployeeTablesProps> = () => {
  const [employees, setEmployees] = useState<EmployeeDataType[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await userClient.getFilterEmployees()
      if (data) setEmployees(data.data)
    } 
    fetchData()
  }, [])


    return ( 
        <Fragment>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Employees</Breadcrumb.Item>
            </Breadcrumb>
                
            <Divider/>

            <Table
              style={{marginRight: '16px'}}
              columns={columns}
              dataSource={employees}
              showSorterTooltip={true}
            />
        </Fragment>

     );
}
 
export default EmployeeTables;