import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filterFactory from 'react-bootstrap-table2-filter';
// import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Loader from 'react-loader-spinner';
// import { CSVLink, CSVDownload } from "react-csv";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/table.css';
import './css/searchfield.css';

const { SearchBar } = Search;
class Table extends React.Component{
  constructor(){
    super();
    this.state ={
      totalData: '',
    }
  }

  indication = () => {
      return (
        <div className='loader'>
          {/* <Loader
            type="ThreeDots"
            color="#17a2b8"
            height="50"	
            width="50"
          /> */}
          Table is Empty
        </div>   
      );
  }

  handleTableChange = (type, { filters }) => {
    setTimeout(() => {
      const products = this.props.dataColumns;
      const Comparator = '';
      const result = products.filter((row) => {
        let valid = true;
        for (const dataField in filters) {
          const { filterVal, filterType, comparator } = filters[dataField];

          if (filterType === 'TEXT') {
            if (comparator === Comparator.LIKE) {
              valid = row[dataField].toString().indexOf(filterVal) > -1;
            } else {
              valid = row[dataField] === filterVal;
            }
          }
          if (!valid) break;
        }
        return valid;
      });
      this.setState(() => ({
        data: result
      }));
    }, 2000);
  }
  
  notifyExport = () => toast.success(`${this.props.nameMenu}.csv Exported`, {
    className:"toastSucces"
  });

  render(){
    const MyExportCSV = (props) => {
      const handleClick = () => {
        setTimeout(() => props.onExport(), 500);
        setTimeout(() => this.notifyExport(), 1000);
      };
      return (
        <div className='exportCsvDiv'>
          <button className="buttonadd btn btn-secondary btn-sm exportCsv" onClick={ handleClick }>Export CSV</button>
        </div>
      );
    };
    const sizePerPageRenderer = ({
      options,
      currSizePerPage,
      onSizePerPageChange
    }) => (
      <div className="btn-group" role="group">
      {
        this.props.dataColumns.length > 0 ? <button
        key='10'
        type="button"
        onClick={() => onSizePerPageChange(10)}
        className={`btn ${currSizePerPage === `10` ? 'btn-primary' : 'btn-secondary'}`}
      >
        10
      </button> : ''
      }
      {
        this.props.dataColumns.length > 10 ? <button
        key='25'
        type="button"
        onClick={() => onSizePerPageChange(25)}
        className={`btn ${currSizePerPage === `25` ? 'btn-primary' : 'btn-secondary'}`}
      >
        25
      </button> : ''
      }
      {
        this.props.dataColumns.length > 25 ? <button
        key='30'
        type="button"
        onClick={() => onSizePerPageChange(30)}
        className={`btn ${currSizePerPage === `30` ? 'btn-primary' : 'btn-secondary'}`}
      >
        35
      </button> : ''
      }
      {
        this.props.dataColumns.length > 30 ? <button
        key='50'
        type="button"
        onClick={() => onSizePerPageChange(50)}
        className={`btn ${currSizePerPage === `50` ? 'btn-primary' : 'btn-secondary'}`}
      >
        50
      </button> : ''
      }
      </div>
    );
    const options = {
      sizePerPageRenderer,
    };
    return(
      <div>
        <ToolkitProvider
            keyField="id"
            data={this.props.dataColumns}
            columns={this.props.headerColumns}
            search
            exportCSV={ this.props.nameMenu === 'Member' ? {
              fileName: 'Member.csv',
              separator: '|',
              // ignoreHeader: true,
              noAutoBOM: false
            } : this.props.nameMenu === 'Investor' ? {
              fileName: 'Investor.csv',
              separator: '|',
              // ignoreHeader: true,
              noAutoBOM: false
            } : {
              fileName: 'Change Log.csv',
              separator: '|',
              // ignoreHeader: true,
              noAutoBOM: false
            }  }
            >
            {
                props => (
                  <div>
                    {this.props.searchField ? 
                    <div className='searchfield'>
                      <div className='searchbutton'> 
                        <i className="fa fa-search searchicon"/>
                      </div>
                      <div className='input'>
                        <SearchBar
                          { ...props.searchProps }
                          className="inputsearch"
                          placeholder=" "
                          />
                      </div>
                      { this.props.role !== 3 ?
                        <MyExportCSV { ...props.csvProps } />
                        :
                        ''
                      }
                      <ToastContainer
                        position="top-right"
                        autoClose={4000}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnVisibilityChange
                        draggable
                        pauseOnHover
                        />
                  </div>
                    : <div></div>}

                    <BootstrapTable
                        id="table-to-xls"
                        striped
                        hover
                        bordered={false}
                        noDataIndication={this.indication}
                        filter={ filterFactory() }
                        { ...props.baseProps }
                        pagination={this.props.dataColumns.length >10 ? paginationFactory(options) : false}
                        selectRow={ this.props.selectRow }
                        defaultSortDirection="asc"
                        // defaultSorted={ defaultSorted } 
                        onTableChange={ this.handleTableChange }
                    />
                </div>
                )
            }
            </ToolkitProvider>
      </div>
    );
  }
}



export default Table;