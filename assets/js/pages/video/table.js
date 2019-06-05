import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ReactTable from 'react-table'
import checkboxHOC from 'react-table/lib/hoc/selectTable'
import TimeAgo from 'react-timeago'
import matchSorter from 'match-sorter'
import { Icon } from '../../components'
import { videoOperations as Video, videoSelectors } from '../../modules/video'

let checkboxTable;
const CheckboxTable = checkboxHOC(ReactTable);

const VideoTable = ({
    isAuthentificated,
    redirect,
    selectAll,
    selection,
    updateState,
    updateVideos,
    videos,
    ...tableProps
  }) => {

  const columns = [
    {
      // NOTE - this is a "filter all" DUMMY column
      // you can't HIDE it because then it wont FILTER
      // but it has a size of ZERO with no RESIZE and the
      // FILTER component is NULL (it adds a little to the front)
      // You culd possibly move it to the end
      Header: 'All',
      headerStyle: { padding: '0px' },
      id: 'all',
      width: 0,
      resizable: false,
      sortable: false,
      Filter: () => {},
      filterMethod: (filter, rows) => {
        // using match-sorter
        // it will take the content entered into the "filter"
        // and search for it in either of the keys
        const result = matchSorter(rows, filter.value, {
          keys: ['title'],
          threshold: matchSorter.rankings.WORD_STARTS_WITH
        });
        return result;
      },
      filterAll: true
    },
    {
      accessor: 'youtubeID',
      Cell: row => (
        <a href={`https://www.youtube.com/watch?v=${row.value}`} target="_blank">
          <Icon fab youtube />
        </a>
      ),
      className: 'text-center d-none d-sm-table-cell',
      Header: <Icon fab youtube />,
      headerClassName: 'text-center d-none d-sm-table-cell',
      resizable: false,
      width: 30
    },
    {
      accessor: 'title',
      Header: 'Title',
      minWidth: 200
    },
    {
      accessor: 'id',
      Cell: row => (
        <Link to={`/simulation/`+ row.value}>
          <Icon fas video /> Simulation
        </Link>
      ),
      className: 'text-center',
      Header: 'Simulation',
      headerClassName: 'text-center'
    },
    {
      accessor: 'id',
      Cell: row => (
        <Link to={`/videos/`+ row.value}>
          <Icon fas video /> Comparison
        </Link>
      ),
      className: 'text-center',
      Header: 'Comparision',
      headerClassName: 'text-center'
    },
    {
      accessor: 'markers',
      className: 'text-center d-none d-sm-table-cell',
      Header: 'Markers',
      headerClassName: 'text-center d-none d-sm-table-cell',
      maxWidth: 90
    },
    {
      accessor: 'inserted_at',
      className: 'text-center d-none d-md-table-cell',
      Cell: row => <TimeAgo date={row.value} />,
      Header: 'Created',
      headerClassName: 'text-center d-none d-md-table-cell',
      maxWidth: 200
    },
    {
      accessor: 'id',
      Cell: row => (
        <a
          href={`/export/csv/${row.value}`}
          target="_blank"
          title="Export CSV"
        >
          <Icon far file-code />
        </a>
      ),
      className: 'text-center d-none d-md-table-cell',
      Header: <Icon fa file-code title="Export CSV" />,
      headerClassName: 'text-center d-none d-md-table-cell',
      resizable: false,
      sortable: false,
      width: 30
    },
    {
      accessor: 'id',
      Cell: row => (
        <a
          href={`/export/eclipse/${row.value}`}
          target="_blank"
          title="Export for Eclipse"
        >
          <Icon far file-code />
        </a>
      ),
      className: 'text-center d-none d-md-table-cell',
      Header: <Icon fa file-code title="Export for Eclipse" />,
      headerClassName: 'text-center d-none d-md-table-cell',
      resizable: false,
      sortable: false,
      width: 30
    }
  ];

  function isSelected(key) {
    /*
      Instead of passing our external selection state we provide an 'isSelected'
      callback and detect the selection state ourselves. This allows any implementation
      for selection (either an array, object keys, or even a Javascript Set object).
    */
    return selection.includes(key);
  }

  function toggleAll() {
    /*
      'toggleAll' is a tricky concept with any filterable table
      do you just select ALL the records that are in your data?
      OR
      do you only select ALL the records that are in the current filtered data?

      The latter makes more sense because 'selection' is a visual thing for the user.
      This is especially true if you are going to implement a set of external functions
      that act on the selected information (you would not want to DELETE the wrong thing!).

      So, to that end, access to the internals of ReactTable are required to get what is
      currently visible in the table (either on the current page or any other page).

      The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
      ReactTable and then get the internal state and the 'sortedData'.
      That can then be iterrated to get all the currently visible records and set
      the selection state.
    */
    const selected = [];
    if (!selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach(item => {
        selected.push(item._original.id);
      });
    }
    updateState({ selectAll: !selectAll, selection: selected });
  }

  function toggleSelection(key, shift, row) {
    // start off with the existing state
    let selected = [...selection];
    const keyIndex = selected.indexOf(key);
    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selected = [
        ...selected.slice(0, keyIndex),
        ...selected.slice(keyIndex + 1)
      ];
    } else {
      // it does not exist so add it
      selected.push(key);
    }
    // update the parent state
    updateState({ selection: selected });
  }

  return (
    <CheckboxTable
      columns={columns}
      data={videos}
      defaultFilterMethod={(filter, row) =>
        String(row[filter.id]) === filter.value
      }
      defaultPageSize={1000}
      defaultSorted={[{ id: 'inserted_at', desc: true }]}
      isSelected={key => isSelected(key)}
      keyField="id"
      minRows={0}
      ref={r => (checkboxTable = r)}
      selection={selection}
      selectAll={selectAll}
      selectType="checkbox"
      showPagination={false}
      toggleAll={toggleAll}
      toggleSelection={toggleSelection}
      {...tableProps}
    />
  );
};

const mapStateToProps = store => ({
  isAuthentificated: !!store.session.currentUser,
  videos: videoSelectors.listAll(store.videos)
});

const mapDispatchToProps = {
  updateVideos: Video._updateAll
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoTable);
