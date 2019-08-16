import React, { Component, Fragment } from 'react';
import { Loading} from '../../core/Util';
import API from '../../../service';
import moment from 'moment-timezone';
import { Button, Row, Form, FormGroup, Label, Input, Collapse, Col, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { BeatLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import Viewer from "react-viewer";
import classnames from 'classnames';
import FreeScrollBar from 'react-free-scrollbar';
import DatePicker from "react-datepicker";
import MaskedInput from 'react-text-mask';
import KTP from '../../../images/ktp.jpeg';
import EDD from '../../../images/edd.jpeg';
import SIGNATURE from '../../../images/signature.jpg';
import { addYears } from 'date-fns/esm';

import './verification.css';
import "react-datepicker/dist/react-datepicker.css";
import "react-viewer/dist/index.css";

const pathAPI = 'investor';
const ParsedDateInd = date => date ? moment.utc(date).lang('id').tz('Asia/Jakarta').format('DD MMM YYYY') : '';

export default class Verification extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: '',
            loadingVerification: true,
            visibleKTP: false,
            visibleEDD: false,
            disabledInput: true,
            visibleSignature: false,
            eddDisable: false,
            signatureDisable: false,
            startDate: '',
            loaderSave: false,
            images : {
                ktp: [{
                  src: KTP,
                  alt: "KTP Picture",   
                }],
                edd: [{
                    src: EDD,
                    alt: "EDD Picture",   
                  }],
                signature: [{
                    src:SIGNATURE,
                    alt: "Signature Picture",   
                  }]
            },
            ktp:{
                id_number: '',
                full_name: '',
                address: '',
                place_birth: '',
                date_birth: '',
                gender: '',
                religion: '',
                martial_status: '',
                occupation: ''
            },
            activeTab: '1'
        }
    }

    componentDidMount(){
        this.getData();
        setTimeout(() => this.loading(), 1500);
    }

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
      }

    loading = () => {
        this.setState({
            loadingVerification: false
        })
    }

    getData = () => {
        const user = window.location.pathname.split('/investor/user/')[1]        
        API.getDataApi(pathAPI).then( result => {
            const dataUser = result.data.filter(results => results.email === user)[0]
            this.setState({
                data: {...dataUser}
            })
            if(dataUser.ktp){
                this.setState({
                    ktp: dataUser.ktp
                })
            }
        })
    }

    handleOnChange = (event) => {
        const { ktp, data } = this.state
        const ktpNew = {...ktp};
        const dataNew ={...data}
        
        if(event.target !== false){
            if(event.target.name === 'edd' || event.target.name === 'signature'){
                const alert = window.confirm(event.target.value === 'true' ? `is ${event.target.name} photo the same as ktp?` : `is ${event.target.name} photo the different as ktp?` );
                if(alert){
                    dataNew[event.target.name] = event.target.value;
                    this.setState({
                        data: dataNew 
                    }, ()=>{
                        if(dataNew.edd === "true" && dataNew.signature === "true" && dataNew.status_ktp){
                            dataNew.status = true;
                            this.setState({
                                data: dataNew
                            }, () => {
                                API.editDataApi(pathAPI, dataNew.id, dataNew);
                            })
                        } else {
                            API.editDataApi(pathAPI, dataNew.id, dataNew);
                        }
                    })
                    if(event.target.name === 'edd'){
                        this.setState({
                            eddDisable: true
                        })
                    } else {
                        this.setState({
                            signatureDisable: true
                        })
                    }
                } 
    
            }

        }

        if(event.target){
            if(event.target.name === 'full_name'){
                const value = event.target.value
                let input = value.replace(/[0-9]/g, "");
                console.log(input)
                ktpNew[event.target.name] = input;
                    this.setState({
                        ktp: ktpNew
                    })
            } else {
                ktpNew[event.target.name] = event.target.value;
                this.setState({
                    ktp: ktpNew
                })
            }
        } else {
            ktpNew.date_birth = event;
            this.setState({
                ktp: ktpNew,
                startDate: event
            })
        }
    }

    handleOnchangeDate = (event) => {
        const { ktp, data } = this.state
        const ktpNew = {...ktp};
        ktpNew.date_birth = event;
            this.setState({
                ktp: ktpNew,
                startDate: event
            })
    }

    handleSubmit = (event) => {
        const { data, ktp } = this.state;

        this.setState({
            loaderSave: true
        })
        
        setTimeout(()=>{
            this.setState({
                loaderSave:false,
                disabledInput: true
            });
            toast.success("Data Successfully Added")
        },1000)

        if(event.target.name === "submit"){
            const dataNew = {...data}
            dataNew.ktp = ktp;
            const {address, date_birth, full_name, gender, id_number, martial_status, occupation, place_birth, religion } = dataNew.ktp
            if(address && date_birth && full_name && gender && id_number && martial_status && occupation && place_birth && religion){
                dataNew.status_ktp = true;
            } else {
                dataNew.status_ktp = false;
            }

            this.setState({
                data: dataNew
            })
            API.editDataApi(pathAPI, dataNew.id, dataNew)
        }
    }

    handleBack = () => {
        document.location.replace(`/investor`)
    }


    render(){
        const { loadingVerification, data, visibleKTP,visibleEDD, visibleSignature, images, disabledInput, startDate, loaderSave, ktp, eddDisable, signatureDisable  } = this.state;
        if(loadingVerification){
            return (<Loading isLoading={loadingVerification} />)
        }
        return(
            <div>
                <div className="judul">
                    <Button style={{borderRadius:"15px", width: '122px'}} size="sm" onClick={this.handleBack}><i className='fa fa-arrow-left' /> back to table</Button>
                    <h3 style={{marginTop: '16px'}}>Investor Verification</h3>
                </div>
                <div className="container">
                    <h5>Email : {data.email} </h5>
                    <p>Verification Code : {data.id} </p>
                    <Row className="rowNew">
                        <Col xs="6" sm="5" style={{paddingTop:'2%', height: '90000px !important'}}>
                            <Button
                                color="primary"
                                size="sm"
                                outline
                                onClick={() => {
                                    this.setState({ visibleKTP: !this.state.visibleKTP });
                                }}
                                >{visibleKTP ? 'Hide' : 'Show'} KTP </Button>
                                <Collapse isOpen={visibleKTP}>
                                    <div
                                        id="containerKTP"
                                        style={{
                                            marginTop: 24,
                                            height: 400
                                        }}
                                        >
                                        Ktp Picture
                                    </div>
                                </Collapse>
                                <hr />
                            <Button
                                color="primary"
                                size="sm"
                                outline
                                onClick={() => {
                                    this.setState({ visibleEDD: !this.state.visibleEDD });
                                }}
                                >{visibleEDD ? 'Hide' : 'Show'} EDD </Button>
                                <Collapse isOpen={visibleEDD}>
                                    <div
                                        id="containerEDD"
                                        style={{
                                            marginTop: 24,
                                            height: 400
                                        }}
                                        >
                                        EDD Picture
                                    </div>
                                </Collapse>
                                <hr />                            
                            <Button
                                color="primary"
                                size="sm"
                                outline
                                onClick={() => {
                                    this.setState({ visibleSignature: !this.state.visibleSignature });
                                }}
                                >{visibleSignature ? 'Hide' : 'Show'} Signature </Button>
                                <Collapse isOpen={visibleSignature}>
                                    <div
                                        id="containerSignature"
                                        style={{
                                            marginTop: 24,
                                            height: 400
                                        }}
                                        >
                                        Signature Picture
                                    </div>
                                </Collapse>
                            <br />
                            <br />
                            <Viewer
                                visible={visibleKTP}
                                onClose={() => {
                                    this.setState({ visible: false });
                                }}
                                noClose
                                noNavbar
                                noImgDetails
                                downloadable
                                images={images.ktp}
                                container={document.getElementById("containerKTP")}
                            />
                            <Viewer
                                visible={visibleEDD}
                                onClose={() => {
                                    this.setState({ visibleEDD: false });
                                }}
                                noClose
                                noNavbar
                                noImgDetails
                                downloadable
                                images={images.edd}
                                container={document.getElementById("containerEDD")}
                            />
                            <Viewer
                                visible={visibleSignature}
                                onClose={() => {
                                    this.setState({ visibleSignature: false });
                                }}
                                noClose
                                noNavbar
                                noImgDetails
                                downloadable
                                images={images.signature}
                                container={document.getElementById("containerSignature")}
                            />
                        </Col>
                        <Col xs="auto"></Col>
                        <Col xs="6">
                            <div className="dataContainer">
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                        className={classnames({ active: this.state.activeTab === '1' })}
                                        onClick={() => { this.toggle('1'); }}
                                        >
                                        KTP Input
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                        className={classnames({ active: this.state.activeTab === '2' })}
                                        onClick={() => { this.toggle('2'); }}
                                        >
                                        Subcription Investor
                                        </NavLink>
                                    </NavItem>
                                    </Nav>
                                    <TabContent activeTab={this.state.activeTab}>
                                        <TabPane tabId="1" style={{height:"500px"}}>
                                            <div style={{width: '100%', height: '380px'}}>
                                                <Form style={{padding: "4% 5% 1%", borderTop:'1px solid #f2f2f2', borderBottom:'1px solid #f2f2f2'}}>
                                                    <FormGroup>
                                                        <h6 style={{display:'inline'}}>KTP Verification</h6>
                                                        { loaderSave ? 
                                                            <div style={{float:"right", marginTop: '4%'}}>
                                                                <BeatLoader
                                                                    className={'loading'}
                                                                    width={1150}
                                                                    height={8}
                                                                    color={'#007bff'}
                                                                    loading={loaderSave}
                                                                />
                                                            </div>

                                                        : 
                                                        
                                                        disabledInput ? 
                                                                <Button color="primary" size="sm" name="edit" onClick={()=>{this.setState({disabledInput: false })}}
                                                                    style={{float: 'right', width: '20%', marginTop: '3%'}}
                                                                    >Edit</Button>
                                                        :
                                                                <Button color="primary" size="sm" name="submit" onClick={this.handleSubmit}
                                                                    style={{float: 'right', width: '20%', marginTop: '3%'}}                                                                
                                                                    >Save</Button>
                                                        }
                                                        <p>Status : {data.status_ktp ? 'Complete' : 'Not-Complete'} </p>
                                                    </FormGroup>
                                                </Form>
                                                <FreeScrollBar autohide={true}>
                                                    <Form style={{padding: "5%", paddingTop: "3%", border: '1px solid #f2f2f2', borderTop: '0px'}}>
                                                        <FormGroup>
                                                            <Label for="exampleEmail">ID Number</Label>
                                                            <MaskedInput className='form-control' mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]} guide name="id_number" 
                                                            onChange={this.handleOnChange} disabled={disabledInput}
                                                            defaultValue={ktp.id_number} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="exampleEmail">Full Name</Label>
                                                            <Input type="text" name="full_name" value={ktp.full_name}  disabled={disabledInput} onChange={this.handleOnChange}/>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="exampleEmail">Address</Label>
                                                            <Input type="text" name="address" defaultValue={ktp.address} disabled={disabledInput} onChange={this.handleOnChange} />
                                                        </FormGroup>
                                                        <Row form>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <Label for="exampleEmail">Date of birth</Label>
                                                                    <DatePicker
                                                                        locale="id"
                                                                        selected={ ktp.date_birth ? ktp.date_birth : startDate}
                                                                        onChange={this.handleOnchangeDate}
                                                                        placeholderText='Select Date..'
                                                                        disabled={disabledInput}
                                                                        maxDate={addYears(new Date(), -17)}
                                                                        minDate={addYears(new Date(), -70)}
                                                                        showMonthYearDropdown
                                                                        scrollableMonthYearDropdown
                                                                        dropdownMode= {'scroll'}
                                                                        className='form-control' 
                                                                        dateFormat="d MMMM yyyy"
                                                                        name=''
                                                                    />
                                                                    {/* <Input type="text" name="date_birth" disabled={disabledInput} onChange={this.handleOnChange} /> */}
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <Label for="exampleEmail">Place of birth</Label>
                                                                    <Input type="text" name="place_birth" disabled={disabledInput} defaultValue={ktp.place_birth} onChange={this.handleOnChange} />
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row form>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <Label for="exampleSelect">Gender</Label>
                                                                    <Input type="select" name="gender" defaultValue={ktp.gender} id="exampleSelect" disabled={disabledInput} onChange={this.handleOnChange}>
                                                                        <option value='' disabled>Choose ..</option>
                                                                        <option value='Male'>Male</option>
                                                                        <option value='Female'>Female</option>
                                                                    </Input>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <Label for="exampleSelect">Religion</Label>
                                                                    <Input type="select" name="religion" defaultValue={ktp.religion} id="exampleSelect" disabled={disabledInput} onChange={this.handleOnChange}>
                                                                        <option value='' disabled>Choose ..</option>
                                                                        <option value='Islam'>Islam</option>
                                                                        <option value='Protestan'>Protestan</option>
                                                                        <option value='Catholic'>Catholic</option>
                                                                        <option value='Hinduism'>Hinduism</option>
                                                                        <option value='Budhism'>Budhism</option>
                                                                        <option value='Confucianism'>Confucianism</option>
                                                                    </Input>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <Row form>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <Label for="exampleSelect">Martial status</Label>
                                                                    <Input type="select" name="martial_status" defaultValue={ktp.martial_status} id="exampleSelect" disabled={disabledInput} onChange={this.handleOnChange}>
                                                                        <option value='' disabled>Choose ..</option>
                                                                        <option value='Single'>Single</option>
                                                                        <option value='Married'>Married</option>
                                                                        <option value='Divorce'>Divorce</option>
                                                                    </Input>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <Label for="exampleSelect">Occupation</Label>
                                                                    <Input type="select" name="occupation" defaultValue={ktp.occupation} id="exampleSelect" disabled={disabledInput} onChange={this.handleOnChange}>
                                                                        <option value='' disabled>Choose ..</option>
                                                                        <option value='Guru'>Guru</option>
                                                                        <option value='IRT'>IRT</option>
                                                                        <option value='Pegawai Swasta'>Pegawai Swasta</option>
                                                                        <option value='Pelajar'>Pelajar</option>
                                                                        <option value='Pengusaha'>Pengusaha</option>
                                                                        <option value='Pensiunan'>Pensiunan</option>
                                                                        <option value='PNS'>PNS</option>
                                                                        <option value='TNI/Polisi'>TNI/Polisi</option>
                                                                        <option value='Other'>Other</option>
                                                                    </Input>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                    </Form>
                                                </FreeScrollBar>
                                            </div>
                                        </TabPane>
                                        <TabPane tabId="2" style={{height:"500px"}}>
                                            <div style={{width: '100%', height: '380px'}}>
                                                <Form style={{padding: "4% 5% 1%", borderTop:'1px solid #f2f2f2', borderBottom:'1px solid #f2f2f2'}}>
                                                    <FormGroup>
                                                        <h6>Subcription Investor Verification</h6>
                                                        <p style={{display:'inline'}}>Status Verification :</p>
                                                        <p style={data.status ? {float:'right', marginRight: '136px'} : {color:'red', float:'right', marginRight: '105px'}}>{data.status ? 'Verification' : 'Not-Verification'} </p>
                                                        {data.status ? '' : <p style={{marginBottom: '2px'}}>Status Description :</p>}
                                                        {data.status ? '' : 
                                                            <div style={{fontSize: '12px', marginLeft: '23px'}}>
                                                                {data.status_ktp ? '' : <p style={{marginBottom:'2px'}}>KTP Not Complete</p>}
                                                                {data.edd === 'true' ? '' : data.edd === 'False' ? <p style={{marginBottom:'2px'}}>EDD Rejected</p> : <p style={{marginBottom:'2px'}}>EDD Not-Verification</p>}
                                                                {data.signature === 'true' ? '' : data.signature === 'False' ? <p style={{marginBottom:'2px'}}>Signature Rejected</p> : <p style={{marginBottom:'2px'}}>Signature Not-Verification</p>}
                                                            </div>
                                                        }
                                                    </FormGroup>
                                                </Form>
                                                <FreeScrollBar autohide={true}>
                                                    <Form style={{padding: "5%", paddingTop: "3%", border: '1px solid #f2f2f2', borderTop: '0px'}}>
                                                        <Row form>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <Label for="exampleSelect">Signature</Label>
                                                                    <Input type="select" name="signature" defaultValue={data.signature} disabled={signatureDisable} id="exampleSelect" onChange={this.handleOnChange}>
                                                                        <option value='' disabled>Choose ..</option>
                                                                        <option value='true'>Verification</option>
                                                                        <option value='false'>Reject</option>
                                                                    </Input>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={6}>
                                                                <FormGroup>
                                                                    <Label for="exampleSelect">EDD</Label>
                                                                    <Input type="select" name="edd" defaultValue={data.edd} disabled={eddDisable} id="exampleSelect" onChange={this.handleOnChange}>
                                                                        <option value='' disabled>Choose ..</option>
                                                                        <option value='true'>Verification</option>
                                                                        <option value='false'>Reject</option>
                                                                    </Input>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={12}>
                                                                <hr />
                                                                <h6 style={{textAlign: 'center'}}>KYC Data</h6>
                                                                <hr />
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                        <h6>E-mail</h6>
                                                                        <h6>Phone</h6>
                                                                        <h6>Date register</h6>
                                                                        <h6>Study</h6>
                                                                        <h6>Income level</h6>
                                                                        <h6>Source of found</h6>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={1}>
                                                                <FormGroup>
                                                                        <h6>:</h6>
                                                                        <h6>:</h6>
                                                                        <h6>:</h6>
                                                                        <h6>:</h6>
                                                                        <h6>:</h6>
                                                                        <h6>:</h6>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={7}>
                                                                <FormGroup style={{textAlign:'right'}}>
                                                                        <p style={{marginBottom:'3px'}}>{data.email}</p>
                                                                        <p style={{marginBottom:'3px'}}>{data.phone}</p>
                                                                        <p style={{marginBottom:'3px'}}>{ParsedDateInd(data.date_register)}</p>
                                                                        <p style={{marginBottom:'3px'}}>{data.study}</p>
                                                                        <p style={{marginBottom:'3px'}}>{data.income === 'A' ? "< 10" : data.income === 'B' ? "< 50" : ">50" } million / year</p>
                                                                        <p style={{marginBottom:'3px'}}>{data.source_income === 'Gaji' ? 'Working salary' : 'Parents'}</p>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={12}>
                                                                <hr />
                                                                    <h6 style={{textAlign: 'center'}}>Payment Data</h6>
                                                                <hr />
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                        <h6>Bank Name</h6>
                                                                        <h6>Payment name</h6>
                                                                        <br />
                                                                        <h6>Payment A/C</h6>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={1}>
                                                                <FormGroup>
                                                                        <h6>:</h6>
                                                                        <h6>:</h6>
                                                                        <br />
                                                                        <h6>:</h6>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={7}>
                                                                <FormGroup style={{textAlign:'right'}}>
                                                                        <p style={{marginBottom:'3px'}}>{data.bank_name}</p>
                                                                        <p style={{marginBottom:'3px'}}>{data.name}</p>
                                                                        <p style={{marginBottom:'3px'}}>{data.no_rekening}</p>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={12}>
                                                                <hr />
                                                                    <h6 style={{textAlign: 'center'}}>KTP Data</h6>
                                                                <hr />
                                                            </Col>
                                                            {data.status_ktp ? 
                                                                <Fragment>
                                                                    <Col md={4}>
                                                                        <FormGroup>
                                                                            <h6>ID number</h6>
                                                                            <h6>Full name</h6>
                                                                            <br />
                                                                            <h6>Address</h6>
                                                                            <br />
                                                                            <br />
                                                                            <h6>Place birth</h6>
                                                                            <h6>Date birth</h6>
                                                                            <h6>Gender</h6>
                                                                            <h6>Religion</h6>
                                                                            <h6>Martial Status</h6>
                                                                            <h6>Occupation</h6>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={1}>
                                                                        <FormGroup>
                                                                                <h6>:</h6>
                                                                                <h6>:</h6>
                                                                                <br />
                                                                                <h6>:</h6>
                                                                                <br />
                                                                                <br />
                                                                                <h6>:</h6>
                                                                                <h6>:</h6>
                                                                                <h6>:</h6>
                                                                                <h6>:</h6>
                                                                                <h6>:</h6>
                                                                                <h6>:</h6>
                                                                        </FormGroup>
                                                                    </Col>
                                                                    <Col md={7}>
                                                                        <FormGroup style={{textAlign:'right'}}>
                                                                            <p style={{marginBottom:'3px'}}>{data.ktp.id_number}</p>
                                                                            <p style={{marginBottom:'3px'}}>{data.ktp.full_name}</p>
                                                                            <p style={{marginBottom:'3px'}}>{data.ktp.address}</p>
                                                                            <p style={{marginBottom:'3px'}}>{data.ktp.place_birth}</p>
                                                                            <p style={{marginBottom:'3px'}}>{ParsedDateInd(data.ktp.date_birth)}</p>
                                                                            <p style={{marginBottom:'3px'}}>{data.ktp.gender}</p>
                                                                            <p style={{marginBottom:'3px'}}>{data.ktp.religion}</p>
                                                                            <p style={{marginBottom:'3px'}}>{data.ktp.martial_status}</p>
                                                                            <p style={{marginBottom:'3px'}}>{data.ktp.occupation}</p>
                                                                        </FormGroup>
                                                                    </Col>
                                                                </Fragment>
                                                            : 
                                                                <h6 style={{color: 'red'}}>KTP Not-Complete</h6>
                                                            }
                                                        </Row>
                                                    </Form>
                                                </FreeScrollBar>
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                </div>
                        </Col>
                    </Row>
                </div>
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