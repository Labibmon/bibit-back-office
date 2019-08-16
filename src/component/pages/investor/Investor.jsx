import React, { Component } from 'react';
import { Loading } from '../../core/Util';
import API from '../../../service';
import moment from 'moment-timezone';
import TableComp from '../../Table';
import { Button } from 'reactstrap';

const pathAPI = 'investor';
const ParsedDateInd = date => date ? moment.utc(date).lang('id').tz('Asia/Jakarta').format('DD MMM YYYY') : '';
export default class Investor extends Component {
    constructor(){
        super();
        this.state = {
            data: [],
            lengthData: '',
            loadingInvestor: true,
            nameMenu: 'Investor',
            selectRow: {
                clickToSelect: true,
                hideSelectColumn: true,
                onSelect: (row) => {
                    this.handleSelectedRow(row);
                  },
            },
            columns: [{
                dataField: 'email',
                text: 'Email',
                style: { fontSize:'14px', cursor: 'pointer' },
                headerStyle: (colum, colIndex) => ({ width: '25%', textAlign: 'left' }),
            },{
                dataField: 'phone',
                text: 'Phone',
                style: { fontSize:'14px', cursor: 'pointer' },
                headerStyle: (colum, colIndex) => ({ width: '20%', textAlign: 'left' }),
            },{
                dataField: 'date_register',
                text: 'Date',
                style: { fontSize:'14px', cursor: 'pointer' },
                formatter: (cell,row) => {
                    return ParsedDateInd(cell)
                },
                headerStyle: (colum, colIndex) => ({ width: '15%', textAlign: 'left' }),
            },{
                dataField: 'status',
                text: 'Status',
                style: { fontSize:'14px', cursor: 'pointer' },
                formatter: (cell, row) => {
                    return row.status ? 'Verification' : 'Not-Verification'
                },
                headerStyle: (colum, colIndex) => ({ width: '10%', textAlign: 'center' }),
                align: 'center',
            }]
        }
    }

    componentDidMount(){
        this.getData();
        setTimeout(() => this.loading(), 1500);
    }

    getData = () => {
        API.getDataApi(pathAPI).then( result => {
            this.setState({
                data: result.data,
                lengthData: result.data.length
            })
        })
    }

    loading = () => {
        this.setState({
            loadingInvestor: false
        })
    }

    handleSelectedRow = (row) => {
        if(this.props.user.role === 3){
            console.log('not permission')
        } else {
            document.location.replace(`/investor/user/${row.email}`)
        }
    }

    render(){
        const { loadingInvestor, lengthData, data, nameMenu, columns, selectRow } = this.state;
        
        if(loadingInvestor){
            return (<Loading isLoading={loadingInvestor} />)
        }
        return(
            <div>
                <div className="judul"><h3>Bibit Subcription</h3></div>
                <div className="container">
                    <header className="d-flex justify-content-between flex-wrap">
                        <h5 className="lh-ms">
                            {lengthData} Total Investor
                        </h5>
                    </header>
                    <TableComp
                        headerColumns={columns} 
                        dataColumns={data}
                        // reset={this.resetSearch}
                        nameMenu={nameMenu}
                        searchField= "true"
                        selectRow= {selectRow}
                        role={this.props.user.role}
                    />
                </div>
            </div>
        );
    }
}