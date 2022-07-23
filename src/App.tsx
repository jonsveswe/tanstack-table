import React, { FC } from "react";
import "./App.css";
import "./table.css";
import Table1Basic from "./Table1Basic";
import Table2ColumnGroups from "./Table2ColumnGroups";
import Table3Filters from "./Table3Filters";
import Table4MyFilters from "./Table4MyFilters";
import Table5Editable from "./Table5Editable";
import Table6MyFilterSortEdit from "./Table6MyFilterSortEdit";

const App: FC = () => {
  return (
    <div>
      <Table6MyFilterSortEdit />
      {/*<Table5Editable />
             <Table4MyFilters />
      <Table1Basic />
      <Table2ColumnGroups />
      <Table3Filters />  */}
    </div>
  );
};

export default App;
