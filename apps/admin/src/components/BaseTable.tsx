import { SettingTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Popover, Table } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { ColumnGroupType, ColumnType, ColumnsType, TableProps } from "antd/es/table";
import { FunctionComponent, useState } from "react";
import styled from "styled-components";

export interface IBaseTableProps {
  columns: ColumnsType<any>;
  data: any[];
  editable?: boolean;
  onDblClickRow?: (data: any) => void;
  onClickRow?: (data: any) => void;
  onDeleteRow?: (data: any) => void;
}

const StyledTable = styled((props: React.PropsWithChildren<TableProps<AnyObject>>) => <Table {...props} />)`
  && thead > tr > th {
    background-color: #a1a3a6;
  }
  && tbody > tr:hover > td {
    cursor: pointer;
  }
`;

const BaseTable: FunctionComponent<IBaseTableProps> = ({
  columns,
  data,
  editable,
  onDblClickRow,
  onClickRow,
  onDeleteRow,
}) => {
  const withEditColumn = (columns: ColumnsType<any>) => {
    const editTableColumn: ColumnType<any> = {
      title: "Action",
      dataIndex: "action",
      render: (value, record) => {
        return (
          <>
            <Popover placement="topLeft" content="Here's pop up Text" trigger="click">
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
              onClick={() => onDeleteRow(record)}
            />
          </>
        ) as unknown as ColumnsType<any>;
      },
    };
    return [...columns, editTableColumn];
  };

  const addRowEventHandler = (data) => {
    let e: Record<string, unknown> = {};
    if (onDblClickRow) e.onDoubleClick = () => onDblClickRow(data);
    if (onClickRow) e.onClick = () => onClickRow(data);

    return e;
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
          onRow={(data) => addRowEventHandler(data)}
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
