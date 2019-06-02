import HandleTableUtil from './TableHandle';

export const columnsChangeLog = [{
    dataField: 'desc',
    text: 'Description',
    style: { fontSize:'14px' },
    formatter: (cell, row) => {
      return cell.replace(/<(?:.|\n)*?>/gm, '')
    },
    headerStyle: (colum, colIndex) => {
        return { width: '55%', textAlign: 'left', };
        }
  }, {
    dataField: 'type',
    text: 'Type',
    style: { fontSize:'14px' },
    formatter: (cell, row) => {
      return row.type === 'front' ? 'Apps' : 'Back office'
    },
    headerStyle: (colum, colIndex) => {
        return { width: '15%', textAlign: 'left', };
        }
  }, {
    dataField: 'dates',
    text: 'Date',
    style: { fontSize:'14px' },
    headerStyle: (colum, colIndex) => {
        return { width: '20%', textAlign: 'left', };
        }
  }, {
    dataField: 'action',
    text: 'Action',
    style: { fontSize:'14px' },
    formatter: HandleTableUtil.buttonAction,
    headerStyle: (colum, colIndex) => ({ width: '10%', textAlign: 'center' }),
  }]

export const columnsPermission = [{
    dataField: 'username',
    text: 'Username',
    classes: 'cell-columns',
    style: { fontSize:'14px' },
    headerStyle: (colum, colIndex) => ({ width: '20%', textAlign: 'left' }),
  }, {
    dataField: 'phone',
    text: 'Phone',
    style: { fontSize:'14px' },
    headerStyle: (colum, colIndex) => ({ width: '20%', textAlign: 'left' }),
  }, {
    dataField: 'email',
    text: 'Email',
    style: { fontSize:'14px' },
    headerStyle: (colum, colIndex) => ({ width: '25%', textAlign: 'left' }),
  }, {
    dataField: 'action',
    text: 'Action',
    formatter: HandleTableUtil.buttonAction,
    headerStyle: (colum, colIndex) => ({ width: '10%', textAlign: 'center' }),
    align: 'center',
  }]