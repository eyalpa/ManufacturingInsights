import React, { useEffect, useRef, useState } from 'react';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css';
import $ from 'jquery';
window.jQuery = $;
require('datatables.net');
import 'datatables.net-bs4';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.js'; // HTML5 export buttons
import 'datatables.net-buttons/js/buttons.colVis.js'; // Column visibility buttons
import 'datatables.net-buttons-bs4';
import DateComponent from '../DateComponent'
import dateMath from '@elastic/datemath';
import DataController from '../../controllers/DataController';
import ChartComponent from '../../components/ChartComponent';

import _ from 'lodash'

const DataComponent = ({ }) => {
  const PNRef = useRef(null);
  const TEST_TYPERef = useRef(null);
  const PASSRef = useRef(null);
  const TEST_DATERef = useRef({ start: 0, end: (new Date() + 0) });
  const tableRef = useRef(null);
  const [tableData, setTableData] = useState(null); // Add this line


  const setDateState = (start, end) => {
    const startMoment = dateMath.parse(start);
    const endMoment = dateMath.parse(end, { roundUp: true });

    if (!startMoment || !startMoment.isValid()) {
      throw new Error('Unable to parse start string');
    }

    if (!endMoment || !endMoment.isValid()) {
      throw new Error('Unable to parse end string');
    }

    TEST_DATERef.current = {
      start: startMoment.toISOString(),
      end: endMoment.toISOString()
    };
  };

  const handleChildStateChange = (start, end) => {
    setDateState(start, end);
    tableRef.current.draw();
  };
  const columns = [
    {
      title: 'PN',
      data: 'PN',
      filterElement: <input type="text" ref={PNRef} placeholder="Filter by PN" />
    },
    {
      title: 'TEST_TYPE',
      data: 'TEST_TYPE',
      filterElement: <input ref={TEST_TYPERef} type="text" placeholder="Filter by TEST_TYPE" />
    },
    {
      title: 'PASS',
      data: 'PASS',
      filterElement: (
        <select ref={PASSRef}>
          <option value="">All</option>
          <option value="1">Passed</option>
          <option value="0">Failed</option>
        </select>
      )
    },
    {
      title: 'TEST_DATE',
      data: 'TEST_DATE',
      filterElement: <DateComponent updateTable={handleChildStateChange} />
    }
  ];
  const addFilters = (reqdata) => {
    reqdata.filters = {};
    if (!_.isEmpty(PNRef.current.value)) {
      reqdata.filters.PN = PNRef.current.value;
    }

    if (!_.isEmpty(TEST_TYPERef.current.value)) {
      reqdata.filters.TEST_TYPE = TEST_TYPERef.current.value;
    }

    if (!_.isEmpty(PASSRef.current.value)) {
      reqdata.filters.PASS = PASSRef.current.value;
    }

    if (TEST_DATERef.current.start && TEST_DATERef.current.end) {
      reqdata.filters.TEST_DATE = TEST_DATERef.current;
    } else {
      reqdata.filters.TEST_DATE = { start: 0, end: new Date().toISOString() };
    }
  }

  useEffect(() => {
    $('#data-table').DataTable().clear().destroy();
    tableRef.current = $('#data-table').DataTable({
      responsive: true,
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      paging: true,
      destroy: true,
      searching: false,
      lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'All']],
      ajax: {
        url: DataController.getURL("/api/manufacturing-data"),
        method: "POST",
        data: (reqdata) => {
          return addFilters(reqdata);
        },
        dataSrc: (data) => {
          setTableData(data.yield);  // Update the state here
          return data.data;
        }
      },
      dom: 'Blrtip',
      buttons: [
        {
          extend: 'copy',
          text: 'Copy to Clipboard',
          exportOptions: {
            modifier: {
              search: 'applied',
              order: 'applied'
            }
          }
        },
        {
          text: 'Export to Excel',
          action: async function (e, dt, button, config) {
            const body = {};
            addFilters(body);
            await DataController.fetchData('api/DownloadExcel', body);
          }
        },
        {
          text: 'Export to BSON',
          action: async function (e, dt, button, config) {
            const body = {};
            addFilters(body);
            await DataController.fetchData('api/DownloadBson', body);
          }
        }
      ],
      columns
    });

    [PNRef, TEST_TYPERef, PASSRef].forEach(ref => {
      if (ref.current.tagName === 'INPUT' || ref.current.tagName === 'SELECT') {
        $(ref.current).on('change', () => {
          tableRef.current.draw();
        });
      }
    });
  }, []);

  return (
    <div>
      <ChartComponent data={tableData} />
      <div>
        <div className="filters">
          {columns.map(column => (
            <div key={column.title}>{column.filterElement}</div>
          ))}
        </div>
        <table id="data-table">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.title}>{column.title}</th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default DataComponent;
