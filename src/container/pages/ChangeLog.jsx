import React from "react";
import API from '../../service';
import Table from '../../component/Table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import DatePicker, { registerLocale } from "react-datepicker";
import draftToHtml from 'draftjs-to-html';
import moment from 'moment-timezone';
import id from "date-fns/locale/id"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/content.css';
import "react-datepicker/dist/react-datepicker.css";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

registerLocale("id", id);
const pathAPI = 'changelog';
const ParsedDateInd = date => date ? moment.utc(date).lang('id').tz('Asia/Jakarta').format('DD MMM YYYY') : '';
class ChangeLog extends React.Component {
    constructor(){
        super();
        this.state = {
            lenghtData: '',
            dataColumns: [],
            modal: false,
            modalDelete: false,
            titleModal: '',
            nameMenu: 'Change Log',
            submitedType: '',
            dropdownOpen: false,
            startDate: '',
            inputType: true,
            inputDate: true,
            inputDateChange: false,
            inputDesc: true,
            inputDescChange: false,          
            typeLog: 'first',
            logType: '',
            editorState: EditorState.createEmpty(),
            formData:{
              id:'',
              type: '',
              desc: '',
              dates: '',
            },
            headerTableChangeLog: [{
                dataField: 'desc',
                text: 'Description',
                  classes: 'cell-columns',
                style: { fontSize:'14px' },
                sort: true,
                sortCaret: (order, column) => {
                  if (!order) return (<span className='sort'>&nbsp;&nbsp;<i className=" fa fa-sort-up" /><i className=" fa fa-sort-down" /></span>);
                  else if (order === 'asc') return (<span className='sort'>&nbsp;&nbsp;&nbsp;<font color="red"><i className=" fa fa-sort-up" /></font><i className=" fa fa-sort-down" /></span>);
                  else if (order === 'desc') return (<span className='sort'>&nbsp;&nbsp;&nbsp;<i className=" fa fa-sort-up" /><font color="red"><i className=" fa fa-sort-down" /></font></span>);
                  return null;
                },
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
                formatter: (cell,row) => {
                  return ParsedDateInd(cell)
                },
                headerStyle: (colum, colIndex) => {
                    return { width: '20%', textAlign: 'left', };
                    }
              }, {
                dataField: 'action',
                text: 'Action',
                style: { fontSize:'14px' },
                formatter: this.buttonAction,
                headerStyle: (colum, colIndex) => ({ width: '10%', textAlign: 'center' }),
              }],
        }
    }
    
    componentDidMount() {
      setTimeout(() => this.getData(), 1000);
    }

    getData = () => {
      API.getDataApi(pathAPI).then( result => {
        this.setState({
          dataColumns: result.data,
          lenghtData: result.data.length,
        });
        })
      }
      buttonAction = (cell,row) => {
        return (
          <div>
            <Button color="default" className="btnEdit" size="sm" onClick={() => this.toggle('edit', row)}><i className=" fa fa-pen" /></Button>
            <Button color="danger" className="btnDelete" size="sm" onClick={() => this.toggleDelete('delete', row)}><i className=" fa fa-trash" /></Button>
          </div>
        )
      } 
      postData = () => {
        const {formData} = this.state;
        API.postDataApi(pathAPI, formData).then( result=>{
          this.getData();
          this.toggle();
          this.notifyAdd();
        }, () => {
          this.notifyAddError();
        });
      }

    toggle = (title, vType) => {
      console.log(this.state.typeLog)
        if (title === 'add') {
          this.setState(prevState => ({
            modal: !prevState.modal,
            titleModal: 'Add New Member',
            submitedType: 'add',
          }));
        } else if (title === 'edit') {
          this.setState(prevState => ({
            modal: !prevState.modal,
            titleModal: 'Edit Member',
            formData: vType,
            startDate: vType.dates,
            submitedType: 'edit',
            typeLog: vType.type,
            editorState: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(vType.desc),
              )),
          }));
        } else {
          this.setState(prevState => ({
            modal: !prevState.modal,
            titleModal: '',
            submitedType: '',
            startDate: '',
            typeLog: 'first',
            logType: '',
            formData:{
              id:'',
              type: '',
              desc: '',
              dates: '',
            },
            editorState: EditorState.createEmpty(),
            inputType: true,
            inputDate: true,
            inputDateChange: false,
            inputDesc: true,
            inputDescChange: false,
          }));
        }
    }

    handleChange = (date) => {
      this.setState({
        startDate: date
      })
      // this.state.startDate = date
    }

    handleSubmited = () => {
      const { inputDate, inputDesc, inputType, submitedType, formData, inputDateChange, inputDescChange  } = this.state
      if(submitedType === 'add'){
        const timestamp = new Date().getTime();
        if(inputDate && inputDesc && inputType && inputDateChange && inputDescChange === true){
          this.setState({
            formData:{
              id: timestamp,
              type: this.state.logType,
              desc: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent())),
              dates: this.state.startDate,
            },
          }, () => {this.postData()})
        } else {
          if(formData.type === ''){
            this.setState({
              inputType: false,
            })
          }
          if(inputDateChange === false){
            this.setState({
              inputDate: false,
            })
          }     
          if(inputDescChange === false){
            this.setState({
              inputDesc: false,
            })
          }
        }
      } else if (submitedType === 'delete'){
        this.deleteData();
      } else if (submitedType === 'edit'){
        const formDataNew = { ...this.state.formData };
        formDataNew.desc = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
        formDataNew.dates = this.state.startDate;
        this.editData(formDataNew)
      }
    }

    notifyAdd = () => toast.success("Data Berhasil Ditambahkan", {
      className:"toastSucces"
    });
    notifyAddError = () => toast.error("Data Gagal Ditambahkan", {
      className:"toastError"
    });
    notifyEditSuccess = () => toast.success("Data Berhasil Di Ubah", {
      className:"toastSucces"
    });
    notifyEditError = () => toast.error("Data Gagal Di Ubah", {
      className:"toastError"
    });
    notifyDelete = () => toast.success("Data Berhasil Dihapus", {
      className:"toastSucces"
    });
    notifyDeleteError = () => toast.error("Data Gagal Dihapus", {
      className:"toastError"
    });

    editData = (data) => {
      API.editDataApi(pathAPI, data.id, data).then(result => {
        this.getData();
        this.toggle();
        this.notifyEditSuccess();
      }, () => {
        this.toggle();
        this.notifyEditError();
      });
    }

    deleteData = () => {
      const {formData} = this.state;
      API.deleteDataApi(pathAPI, formData.id).then(result => {
        this.getData();
        this.toggleDelete();
        this.notifyDelete();
      }, () => {
        this.toggleDelete();
        this.notifyDeleteError();
      });
    }

    toggleDropDown = () => {
      this.setState(prevState=> ({
        dropdownOpen: !prevState.dropdownOpen,
      }))
      if(this.state.logType === '' && this.state.typeLog === 'second'){
        this.setState({
          inputType: false,
          typeLog: 'third'
        })
      } else if(this.state.logType === '' && this.state.typeLog === 'third'){
        this.setState({
          inputType: true,
          typeLog: ''
        })
      }
      // if(this.state.dropdownOpen === true){
      //   this.setState({
      //     inputType: true,
      //   })
      // }
      console.log('DATA', this.state.formData.type)
    }
    
    onEditorStateChange = (editorState) => {
        this.setState({
          editorState,
        });
      };

    changeTypeLog = (e) => {
      console.log('Clicked')
      this.setState({
        inputType: true,
      })
      const { id } = e.target
      if(id === 'front'){
        this.state.formData.type = 'front'
        this.state.logType = 'front'
      } else {
        this.state.logType = 'back'
        this.state.formData.type = 'back'
      }
      
    }

    toggleDelete = (title, row) => {
      if (title === 'delete'){
        this.setState(prevState => ({
          modalDelete: !prevState.modal,
          titleModal: 'Delete Confirm',
          formData: row,
          submitedType: 'delete',
        }));
      } else {
        this.setState(prevState => ({
          modalDelete: false,
          titleModal: '',
          formData:{
            id:'',
            type: '',
            desc: '',
            dates: '',
          },
        }));
      }
    }

    handleOnBlurDate = (v) => {
      if(this.state.startDate === '' || this.state.startDate === null){
        this.setState({
          inputDate: false,
          inputDateChange: false,
        })
      } else {
        this.setState({
          inputDate: true,
          inputDateChange: true,
        })
      }
    }

    handleOnBlurEditor = (v) => {
      const editorState = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
      if(editorState === '<p></p>\n'){
        this.setState({
          inputDesc: false,
          inputDescChange: false,          
        })
      } else {
        this.setState({
          inputDesc: true,
          inputDescChange: true,          
        })
      }
    }

    handleOnBlurType = (v) =>{
      console.log('BLUR')
    }
    handleClickType = () => {
      if(this.state.typeLog === 'first'){
        this.setState({
          typeLog: 'second',
        })
      }
      this.setState({
        inputType: true
      })
    }

    render(){

        const { lenghtData, editorState } = this.state;
        const data = this.state.dataColumns;
        const columns = this.state.headerTableChangeLog;

        return(
            <div>
                <div className='judul'><h3>Change Log</h3></div>   
                <div className='container'>
                    <div style={{ margin: '10px' }}>
                        <span />
                        <header className="d-flex justify-content-between flex-wrap">
                            <h5 className="lh-ms">
                            {lenghtData}  Total Change Log
                            </h5>
                            <Button color="info" size="sm" onClick={() => this.toggle('add')} className='buttonadd' >Add New Log</Button>   
                        </header>
                        {/* <Searchfield /> */}
                        <Table 
                            headerColumns={columns} 
                            dataColumns={data}
                            nameMenu={this.state.nameMenu}
                            />
                        <span />
                    </div>
                </div>
                {/* Modal Add & Edit */}
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-lg">
                        <ModalHeader toggle={this.toggle} title="Add New Member">{this.state.titleModal}</ModalHeader>
                        <ModalBody>
                            <Form>
                                <FormGroup>
                                    <Label className="pl-0" className='labelform'>Type Logs</Label>
                                    <ButtonDropdown  isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className= 'dropdown'>
                                        <DropdownToggle className={this.state.inputType ? 'dropdownbutton' : 'dropdownbuttonError'} onBlur={this.handleOnBlurType} onClick={this.handleClickType}>
                                            {this.state.formData.type === '' ? 'Choose Log Type' : this.state.formData.type === 'front' ? 'Apps' : 'Back Office'}<i className='fa fa-angle-down'></i> 
                                        </DropdownToggle>
                                        <DropdownMenu>
                                        <DropdownItem id='front' onClick={this.changeTypeLog}>Apps</DropdownItem>
                                        <DropdownItem id='back' onClick={this.changeTypeLog}>Back Office</DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                    {this.state.inputType ? "" : <i className="fa fa-exclamation-circle iconErrorType"/>}
                                </FormGroup>
                                <FormGroup>
                                    <Label className="pl-0" className='labelform'>Choose Date</Label>
                                    <DatePicker
                                      locale="id"
                                      selected={this.state.startDate}
                                      onChange={this.handleChange}
                                      onBlur={this.handleOnBlurDate}
                                      className={this.state.inputDate ? 'inputdate' : 'inputdateError'} 
                                      placeholderText="Select date"
                                      dateFormat="d MMMM yyyy"
                                    />
                                    {this.state.inputDate ? "" : <i className="fa fa-exclamation-circle iconErrorDate"/>}
                                </FormGroup>
                                <FormGroup>
                                    <Label className="pl-0" className='labelform'>Description</Label>
                                    {this.state.inputDesc ? "" : <i className="fa fa-exclamation-circle iconErrorDesc"/>}
                                    <div className={this.state.inputDesc ? "editorbox" : "editorbox error"}>
                                      <Editor
                                      editorState={editorState}
                                      wrapperClassName="demo-wrapper"
                                      editorClassName="demo-editor"
                                      onEditorStateChange={this.onEditorStateChange}
                                      onBlur={this.handleOnBlurEditor}
                                      toolbar={{
                                        options: ['inline', 'textAlign', 'history', 'list'],
                                      }}
                                      />
                                    </div>
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                        <Button color="link" onClick={this.toggle} size="sm">Cancel</Button>    
                        <Button color="primary" onClick={this.handleSubmited} size="sm">{this.state.submitedType === 'delete' ? 'Delete' : 'Save' }</Button>
                        </ModalFooter>
                    </Modal>

                     {/* Modal Delete */}
                      <Modal isOpen={this.state.modalDelete} toggle={this.toggleDelete} className={this.props.className}>
                        <ModalHeader toggle={this.toggleDelete} title="Add New Member">{this.state.titleModal}</ModalHeader>
                        <ModalBody>
                          <Form>
                              <Label className="pl-0 deleteModal"><p>Menghapus data <b style={{color: 'black'}}> <i> {this.state.formData.desc.replace(/<(?:.|\n)*?>/gm, '')}</i></b> ? </p></Label>
                          </Form>
                        </ModalBody>
                        <ModalFooter>
                          <Button color="link" onClick={this.toggleDelete} size="sm">Cancel</Button>
                          <Button color="primary" onClick={this.handleSubmited} size="sm">Delete</Button>
                        </ModalFooter>
                      </Modal>
                      <ToastContainer
                        position="top-right"
                        autoClose={4000}
                        // hideProgressBar
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnVisibilityChange
                        draggable
                        pauseOnHover
                        />
            </div>
                
        )
    }
}

export default ChangeLog ;
