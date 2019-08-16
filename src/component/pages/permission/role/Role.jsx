/* eslint no-sequences: 0 */

import React, { Component, Fragment } from 'react';
import Table from '../../../Table';
import { selectFilter } from 'react-bootstrap-table2-filter';
import API from '../../../../service';
import { Button, Card, CardText, CardBody, CardHeader, CardFooter,
    Alert, CardGroup, Modal, Collapse, 
    ModalHeader, ModalBody, ModalFooter,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, 
    Col, Row, UncontrolledAlert,
    Label, Input} from 'reactstrap';
import {Loading, notifySuccess, notifyError} from '../../../core/Util';
import { ToastContainer } from 'react-toastify';
import moment from 'moment-timezone';


import './role.css';

const pathAPI = 'member';
const selectOptionsRoles = {
    1: 'Admin',
    2: 'Author',
    3: 'Viewer'
  };
let roleStatusFilter;
let roleFilter;
const selectOptionStatus = [
    { value: 'Accepted', label: 'Accepted' },
    { value: 'Requested', label: 'Request' },
    { value: 'Default', label: 'Default' }
  ];
const ParsedDateInd = date => date ? moment.utc(date).lang('id').tz('Asia/Jakarta').format('DD MMMM YYYY') : '';

export default class Role extends Component {
    constructor(props){
        super();
        this.state={
            loadingRole: true,
            lenghtData: '',
            modalRequest: false,
            modalRequestedTrue: false,
            modalRespone: false,
            titleModal: '',
            submitedType: '',
            totalAdmin: '',
            totalAuthor: '',
            totalViewer: '',
            requestingModal: '',
            totalRequesting: '',
            loadingResponse: false,
            inputUsername: true,
            modalEditRespone: false,
            dropdownRequest: false,
            collapse: false,
            requested: false,
            requestCancel: false,
            alertAnnouncement: true,
            formData: {
                id: '',
                name: '',
                email: '',
                phone: '',
            },
            status: {
                name: '',
                requested: '',
            },
            activityRole: {
                id: '',
                desc: '',
                date: '',
            },
            editModalOpen: false,
            editModalData: '',
            statusEditModal: '',
            dataColumns: [],
            headerTableRole: [{
                dataField: 'username',
                text: 'Members Name',
                style: { fontSize:'14px' },
                headerStyle: (colum, colIndex) => ({ width: '25%', textAlign: 'left' }),
            },{
                dataField: 'email',
                text: 'Email',
                style: { fontSize:'14px' },
                headerStyle: (colum, colIndex) => ({ width: '30%', textAlign: 'left' }),
            }, {
                dataField: 'role',
                text: 'Roles',
                style: {fontSize:'14px'},
                formatter: (cell, row) => {
                    return selectOptionsRoles[cell], row.role === 1 ? 
                        <div style={{backgroundColor: '#27a243', padding: '3%', width: '44%', textAlign: 'center', color: 'white'}}>Admin</div> 
                        : row.role === 2 ?
                        <div style={{backgroundColor: '#f7bb07', padding: '3%', width: '44%', textAlign: 'center', color: 'white'}}>Author</div> 
                        : 
                        <div style={{backgroundColor: '#d53343', padding: '3%', width: '44%', textAlign: 'center', color: 'white'}}>Viewer</div> 
                  },
                  filter: selectFilter({
                    options: selectOptionsRoles,
                    placeholder: 'All Roles',
                    getFilter: (filter) => {
                       roleFilter = filter;
                    }
                  }),
                headerStyle: (colum, colIndex) => ({ width: '20%', textAlign: 'left' }),
            }, {
                dataField: 'status.name',
                text: 'Roles Status',
                style: { fontSize:'14px' },
                headerStyle: (colum, colIndex) => ({ width: '15%', textAlign: 'left' }),
                formatter: (cell, row) => {
                    return selectOptionStatus[cell], row.status.name === 'Requested' ? 
                        <div style={{backgroundColor: '#007bff', padding: '3%', width: '55%', textAlign: 'center', color: 'white'}}>Request</div> 
                        : row.status.name === 'Accepted' ?
                        <div>Accepted</div> 
                        : 
                        <div>Default</div> 
                  },
                filter: selectFilter({
                    options: selectOptionStatus,
                    placeholder: 'All Status',
                    getFilter: (filter) => {
                        roleStatusFilter = filter;
                     }
                  }),
            }, {
                dataField: 'action',
                text: 'Action',
                formatter: this.buttonAction,
                headerStyle: (colum, colIndex) => ({ width: '10%', textAlign: 'center' }),
                align: 'center',
                hidden: props.user.role,
              }]
        };
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            if(this.props.user){
                if(this.props.user.role === 1){
                    const headerColumnsNew = {...this.state.headerTableRole}
                    headerColumnsNew[4].hidden = false
                    this.setState({
                        headerColumns: headerColumnsNew
                    })
                }
            }
            this.getData();
            setTimeout(() => this.loading(), 1500);
         }
    } 

    componentWillUnmount(){
        this._isMounted = false;
    }

    loading = () => {
        this.setState({
            loadingRole: false
        })
    }

    getData = () => {
        API.getDataApi(pathAPI).then( result => {
          this.setState({
            dataColumns: result.data,
            lenghtData: result.data.length,
          }, () => {
                const member = this.state.dataColumns
                const admin = member.filter(admin => admin.role === 1).length;
                const author = member.filter(admin => admin.role === 2).length;
                const viewer = member.filter(admin => admin.role === 3).length;
                const requesting = member.filter(admin => admin.status.name === 'Requested').length
                this.setState({
                    totalAdmin: admin,
                    totalAuthor: author,
                    totalViewer: viewer,
                    totalRequesting: requesting
                })
          });
        })
      }

    
    toggleRequest = () => {
        this.setState(prevState => ({
            dropdownRequest: !prevState.dropdownRequest,
          }));
      }    

    toggleCollapse = () => {
        this.setState(state => ({ collapse: !state.collapse }));
      }

    buttonAction = (cell,row) => {
        return (
          <div>
            <Button color="default" name='edit' size="sm" onClick={event => this.toggle('edit',row)}><i className=" fa fa-pen" /></Button>
          </div>
        )
      }
    
    toggle = (type, row) => {
        
        if(row){
            this.setState({
                editModalData: row,
                statusEditModal: row.status
            })
        }

        this.setState( prevState => ({
            editModalOpen: !prevState.editModalOpen,
            titleModal: type,
        }))
        
    }

    toggleRespone = () => {
        this.setState(prevState => ({
            modalRespone: !prevState.modalRespone 
        }))
    }

    toggleResponeEdit = (event) => {
        if(event.target.name === 'submit'){
            const data = this.state.editModalData;
            API.editDataApi(pathAPI, data.id, data);
            notifyError(`Role Changed`);  
            this.handleRefresh();

            const date = new Date();        
            const activity = this.state.activityRole;
            
            activity.id = date.getTime();
            activity.desc = `${data.email} to be a ${data.status.requested === 1 ? 'admin' : data.status.requested === 2 ? 'viewer' : 'author' } changed by ${this.props.user.email}(admin)`
            activity.date = date;

            this.setState({
                activityRole: activity,
            }, () => {
                API.postDataApi('activity', activity)
            })

        }
        this.setState(prevState => ({
            modalEditRespone: !prevState.modalEditRespone
        }))
    }
    
    toggleResponeEditSave = () => {
        this.setState(prevState => ({
            modalEditRespone: !prevState.modalEditRespone
        }))
    }

    editRoleSubmit = (event) => {
        const value = event.target.value;
        const role = value === '1' ? 1 : value === '2' ? 2 : 3 
        const data = this.state.editModalData;
        data.role = role;
    }


    handlerespone = (value) => {
        const type = value.target.name;
        const { editModalData, statusEditModal } = this.state;
        const editModalDataNew = editModalData;
        const date = new Date();
        
        if(type === 'rejected'){
            editModalDataNew.status.name = 'Rejected';
            editModalDataNew.status.respondent = this.props.user.email;
            editModalDataNew.status.dates_reponse = date;
            editModalDataNew.show_announcement = true;

            const activity = this.state.activityRole;
            
            activity.id = date.getTime();
            activity.desc = `Rejected for requesting ${editModalData.email} to be a ${editModalData.status.requested === 1 ? 'admin' : editModalData.status.requested === 2 ? 'viewer' : 'author' } by ${this.props.user.email}(admin)`
            activity.date = date;

            this.setState({
                activityRole: activity,
            }, () => {
                API.postDataApi('activity', activity)
            })

             API.editDataApi(pathAPI, editModalData.id, editModalData).then( result => {
                this.handleRefresh();
                this.setState(prevState => ({
                    modalRespone: !prevState.modalRespone 
                }))
                notifyError(`Requesting ${editModalData.email} rejected`);              
            })
        } else if (type === 'accepted'){
            editModalDataNew.status.name = 'Accepted';
            editModalDataNew.role = statusEditModal.requested;
            editModalDataNew.status.requested = '';
            editModalDataNew.status.respondent = this.props.user.email;
            editModalDataNew.status.dates_response = date;
            editModalDataNew.show_announcement = true;
            
            const activity = this.state.activityRole;
            activity.id = date.getTime();
            activity.desc = `Accepted for requesting ${editModalData.email} to be a ${editModalData.status.requested === 1 ? 'admin' : editModalData.status.requested === 2 ? 'viewer' : 'author' } by ${this.props.user.email}(admin)`
            activity.date = date;

            this.setState({
                activityRole: activity,
            }, () => {
                API.postDataApi('activity', activity)
            })
            
            API.editDataApi(pathAPI, editModalData.id, editModalData).then( result => {
                this.handleRefresh();
                this.setState(prevState => ({
                    modalRespone: !prevState.modalRespone 
                }))
                notifySuccess(`Requesting ${editModalData.email} Accepted`);
            })
        }
    }

    handleRefresh = () => {
        roleStatusFilter('');   
        roleFilter('');
        this.getData(); 
    }

    requestRole = (value) => {
        if(value.target.name === 'back'){
            const dataUser = this.props.user;
            dataUser.role = 1;
            dataUser.camouflage = undefined;
            API.editDataApi(pathAPI, dataUser.id, dataUser).then( result => {
                this.handleRefresh();
                window.location.reload() 
            })
        } else {
            const requested = value.target.name === 'admin' ? 1 : value.target.name === 'author' ? 2 : value.target.name === 'default' ? 3 : '' ;
            const name = value.target.name;
            const { role, camouflage} = this.props.user;
            const date = new Date();
            this.setState(prevState => ({
                modalRequest: !prevState.modalRequest,
                status: '',
            }));
    
            if(name){
                if(name === 'send'){
                    const getData = this.state.status;
                    const { requestingModal } = this.state
                    const activity = this.state.activityRole;
                    const timestamp = new Date();
                    
                    if(role !== 1 && camouflage === undefined ){
                        activity.id = timestamp.getTime();
                        activity.desc = `Requested ${getData.email} to be a ${getData.status.requested === 1 ? 'Admin' : getData.status.requested === 2 ? 'Viewer' : 'Author' }`
                        activity.date = timestamp;
                        
                        this.setState({
                            activityRole: activity,
                        }, () => {
                            API.postDataApi('activity', activity)
                        })
        
                        getData.status.name = 'Requested';
        
                        API.editDataApi(pathAPI, getData.id, getData).then( result => {
                            this.handleRefresh();
                            notifySuccess(`Requesting sent`);
                        })
                    } else {
                        getData.camouflage = true;
                        getData.role = requestingModal;
                        API.editDataApi(pathAPI, getData.id, getData).then( result => {
                            this.handleRefresh();
                            window.location.reload();
                        })
                    }
    
                } else {
                    const statusNew = this.props.user;
                    if(role !== 1){
                        statusNew.dates_request = date;
                        statusNew.status.requested = requested;
                        this.setState({
                            status: statusNew,
                            requestingModal: requested
                        }, () => {
                            this.state.status.name = 'Requested';
                        })
                    } else {
                        // statusNew.camouflage = true;
                        this.setState({
                            status: statusNew,
                            requestingModal: requested
                        })
                    }
                }
            }
        }
    }

    requestRoleClose = () => {
        this.setState(prevState => ({
            titleModal: '',
            status: '',
          }));
    }

    handleRequested = (value) => {
        this.setState(prevState => ({
            modalRequest: !prevState.modalRequest,
            requested: true
        }));
    }

    toggleCancelRequest = () => {
        this.setState({
          requestCancel: !this.state.requestCancel,
          closeAll: false
        });
      }

    alertAnnouncement = () => {
        const user = this.props.user
        user.show_announcement = false
        API.editDataApi(pathAPI, user.id, user)
        this.setState({
            alertAnnouncement: false,
        })
    }

    toggleAll = () => {
        this.setState({
          requestCancel: !this.state.requestCancel,
          closeAll: true
        });
      }

    render() {
        const columns = this.state.headerTableRole;
        const data = this.state.dataColumns;
        const { role, camouflage, status } = this.props.user;

        if(this.state.loadingRole){
            return (<Loading isLoading={this.state.loadingRole} />)
        }

        return(
            <div onScroll={this.handleScroll}>
                <div className="judul"><h3>Role Permission</h3></div>
                <CardGroup className="cardGroup">
                    <Card className="cardBody" inverse color="success" >
                        <CardHeader tag="h5">Admin</CardHeader>
                        <CardBody>
                            <CardText>{this.state.totalAdmin} Users</CardText>
                        </CardBody>
                        <CardFooter className="text-muted">
                            {/* <Button color="primary" size="sm" onClick={this.toggleCollapse}><i className=" fa fa-eye" /></Button> */}
                        </CardFooter>
                    </Card>
                    <Card className="cardBody" inverse color="warning" >
                        <CardHeader tag="h5">Author</CardHeader>
                        <CardBody>
                            <CardText>{this.state.totalAuthor} Users</CardText>
                        </CardBody>
                        <CardFooter className="text-muted">
                            {/* <Button color="primary" size="sm"><i className=" fa fa-eye" /></Button> */}
                        </CardFooter>
                    </Card>
                    <Card className="cardBody" inverse color="danger">
                        <CardHeader tag="h5">Viewer</CardHeader>
                        <CardBody>
                            <CardText>{this.state.totalViewer} Users</CardText>
                        </CardBody>
                        <CardFooter className="text-muted">
                            {/* <Button color="primary" size="sm"><i className=" fa fa-eye" /></Button>                         */}
                        </CardFooter>
                    </Card>
                </CardGroup>
                {this.props.user.show_announcement ? 
                    <UncontrolledAlert color={this.props.user.status.name === 'Accepted' ? 'success' : 'dark'} style={{width: '80%', marginLeft: '10%', marginTop: '2%', fontStyle: 'italic'}} toggle={this.alertAnnouncement} isOpen={this.state.alertAnnouncement} >
                        Your request be an {this.props.user.role === 1 ? 'admin' : this.props.user.role === 2 ? 'author' : 'viewer' } is {this.props.user.status.name} by {this.props.user.status.respondent}(admin)
                    </UncontrolledAlert>
                :
                ''
                }
                {camouflage && role !== 1 ? 
                    <Alert color='warning' style={{width: '80%', marginLeft: '10%', marginTop: '2%', fontStyle: 'italic'}} >
                        camouflaging as {role === 2 ? 'author' : 'viewer' }
                    </Alert>
                :
                ''
                }
                <Alert color='secondary' style={role === 1 || camouflage === true ? {width: '80%', marginLeft: '10%', marginTop: '2%', backgroundColor: '#28a745', color: '#fff', fontStyle: 'italic'} : role === 2 ? {width: '80%', marginLeft: '10%', marginTop: '2%', backgroundColor: '#ffc107', color: '#fff', fontStyle: 'italic'} : {width: '80%', marginLeft: '10%', marginTop: '2%', backgroundColor: '#d53343', color: '#fff', fontStyle: 'italic'}}>
                    {role === 1 && status.name !== 'Requested' || camouflage === true ? 'You as admin --- Camouflage as other role ?'
                    : role === 2 && status.name !== 'Requested' ? 'You as author --- Request change role ?' : role === 2 && status.name === 'Requested'  ? `You as author --- on requesting to be a ${status.requested === 1 ? 'admin' : status.requested === 2 ? 'author' : 'viewer' }`
                    : role === 3 && status.name !== 'Requested' ? 'You as viewer --- Request change role ?' : role === 3 && status.name === 'Requested'  ? `You as viewer --- on requesting to be a ${status.requested === 1 ? 'admin' : status.requested === 2 ? 'author' : 'viewer' }` : '' }  
                    <Dropdown isOpen={this.state.dropdownRequest} toggle={this.toggleRequest} color='primary' style={{width: '20%', height: '5%', display: 'inline', fontSize: '13px', marginLeft: '2%'}}>
                        <DropdownToggle caret>
                            Select Role ..
                        </DropdownToggle>
                        <DropdownMenu>
                            {role === 1 && camouflage === undefined ?
                            <Fragment>
                                <DropdownItem name='default' onClick={this.requestRole}>Viewer</DropdownItem>
                                <DropdownItem name='author' onClick={this.requestRole}>Author</DropdownItem>
                            </Fragment>
                            :
                            role === 2 && status.name !== 'Requested' && camouflage ?
                            <Fragment>
                                <DropdownItem name='back' onClick={this.requestRole}>Back to Admin</DropdownItem>
                                <DropdownItem name='default' onClick={this.requestRole}>Viewer</DropdownItem>
                            </Fragment>
                            :
                            role === 2 && status.name !== 'Requested' && camouflage === undefined ?
                            <Fragment>
                                <DropdownItem name='admin' onClick={this.requestRole}>Admin</DropdownItem>
                                <DropdownItem name='default' onClick={this.requestRole}>Viewer</DropdownItem>
                            </Fragment>
                            :
                            role === 3 && status.name !== 'Requested' && camouflage === true ?
                            <Fragment>
                                <DropdownItem name='back' onClick={this.requestRole}>Back to Admin</DropdownItem>
                                <DropdownItem name='author' onClick={this.requestRole}>Author</DropdownItem>
                            </Fragment>
                            :
                            role === 3 && status.name !== 'Requested' && camouflage === undefined ?
                            <Fragment>
                                <DropdownItem name='author' onClick={this.requestRole}>Author</DropdownItem>
                                <DropdownItem name='admin' onClick={this.requestRole}>Admin</DropdownItem>                        
                            </Fragment>
                            :
                            <Fragment>
                                <DropdownItem name='View Request' onClick={this.handleRequested}>View Request</DropdownItem>            
                            </Fragment>
                            }
                        </DropdownMenu>
                    </Dropdown>
                </Alert>
                <div className="container">
                    <Collapse isOpen={this.state.collapse} style={{marginBottom: '15px'}}>
                        <Card>
                            <CardBody>
                            Anim pariatur cliche reprehenderit,
                            enim eiusmod high life accusamus terry richardson ad squid. Nihil
                            anim keffiyeh helvetica, craft beer labore wes anderson cred
                            nesciunt sapiente ea proident.
                            </CardBody>
                        </Card>
                    </Collapse>
                    <header className="d-flex justify-content-between flex-wrap">
                        <h5 className="lh-ms">
                        {this.state.totalRequesting} Total Role Requesting
                        </h5>
                        <Button color="info" size="sm"onClick={this.handleRefresh} className='buttonadd'>Refresh Table</Button>
                    </header>
                    <br />
                    <Table
                        headerColumns={columns} 
                        dataColumns={data}
                    />
                </div>

                {/* Modal Request */}
                <Modal isOpen={this.state.modalRequest} toggle={this.requestRole} onClosed={this.requestRoleClose}>
                    <ModalHeader toggle={this.requestRole}>Request Role</ModalHeader>          
                    <ModalBody style={{backgroundColor:'#f9f9f9'}}>
                        <ListGroup>
                            <ListGroupItem>
                                <ListGroupItemHeading>Email</ListGroupItemHeading>
                                <ListGroupItemText>
                                    {this.props.user.email}
                                </ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem>
                                <ListGroupItemHeading>Role as</ListGroupItemHeading>
                                <ListGroupItemText>
                                     {role === 1 || camouflage ? 'Admin' : role === 2 ? 'Author' : 'Viewer' }
                                </ListGroupItemText>
                            </ListGroupItem>
                            {camouflage ? 
                                <ListGroupItem>
                                    <ListGroupItemHeading>Camouflage now</ListGroupItemHeading>
                                    <ListGroupItemText>
                                     {role === 1 ? 'Admin' : role === 2 ? 'Author' : 'Viewer' }
                                    </ListGroupItemText>
                                </ListGroupItem>
                            :
                            
                            ''
                            }
                            <ListGroupItem>
                                <ListGroupItemHeading>{role === 1 || camouflage ? 'Camouflage ' : 'Request '} {camouflage ? 'change' : 'as'}</ListGroupItemHeading>
                                <ListGroupItemText>
                                     {this.state.requestingModal === 1 ? 'Admin' : this.state.requestingModal === 2 ? 'Author' : 'Viewer' }
                                </ListGroupItemText>
                            </ListGroupItem>
                        </ListGroup>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.requested ?
                            this.props.user.status.name
                        :
                            <Fragment>
                                <Button color="link" onClick={this.requestRole} name='' size="sm">Cancel</Button>
                                <Button color="primary" onClick={this.requestRole} name='send' size="sm">{role === 1 || camouflage ? 'Camouflage' : 'Send Request' }</Button>
                            </Fragment>
                        }
                    </ModalFooter>
                </Modal>

                {/* Modal Admin */}
                <Modal isOpen={this.state.editModalOpen} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{this.state.titleModal ? 'Edit' : 'View'} Role</ModalHeader>          
                    <ModalBody style={{backgroundColor:'#f9f9f9'}}>
                        <ListGroup>
                            <ListGroupItem>
                                <ListGroupItemHeading>Username</ListGroupItemHeading>
                                <ListGroupItemText>
                                    {this.state.editModalData.username}
                                </ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem>
                                <ListGroupItemHeading>Email</ListGroupItemHeading>
                                <ListGroupItemText>
                                    {this.state.editModalData.email}
                                </ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col md={6} style={{padding: '0px'}}>
                                        <ListGroupItemHeading style={{textAlign:'center', paddingLeft: '0px', marginLeft: '0px'}}>Role As</ListGroupItemHeading>
                                        <ListGroupItemText style={{textAlign:'center', paddingLeft: '0px', marginLeft: '0px', fontSize:'12px'}}>
                                            {this.state.editModalData.role === 1 ? 'Admin' :
                                            this.state.editModalData.role === 2 ? 'Author' : 
                                            'Viewer'}
                                        </ListGroupItemText>
                                    </Col>
                                    <Col md={6} style={{padding: '0px'}}>
                                        <ListGroupItemHeading style={{textAlign:'center', paddingLeft: '0px', marginLeft: '0px'}}>Role Status</ListGroupItemHeading>
                                        <ListGroupItemText style={{textAlign:'center', paddingLeft: '0px', marginLeft: '0px', fontSize:'12px'}}>
                                            {this.state.statusEditModal.name === 'Rejected' ? `Requesting ${this.state.statusEditModal.requested === 1 ? 'Admin' : this.state.statusEditModal.requested === 2 ? 'Author' : 'Viewer' } Rejected ` : this.state.statusEditModal.name}
                                        </ListGroupItemText>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                            {this.state.statusEditModal.name === 'Accepted' || this.state.statusEditModal.name === 'Rejected'  ? 
                                <ListGroupItem>
                                    <Row>
                                        <Col md={6} style={{padding: '0px'}}>
                                            <ListGroupItemHeading style={{textAlign:'center', paddingLeft: '0px', marginLeft: '0px'}}>Response by</ListGroupItemHeading>
                                            <ListGroupItemText style={{textAlign:'center', paddingLeft: '0px', marginLeft: '0px', fontSize:'12px'}}>
                                                {this.state.statusEditModal.respondent} (admin)                                            
                                            </ListGroupItemText>
                                        </Col>
                                        <Col md={6} style={{padding: '0px'}}>
                                            <ListGroupItemHeading style={{textAlign:'center', paddingLeft: '0px', marginLeft: '0px'}}>Response date</ListGroupItemHeading>
                                            <ListGroupItemText style={{textAlign:'center', paddingLeft: '0px', marginLeft: '0px', fontSize:'12px'}}>
                                                {ParsedDateInd(this.state.statusEditModal.dates_reponse)}                                 
                                            </ListGroupItemText>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            :
                            this.state.statusEditModal.name === 'Requested' ?
                            <ListGroupItem>
                                <Row>
                                    <Col md={6} style={{padding: '0px'}}>
                                        <ListGroupItemHeading style={{textAlign:'center', paddingLeft: '0px', marginLeft: '0px'}}>Requsting as</ListGroupItemHeading>
                                        <ListGroupItemText style={{textAlign:'center', paddingLeft: '0px', marginLeft: '0px', fontSize:'12px'}}>
                                            {this.state.statusEditModal.requested === 1 ? 'Admin' :
                                            this.state.statusEditModal.requested === 2 ? 'Author' : 
                                            'Viewer'}                                           
                                        </ListGroupItemText>
                                    </Col>
                                    <Col md={6} style={{padding: '0px'}}>
                                        <ListGroupItemHeading style={{textAlign:'center', paddingLeft: '0px', marginLeft: '0px'}}>Requested date</ListGroupItemHeading>
                                        <ListGroupItemText style={{textAlign:'center', paddingLeft: '0px', marginLeft: '0px', fontSize:'12px'}}>
                                            {ParsedDateInd(this.state.editModalData.dates_request)}                                                                                                                   
                                        </ListGroupItemText>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                            :
                                ''
                            }
                            {this.state.statusEditModal.name !== 'Requested' ?
                                <ListGroupItem style={{paddingLeft: '0px'}}>
                                    <ListGroupItemText>
                                        <Button color="primary" size="sm" style={{marginTop: '10px', width: '100%'}} onClick={this.toggleResponeEdit}>
                                            Edit Role
                                        </Button>
                                        <Modal isOpen={this.state.modalEditRespone} toggle={this.toggleResponeEdit}>
                                                <ModalHeader>Response Request</ModalHeader>
                                                <ModalBody> 
                                                    {this.state.editModalData.email} Role As {this.state.editModalData.role === 1 ? 'Admin' :
                                                    this.state.editModalData.role === 2 ? 'Author' : 
                                                    'Viewer'}
                                                    <br />
                                                    <Label for="exampleSelect">Change role to be a</Label>
                                                    <Input type="select" name="select" id="exampleSelect" value={this.props.arrayOfOptionValues} defaultValue='' onClick={this.editRoleSubmit}>
                                                        {this.state.editModalData.role === 1 ?
                                                            <Fragment>
                                                                <option value='' disabled>Select Role...</option>
                                                                <option value={2}>Author</option>
                                                                <option value={3}>Viewer</option>
                                                            </Fragment>
                                                        : this.state.editModalData.role === 2 ?
                                                            <Fragment>
                                                                <option value='' disabled>Select Role...</option>
                                                                <option value={1}>Admin</option>
                                                                <option value={3}>Viewer</option>
                                                            </Fragment>
                                                        :
                                                            <Fragment>
                                                                <option value='' disabled>Select Role...</option>
                                                                <option value={1}>Admin</option>
                                                                <option value={2}>Author</option>
                                                            </Fragment>
                                                        }
                                                    </Input>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="link" name='cancel' size="sm" onClick={this.toggleResponeEdit}>Cancel</Button>
                                                    <Button color="primary" name='submit' size="sm" onClick={this.toggleResponeEdit }>Save</Button>
                                                </ModalFooter>
                                        </Modal>
                                    </ListGroupItemText>
                                </ListGroupItem>
                            : 
                                <ListGroupItem style={{paddingLeft: '0px'}}>
                                        <ListGroupItemText>
                                            <Button color="warning" size="sm" onClick={this.toggleRespone} style={{marginTop: '10px', width: '100%'}}>
                                                Response Requesting
                                            </Button>
                                            <Modal isOpen={this.state.modalRespone} toggle={this.toggleRespone}>
                                                <ModalHeader>Response Request</ModalHeader>
                                                <ModalBody> {this.state.editModalData.email} requesting to be a {this.state.statusEditModal.requested === 1 ? 'admin' :
                                                    this.state.statusEditModal.requested === 2 ? 'author' : 
                                                    'viewer'}    
                                                    </ModalBody>
                                                <ModalFooter>
                                                    <Button color="link" name='cancel' size="sm" onClick={this.toggleRespone}>Cancel</Button>
                                                    <Button outline color="danger" name='rejected' size="sm" onClick={this.handlerespone}>Rejected</Button>
                                                    <Button color="primary" name='accepted' size="sm" onClick={this.handlerespone}>Accepted</Button>
                                                </ModalFooter>
                                            </Modal>
                                        </ListGroupItemText>
                                    </ListGroupItem>
                            }                            
                        </ListGroup>
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