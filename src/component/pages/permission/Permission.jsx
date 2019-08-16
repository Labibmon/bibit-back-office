/*eslint no-useless-escape:0*/

import React, { Fragment } from 'react';
import API from '../.././../service';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Tooltip, Table} from 'reactstrap';
import { textFilter } from 'react-bootstrap-table2-filter';
import MaskedInput from 'react-text-mask';
import TableComp from '../../Table';
import { ToastContainer, toast } from 'react-toastify';
import { Loading } from '../../core/Util';
import { Textbox } from "react-inputs-validation";
import moment from 'moment-timezone';
import 'react-toastify/dist/ReactToastify.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './permission.css';


const pathAPI = 'member';
let emailFilter;

class Permission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingMember: true,
      dataColumns: [],
      modal: false,
      modalDelete: false,
      modalView: false,
      input: false,
      inputUsername: true,
      inputEmail: true,
      inputPhone: true,
      inputUsernameChange: false,
      inputEmailChange: false,
      inputPhoneChange: false,
      tooltipOpenEmail: false,
      tooltipOpenPhone: false,
      tooltipOpenUsername: false,
      activityRole: {
        id: '',
        desc: '',
        date: '',
      },
      formData: {
        id: '',
        username: '',
        email: '',
        phone: '',
        dates: '',
        create: '',
        dates_update: '',
        updated: '',
        status: {
          name: '' ,
          requested: ''
        },
        role:'',
      },
      username: '',
      titleModal: '',
      filterValue: '',
      nameMenu: 'Member',
      submitedType: '',
      headerTablePermission: [{
            dataField: 'username',
            text: 'Username',
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
            filter: textFilter({
              style: {display: 'none'},
              onFilter: filterVal => this.setState({
                filterValue: filterVal
              }),
              getFilter: (filter) => {
                emailFilter = filter;
              }
            }),
            headerStyle: (colum, colIndex) => ({ width: '25%', textAlign: 'left' }),
          }, {
            dataField: 'action',
            text: 'Action',
            formatter: this.buttonAction,
            headerStyle: (colum, colIndex) => ({ width: '10%', textAlign: 'center' }),
            align: 'center',
          }],
          headerCSV: [{
            label:'Username',
            key: 'username',
          },{
            label: 'Phone',
            key: 'phone',
          }, {
            label: 'Email',
            key: 'email',
          }],
          lenghtData: '',
    };
  }

  toggle = (title, vType) => {
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
        submitedType: 'edit',
      }));
    } else {
      this.setState(prevState => ({
        modal: !prevState.modal,
        titleModal: '',
        submitedType: '',
        formData: {
          id: '',
          username: '',
          email: '',
          phone: '',
        },
        inputUsername: true,
        inputEmail: true,
        inputPhone: true,
        inputUsernameChange: false,
        inputEmailChange: false,
        inputPhoneChange: false,
        input: false,
      }));
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
        formData: {
          id: '',
          username: '',
          email: '',
          phone: '',
        },
      }));
    }
  }
  toggleView = (title, row) => {
    if (title === 'view'){
      this.setState(prevState => ({
        modalView: !prevState.modal,
        titleModal: 'View User',
        formData: row,
      }));
    } else {
      this.setState(prevState => ({
        modalView: false,
        titleModal: '',
        formData: {
          id: '',
          username: '',
          email: '',
          phone: '',
        },
      }));
    }
  }
  toggleTooltipUsername = () => {
    this.setState({
      tooltipOpenUsername: !this.state.tooltipOpenUsername
    });
  }
  toggleTooltipEmail = () => {
    this.setState({
      tooltipOpenEmail: !this.state.tooltipOpenEmail
    });
  }
  toggleTooltipPhone = () => {
    this.setState({
      tooltipOpenPhone: !this.state.tooltipOpenPhone
    });
  }

    getData = () => {
      API.getDataApi(pathAPI).then( result => {
        this.setState({
          dataColumns: result.data,
          lenghtData: result.data.length,
        });
      })
    }

    postData = () => {
      const {formData} = this.state;
      API.postDataApi(pathAPI, formData).then( result=>{
        this.getData();
        this.toggle();
        this.notifyAdd();

        const date = new Date();        
        const activity = this.state.activityRole;
            
        activity.id = date.getTime();
        activity.desc = `Added new member ${formData.email} by ${this.props.user.email}(admin)`
        activity.date = date;

        this.setState({
                activityRole: activity,
            }, () => {
                API.postDataApi('activity', activity)
            })
      }, () => {
        this.notifyAddError();
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

    editData = () => {
      const {formData} = this.state;
      API.editDataApi(pathAPI, formData.id, formData).then(result => {
        this.getData();
        this.toggle();
        this.notifyEditSuccess();
      }, () => {
        this.toggle();
        this.notifyEditError();
      });
    }

    handleSubmited = () => {
      const { submitedType, formData, inputUsernameChange, inputEmailChange, inputPhoneChange} = this.state;
      if (submitedType === 'add'){
        if(inputUsernameChange && inputEmailChange && inputPhoneChange === true){
          this.postData();
        } else {
          if(formData.username === ''){
            this.setState({
              inputUsername: false,
            })
          }
          if(formData.email === ''){
            this.setState({
              inputEmail: false,
            })
          }
          if(formData.phone === ''){
            this.setState({
              inputPhone: false,
            })
          }
          
          this.setState({
            input: false,
          })
        }
      } else if (submitedType === 'edit'){
        this.editData();
      } else if (submitedType === 'delete'){
        this.deleteData();
      }
    }

    notifyAdd = () => toast.success("Data Successfully Added", {
      className:"toastSucces"
    });
    notifyAddError = () => toast.error("Data Failed Added", {
      className:"toastError"
    });
    notifyEditSuccess = () => toast.success("Data is edited", {
      className:"toastSucces"
    });
    notifyEditError = () => toast.error("Data failed to edited", {
      className:"toastError"
    });
    notifyDelete = () => toast.success("Data deleted", {
      className:"toastSucces"
    });
    notifyDeleteError = () => toast.error("Data failed to delete", {
      className:"toastError"
    });

    handleOnChange = (event) => {
      const formDataNew = { ...this.state.formData };
      const timestamp = new Date();
      if(event.target.name === 'role'){
        formDataNew.status.name = event.target.value;
        if(event.target.value === 'Admin'){
          formDataNew.role = 1
        } else if(event.target.value === 'Author'){
          formDataNew.role = 2
        } else {
          formDataNew.role = 3
        }
      } else {
        formDataNew[event.target.name] = event.target.value;
      }
      formDataNew.dates_update = timestamp;
      if(this.state.formData.email === this.props.email){
        formDataNew.updated = `user ( ${this.props.email} )`;
      } else {
        formDataNew.updated = `admin ( ${this.props.email} )`;
      }

      if(this.state.submitedType === 'edit'){
        this.setState({
          formData: formDataNew,
        });
      } else {
        formDataNew.id = timestamp.getTime();
        formDataNew.dates = timestamp;
        formDataNew.create = this.props.email;
        this.setState({
          formData: formDataNew,
        });
      }
    }

    buttonAction = (cell,row) => {
      const email = this.props.email
      // const editDataTrue = member.find(member => member.email === email)
      return row.email === email ? 
              <div>
                <Button color="default" className="btnEdit" size="sm" onClick={() => this.toggle('edit', row)}><i className=" fa fa-pen" /></Button>
                <Button color="primary" className="btnDelete" size="sm" onClick={() => this.toggleView('view', row)}><i className=" fa fa-eye" /></Button>
              </div>
            : this.props.user.role === 1 ?
              <div>
                <Button color="default" className="btnEdit" size="sm" onClick={() => this.toggle('edit', row)}><i className=" fa fa-pen" /></Button>
                <Button color="primary" className="btnViewAdmin" size="sm" onClick={() => this.toggleView('view', row)}><i className=" fa fa-eye" /></Button>                
                <Button color="danger" className="btnDelete" size="sm" onClick={() => this.toggleDelete('delete', row)}><i className=" fa fa-trash" /></Button>
              </div>
            :
              <Button color="primary" className="btnView" size="sm" onClick={() => this.toggleView('view', row)}><i className=" fa fa-eye" /></Button>
    }

    handleOnClickInput = (event) => {
      if(event.target.name === 'username'){
        this.setState({
          inputUsername: true,
        })
      }
      if(event.target.name === 'email'){
        this.setState({
          inputEmail: true,
        })
      }
      if(event.target.name === 'phone'){
        this.setState({
          inputPhone: true,
        })
      }
    }


    handleOnBlur = (event) =>{
      if(event.target.name === 'username'){
        if(event.target.value === ''){
          this.setState({
            inputUsername: false,
            inputUsernameChange: false,
          })
        } else {
          this.setState({
            inputUsername: true,
            inputUsernameChange: true,
          })
        }
      }

      if(event.target.name === 'email'){
        if(event.target.value === ''){
          this.setState({
            inputEmail: false,
            inputEmailChange: false,
          })
        }
      }

      if(event.target.name === 'phone'){
        if(event.target.value === ''){
          this.setState({
            inputPhone: false,
            inputPhoneChange: false,
          })
        } else {
          this.setState({
            inputPhone: true,
            inputPhoneChange: true,
          })
        }
      }
    }

    btnFilter = (props) => {
      if(this.state.filterValue){
        emailFilter('');
      } else {
        emailFilter(`${props.email}`);
      }
    }

    componentDidMount() {
      this.getData();
      setTimeout(() => this.loading(), 1500);
    }

    loading = () => {
      this.setState({
          loadingMember: false
      })
  }

    render() {
      const ParsedDateInd = date => date ? moment.utc(date).lang('id').tz('Asia/Jakarta').format('DD MMM YYYY') : '';
      const columns = this.state.headerTablePermission;
      const data = this.state.dataColumns;
      const role = this.props.user.role;
      const { email } = this.state.formData
      const { lenghtData } = this.state;
      
      if(this.state.loadingMember){
        return (<Loading isLoading={this.state.loadingRole} />)
      }

      return (
        <div>
          <div className="judul"><h3>Member</h3></div>
          <div className="container">
            <div>
              <header className="d-flex justify-content-between flex-wrap">
                <h5 className="lh-ms">
                  {lenghtData} Total Member
                </h5>
                {role === 1 ? 
                <Button
                  color="info" size="sm"onClick={() => this.toggle('add')} className='buttonadd' 
                  >Add New Member</Button>
                : 
                <Button
                  color="info" size="sm"onClick={() => this.btnFilter(this.props)} className='buttonadd' 
                  >{this.state.filterValue ? 'All Data' : this.props.email}</Button>
                }
              </header>
              <TableComp
                headerColumns={columns} 
                dataColumns={data}
                reset={this.resetSearch}
                nameMenu={this.state.nameMenu}
                header={this.state.headerCSV}
                searchField= "true"
                role={this.props.user.role}
                />
            </div>
          </div>
            
          {/* Modal Add & Edit */}
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle} title="Add New Member">{this.state.titleModal}</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label className="pl-0">Username </Label>
                  <Input type="username" className={this.state.inputUsername ? "inputField" : "inputField error" } placeholder="Username" name="username" value={this.state.formData.username} onChange={this.handleOnChange} onClick={this.handleOnClickInput} onBlur={this.handleOnBlur} />
                  {this.state.inputUsername ? "" : 
                  <div>
                    <i className="fa fa-exclamation-circle iconErrorUsername" id="TooltipUsername"/>
                    <Tooltip placement="top" isOpen={this.state.tooltipOpenUsername} target="TooltipUsername" toggle={this.toggleTooltipUsername}>
                      Input username
                    </Tooltip>
                  </div>
                  }
                </FormGroup>
                <FormGroup>
                  <Label className="pl-0">Email</Label>
                  {/* <Input className={this.state.inputEmail ? "inputField" : "inputField error" } type="email" placeholder="Email" name="email"  value={this.state.formData.email} onChange={this.handleOnChange} onClick={this.handleOnClickInput} onBlur={this.handleOnBlur} /> */}
                  <Textbox
                    tabIndex="1" //Optional.[String or Number].Default: -1.
                    id={"email"} //Optional.[String].Default: "".  Input ID.
                    name="email" //Optional.[String].Default: "". Input name.
                    type="text" //Optional.[String].Default: "text". Input type [text, password, phone, number].
                    value={email} //Optional.[String].Default: "".
                    classNameInput={this.state.inputEmail ? "inputField" : "inputField error" }
                    customStyleWrapper={{color: 'red;'}}
                    customStyleContainer={{color: 'red;'}}
                    placeholder="Email" //Optional.[String].Default: "".
                    onChange={(email, e) => { this.handleOnChange(e) }} //Required.[Func].Default: () => {}. Will return the value.
                    onBlur={e => {this.handleOnBlur(e)}} //Optional.[Func].Default: none. In order to validate the value on blur, you MUST provide a function, even if it is an empty function. Missing this, the validation on blur will not work.
                    validationOption={{
                      name: "email", //Optional.[String].Default: "". To display in the Error message. i.e Please enter your {name}.
                      check: true, //Optional.[Bool].Default: true. To determin if you need to validate.
                      required: false, //Optional.[Bool].Default: true. To determin if it is a required field.
                      customFunc: email => {
                        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (reg.test(String(email).toLowerCase())) {
                          this.setState({
                            inputEmail: true,
                            inputEmailChange: true,
                          })
                          return true;
                        } else {
                          this.setState({
                            inputEmail: false,
                            inputEmailChange: false,
                          })
                          return false;
                        }
                      }
                    }}
                  />
                  {this.state.inputEmail ? "" : 
                  <div>
                    <i className="fa fa-exclamation-circle iconErrorEmail" id="TooltipEmailError"/>
                    <Tooltip placement="top" isOpen={this.state.tooltipOpenEmail} target="TooltipEmailError" toggle={this.toggleTooltipEmail}>
                      This not a valid email
                    </Tooltip>
                  </div>
                  }
                </FormGroup>
                <FormGroup>
                  <Label className="pl-0">Phone</Label>
                  <MaskedInput className={this.state.inputPhone ? "inputField" : "inputField error" } mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]} guide={false} placeholder="Phone" name="phone"  value={this.state.formData.phone} onChange={this.handleOnChange} onClick={this.handleOnClickInput} onBlur={this.handleOnBlur} />
                  {this.state.inputPhone ? "" : 
                  <div>
                    <i className="fa fa-exclamation-circle iconErrorPhone" id="TooltipPhone"/>
                    <Tooltip placement="top" isOpen={this.state.tooltipOpenPhone} target="TooltipPhone" toggle={this.toggleTooltipPhone}>
                      This not a valid phone number
                    </Tooltip>
                  </div>}
                </FormGroup>
                {this.state.titleModal === "Add New Member" ? 
                  <Fragment>
                    <Label className="pl-0">Role</Label>
                    <Input type="select" name='role' onClick={this.handleOnChange}>
                      <option disabled selected>Select Role</option>
                      <option>Default</option>
                      <option>Author</option>
                      <option>Admin</option>
                    </Input>
                  </Fragment>
                  : ''
                }
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
                  <Label className="pl-0"><p>Menghapus data <b style={{color: 'black'}}> <i> {this.state.formData.email}</i></b> ? </p></Label>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="link" onClick={this.toggleDelete} size="sm">Cancel</Button>
              <Button color="primary" onClick={this.handleSubmited} size="sm">Delete</Button>
            </ModalFooter>
          </Modal>

          {/* Modal View */}
          <Modal isOpen={this.state.modalView} toggle={this.toggleView} className={this.props.className}>
            <ModalHeader toggle={this.toggleView} title="Add New Member">{this.state.titleModal}</ModalHeader>
            <ModalBody>
              <br />
              <Table borderless>
                <tbody>
                  <tr>
                    <th>Username</th>
                    <td>{this.state.formData.username}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{this.state.formData.email}</td>
                  </tr>
                  <tr>
                    <th>Phone</th>
                    <td>{this.state.formData.phone}</td>
                  </tr>
                  <tr>
                    <th>Create date</th>
                    <td>{ParsedDateInd(this.state.formData.dates)}</td>
                  </tr>
                  <tr>
                    <th>Create by</th>
                    <td>{this.state.formData.create}</td>
                  </tr>
                  {this.state.formData.dates_update ? 
                  <Fragment>
                      <tr>
                        <th>Last update date</th>
                        <td>{this.state.formData.dates_update}</td>
                      </tr>
                      <tr>
                        <th>Update by</th>
                        <td>{this.state.formData.updated}</td>
                      </tr>
                  </Fragment>
                  :
                   <th style={{color:'blue'}}>this is new member</th>
                  }
                </tbody>
              </Table>
              <hr />
            </ModalBody>
          </Modal>

          <ToastContainer
            position="top-right"
            autoClose={4000}
            newestOnTop={false}
            hideProgressBar
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
            />
        </div>

      );
    }
}

export default Permission;
