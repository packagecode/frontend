import { Table, TableProps } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { ColumnsType } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useState } from "react";

interface DataType {
  key: string;
  [key: string]: any;
}

interface DynamicTableProps extends TableProps<DataType> {
  columns: ColumnsType<DataType>;
  dataSource: DataType[];
  selectionRow?: boolean;
  size?: SizeType;
  onSelectedRowsChange?: (
    selectedRowKeys: React.Key[],
    allSelected: boolean
  ) => void;
  // possible props to add
  // pagination: {current: 1,
  //   pageSize: 15,
  //   total: 0,
  //   position: ["bottomCenter"],
  //   showTotal: (total: number, range: [number, number]) => {
  //     return `Showing ${range[0]} to ${range[1]} of ${total} entries`;
  //   }
  // },
  //   bordered: true,
  //   loading,
  //   summary,
  //   title={() => 'Header'}
  // footer={() => 'Footer'}
}

const BaseTable: React.FC<DynamicTableProps> = React.memo(props => {
  const {
    columns,
    dataSource,
    selectionRow,
    scroll = { x: 1024 },
    size = "small",
    onSelectedRowsChange,
    ...restProps
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);

  const handleRowSelectionChange = (selectedKeys: React.Key[]) => {
    setAllSelected(false);
    setSelectedRowKeys(selectedKeys);
    if (onSelectedRowsChange) {
      onSelectedRowsChange(selectedKeys, allSelected);
    }
  };

  const rowSelectionConfig: TableRowSelection<DataType> | undefined =
    selectionRow
      ? {
          selectedRowKeys,
          onChange: handleRowSelectionChange,
          selections: [
            !allSelected && {
              key: "select-all-data",
              text: "Select all data",
              onSelect: () => {
                const allKeys = dataSource.map(item => item.key);
                setSelectedRowKeys(allKeys);
                setAllSelected(true);
                if (onSelectedRowsChange) {
                  onSelectedRowsChange(allKeys, allSelected);
                }
              }
            },
            Table.SELECTION_NONE
          ] as any, // Ensuring it matches INTERNAL_SELECTION_ITEM[]
          getCheckboxProps: record => ({
            disabled: record.disabled // Example: Use a disabled property on the record
          })
        }
      : undefined;

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowSelection={rowSelectionConfig}
      size={size}
      scroll={scroll}
      {...restProps}
    />
  );
});

export default React.memo(BaseTable);
