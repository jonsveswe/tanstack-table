import React, { FC } from "react";
import "./App.css";
import "./table.css";
import Table1Basic from "./Table1Basic";
import Table2ColumnGroups from "./Table2ColumnGroups";
import Table3Filters from "./Table3Filters";
import Table4MyFilters from "./Table4MyFilters";

const App: FC = () => {
  return (
    <div>
      <Table4MyFilters />
      {/*       <Table1Basic />
      <Table2ColumnGroups />
      <Table3Filters /> */}
    </div>
  );
};

export default App;
