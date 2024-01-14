import { SettingTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Popover, Table } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { ColumnsType, TableProps } from "antd/es/table";
import { FunctionComponent } from "react";
import styled from "styled-components";

export interface IBaseTableProps {
  columns: ColumnsType<any>;
  data: any[];
  editable?: boolean;
  onDblClickRow?: (data: any) => void;
  onClickRow?: (data: any) => void;
}

const StyledTable = styled((props: React.PropsWithChildren<TableProps<AnyObject>>) => <Table {...props} />)`
  && thead > tr > th {
    background-color: #a1a3a6;
  }
  && tbody > tr:hover > td {
    cursor: pointer;
  }
`;

const BaseTable: FunctionComponent<IBaseTableProps> = ({ columns, data, editable, onDblClickRow, onClickRow }) => {
  const withEditColumn = (columns: ColumnsType<any>) => {
    const editTableColumn = {
      title: "Action",
      dataIndex: "action",
      render: () => {
        return (
          <>
            <Popover placement="topLeft" title={"HELLO"} content="Here's pop up Text" trigger="click">
              <SettingTwoTone
                style={{
                  marginRight: "0.5rem",
                  fontSize: "large",
                  cursor: "pointer",
                }}
                color="primary"
                title="Double click here to open information"
              />
            </Popover>
            <DeleteTwoTone
              style={{
                marginRight: "0.5rem",
                fontSize: "large",
                cursor: "pointer",
              }}
              color="primary"
              title="Click here to delete information"
            />
          </>
        ) as unknown as ColumnsType<any>;
      },
    };
    return [...columns, editTableColumn];
  };

  const addEventHandler = (data) => {
    let event: Record<string, unknown> = {};
    if (onDblClickRow) event.onDoubleClick = () => onDblClickRow(data);
    if (onClickRow) event.onClick = () => onClickRow(data);

    return event;
  };

  return (
    <>
      {data.length > 0 ? (
        <StyledTable
          style={{ marginRight: "16px" }}
          columns={editable ? withEditColumn(columns) : columns}
          dataSource={data}
          showSorterTooltip={true}
          bordered
          onRow={(data) => addEventHandler(data)}
          pagination={false}
        />
      ) : (
        <StyledTable
          style={{ marginRight: "16px" }}
          columns={editable ? withEditColumn(columns) : columns}
          showSorterTooltip={true}
          bordered
        />
      )}
    </>
  );
};

export default BaseTable;
