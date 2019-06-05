import { connect } from 'react-redux';
import ReactTable from 'react-table';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import TimeAgo from 'react-timeago';
import matchSorter from 'match-sorter';
import Icon from '../../utils/icons';
import { deleteUsers, updateUsers } from '../../modules/userList';
import { showModal } from '../../modules/modal';
import { listAllUsers } from '../../ducks/selectors';

let checkboxTable;
const CheckboxTable = checkboxHOC(ReactTable);

const UserTable = ({
  deleteUsers,
  display,
  selectAll,
  selection,
  showModal,
  updateState,
  updateUsers,
  users,
  ...tableProps
}) => {

  const columns = [
    {
      // NOTE - this is a "filter all" DUMMY column
      // you can't HIDE it because then it wont FILTER
      // but it has a size of ZERO with no RESIZE and the
      // FILTER component is NULL (it adds a little to the front)
      // You could possibly move it to the end
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
          keys: ['name', 'email'],
          threshold: matchSorter.rankings.WORD_STARTS_WITH
        });
        return result;
      },
      filterAll: true
    },
    {
      accessor: 'admin',
      Cell: row => render_icon_admin(row),
      className: 'text-center',
      Header: <Icon fas user />,
      headerClassName: 'text-center',
      resizable: false,
      width: 30,
      show: !!display
    },
    {
      accessor: 'name',
      Header: 'Name'
    },
    {
      accessor: 'email',
      Header: 'Email'
    },
    {
      accessor: 'inserted_at',
      Cell: row => <TimeAgo date={row.value} />,
      Header: 'Member since',
      maxWidth: 200,
      show: display > 1
    },
    {
      accessor: 'blocked',
      className: 'text-center',
      Cell: row => render_icon_block(row),
      Header: <Icon fas lock />,
      headerClassName: 'text-center',
      resizable: false,
      show: !!display,
      width: 30
    },
    {
      accessor: 'id',
      className: 'text-center',
      Cell: row => (<Icon far trash-alt className='pointer text-danger' title='Delete'
        onClick={() => onDeleteClick(row.value)} />),
      Header: <Icon fa trash />,
      headerClassName: 'text-center',
      resizable: false,
      show: !!display,
      sortable: false,
      width: 30
    }
  ];

  /*
    Instead of passing our external selection state we provide an 'isSelected'
    callback and detect the selection state ourselves. This allows any implementation
    for selection (either an array, object keys, or even a Javascript Set object).
  */
  function isSelected(key) {
    return selection.includes(key);
  }

  function render_icon_admin (row) {
    const toggle = () => updateUsers([row.original.id], { admin: !row.value })
    return row.value
      ? <Icon fas user-plus className='pointer text-primary' title='Demote'
          onClick={toggle} />
      : <Icon fas user className='pointer' title='Promote' onClick={toggle} />
  }

  function render_icon_block(row) {
    return row.value
      ? <Icon fas lock className='pointer   text-danger' title='Block'
          onClick={() => updateUsers([row.original.id], {
            blocked_msg: null, blocked_at: null
          })}
        />
      : <Icon fas unlock-alt className='pointer text-muted' title='Unblock'
          onClick={() => showModal('block', { user_id: row.original.id })}
        />
  }

  function onDeleteClick(id){
    var r = confirm("Are you sure you want to delete this user?");
    if (r == true) deleteUsers([id])
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
      data={users}
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
  display: store.ui.display,
  users: listAllUsers(store)
})

const mapDispatchToProps = {
  deleteUsers, updateUsers, showModal
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTable);
