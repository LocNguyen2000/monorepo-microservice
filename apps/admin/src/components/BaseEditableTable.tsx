import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { FunctionComponent } from "react";

export interface IBaseEditableTable {
  columns: ColumnsType<any>;
  data: any[];
}

const BaseEditableTable: FunctionComponent<IBaseEditableTable> = ({ columns, data }) => {
  return <Table></Table>;
};

export default BaseEditableTable;
