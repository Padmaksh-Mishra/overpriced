// src/components/DataTable.tsx
import React from 'react';
import { Table } from 'react-bootstrap';

interface TableData {
  id: number;
  name: string;
  value: number;
}

interface DataTableProps {
  data: TableData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default DataTable;
