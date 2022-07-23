import React, { FC, ChangeEvent } from "react";
import "./App.css";
import "./table.css";

import {
  Column,
  Table,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  FilterFn,
  ColumnDef,
  flexRender,
  Cell,
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";

//import { makeData, Person } from "./makeData";

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: string; //"relationship" | "complicated" | "single";
  subRows?: Person[];
};

/* declare module "@tanstack/table-core" {
  interface FilterMeta {
    itemRank: RankingInfo;
  }
} */
// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Person>> = {
  cell: function Cell({ getValue, row: { index }, column: { id }, table }) {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });
  console.log("itemRank");
  console.log(itemRank);
  // Return if the item should be filtered in/out
  return itemRank.passed;
};

function Table6MyFilterSortEdit() {
  const API_URL = "http://localhost:5000/persons";
  const rerender = React.useReducer(() => ({}), {})[1];

  const [globalFilter, setGlobalFilter] = React.useState("");
  /*   const [data, setData] = React.useState(() => {
    let array: Person[] = makeData(10);
    console.log(array);
    return array;
  }); */
  const [data, setData] = React.useState<Person[]>([]);
  //const refreshData = () => setData((old) => makeData(50));

  React.useEffect(() => {
    const fetchPersons = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error(response.statusText);
        const data = await response.json();
        setData(data);
      } catch (error: any) {
        console.log(error.message);
      } finally {
      }
    };
    //Simulate slow API
    setTimeout(() => {
      fetchPersons();
    }, 1000);
  }, []);

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "firstName",
        //cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        //cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: "fullName",
        header: "Full Name",
        //cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },

      {
        accessorKey: "age",
        header: () => "Age",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "visits",
        header: () => <span>Visits</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: function Cell({
          getValue,
          row: { index },
          column: { id },
          table,
        }) {
          const initialValue = getValue();
          // We need to keep and update the state of the cell normally
          const [value, setValue] = React.useState(initialValue);

          // When the input is blurred, we'll call our table meta's updateData function
          /*           const onBlur = () => {
            table.options.meta?.updateData(index, id, value);
          }; */

          // If the initialValue is changed external, sync it up with our state
          React.useEffect(() => {
            setValue(initialValue);
          }, [initialValue]);

          const handleOnChange = (
            event: React.ChangeEvent<HTMLSelectElement>
          ) => {
            setValue(event.target.value);
            table.options.meta?.updateData(index, id, event.target.value);
          };

          return (
            <>
              <select
                name="dog-names"
                id="dog-names"
                //defaultChecked = {initialValue as string}
                //onChange={(event) => setValue(event.target.value)}
                onChange={handleOnChange}
              >
                <option value={initialValue as string}>
                  {initialValue as string}
                </option>
                <option value="rigatoni">Rigatoni</option>
                <option value="dave">Dave</option>
                <option value="pumpernickel">Pumpernickel</option>
                <option value="reeses">Reeses</option>
              </select>
              <div>{value as string}</div>
            </>
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "progress",
        header: "Profile Progress",
        cell: function Cell({
          getValue,
          row: { index },
          column: { id },
          table,
        }) {
          const initialValue = getValue();
          // We need to keep and update the state of the cell normally
          const [value, setValue] = React.useState(initialValue);

          // When the input is blurred, we'll call our table meta's updateData function
          const onBlur = () => {
            table.options.meta?.updateData(index, id, value);
          };

          // If the initialValue is changed external, sync it up with our state
          React.useEffect(() => {
            setValue(initialValue);
          }, [initialValue]);

          return <div style={{ color: "red" }}>{value as string}</div>;
        },
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    enableGlobalFilter: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip age index reset until after next rerender
        //skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              let editedPerson = { ...old[rowIndex]!, [columnId]: value };
              //console.log(editedPerson);
              const updateOptions = {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(editedPerson),
              };
              console.log(editedPerson);
              const reqUrl = `${API_URL}/${editedPerson.id}`;
              fetch(reqUrl, updateOptions)
                .then((response) => response.json())
                .then((result) => {
                  console.log("Success:", result);
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
              return editedPerson;
            }
            return row;
          })
        );
      },
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div className="p-2">
      <div>
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search table..."
        />
      </div>
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      {/*       <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div> */}
      <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default Table6MyFilterSortEdit;
