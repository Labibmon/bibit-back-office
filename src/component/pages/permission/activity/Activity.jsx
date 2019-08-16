import React, { Component } from 'react';
import TableComp from '../../../Table';
import { Loading } from '../../../core/Util';
import API from '../../../../service';
import { dateFilter, Comparator } from 'react-bootstrap-table2-filter';
import moment from 'moment-timezone';

const pathAPI = 'activity';
const ParsedDateInd = date => date ? moment.utc(date).lang('id').tz('Asia/Jakarta').format('DD MMMM YYYY') : '';

export default class Activity extends Component {
    constructor(){
        super();
        this.state={
            data: [],
            lenghtData: '',
            loadingMember: true,
            columns: [
              {
                dataField: 'date',
                text: 'Date Activity',
                style: { fontSize:'14px' },
                formatter: (cell,row) => {
                    return ParsedDateInd(cell)
                  },
                filter: dateFilter({
                  placeholder: 'Filter',
                  comparators: [Comparator.EQ, Comparator.GT, Comparator.LT],
                  withoutEmptyComparatorOption: true,
                  style: { display: 'flex', marginTop: '3%' },
                  dateStyle: { width: '70%', marginLeft:'3%' },
                  comparatorStyle: { width: '30%' },
                }),
                headerStyle: (colum, colIndex) => ({ width: '30%', textAlign: 'left' }),
              },{
                dataField: 'desc',
                text: 'Description Activity Role',
                style: { fontSize:'14px' },
                headerStyle: (colum, colIndex) => ({ width: '70%', textAlign: 'left' }),
              }
            ]
        }
    }
    
    componentDidMount() {
        this.getData();
        setTimeout(() => this.loading(), 1500);
      }
    
    getData = () => {
        API.getDataApi(pathAPI).then( result => {
          this.setState({
            data: result.data,
            lenghtData: result.data.length,
          });
        })
      }

    loading = () => {
        this.setState({
            loadingMember: false
        })
    }

    render(){
        const {columns, data} = this.state;

        if(this.state.loadingMember){
            return (<Loading isLoading={this.state.loadingRole} />)
          }
        
        return(
            <div>
                <div className="judul"><h3>Activity Role Permission </h3></div>
                <div className="container">
                    <TableComp
                        headerColumns={columns}
                        dataColumns={data}
                    />
                </div>
            </div>
        );
    }
}