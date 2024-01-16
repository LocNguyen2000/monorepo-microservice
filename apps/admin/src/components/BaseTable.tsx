import { Column } from "@ant-design/charts";
import { SettingTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Button, Flex, Popover, Skeleton, Table } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { ColumnGroupType, ColumnType, ColumnsType, TableProps } from "antd/es/table";
import { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";

export interface IBaseTableProps {
  columns: ColumnsType<any>;
  data: any[];
  isLoading?: boolean;
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
  isLoading,
  editable,
  onDblClickRow,
  onClickRow,
  onDeleteRow,
}) => {
  const withEditColumn = (columns: ColumnsType<any>) => {
    const editTableColumn: ColumnType<any> = {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (value, record) => {
        return (
          <Flex style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button style={{ alignItems: "center", justifyContent: "center", marginRight: "0.5rem" }}>
              <SettingTwoTone
                style={{
                  fontSize: "large",
                  cursor: "pointer",
                }}
                color="primary"
                title="Double click here to open information"
              />
            </Button>
            <Button
              style={{ alignItems: "center", justifyContent: "center", marginRight: "0.5rem" }}
              onClick={() => onDeleteRow(record)}
            >
              <DeleteTwoTone
                style={{
                  fontSize: "large",
                  cursor: "pointer",
                }}
                color="primary"
                title="Click here to delete information"
              />
            </Button>
          </Flex>
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
      {isLoading ? (
        <Skeleton active loading />
      ) : data.length > 0 ? (
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
