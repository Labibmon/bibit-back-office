import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import FreeScrollBar from 'react-free-scrollbar';
import mainLogo from '../images/bibit-robo-white.png';
import { Offline, Online } from "react-detect-offline";
import { Collapse,
    Nav,
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';
import './css/home.css';

export default class Main extends Component{
    constructor(props){
        super(props);
        this.state = {
            active:false,
            dropdownOpen: false,
            buttonSidebar: 'open',
            title: '',
            status: true,
            locationPath: '',
            collapse: false ,
        }
        this.toggle = this.toggle.bind(this);   
    }
    handleMouseHover = () => {
        if (this.state.buttonSidebar === 'close')
        this.setState(prevState => ({active : !prevState.active}));
    }
    collapse = () => {
        this.setState(state => ({ collapse: !state.collapse }));
    }
    toggle() {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
      }
/* eslint no-restricted-globals:0*/

      handleClick = (e) => {
       location.pathname = e.target.name
      };
    render(){
        return(
            <div className="wrapper">
                <div id="sidebar"
                    onMouseEnter={this.handleMouseHover} 
                    onMouseLeave={this.handleMouseHover}
                    className={this.state.active ? 'active' : undefined}>
                        <span />
                        <span />
                        <div className="sidebar-header">
                            <img src={mainLogo} alt="" />
                            <h3>Back Office</h3>
                        </div>
                        <span />
                        <div class="row" style={{marginLeft:'30px', marginTop:'30px'}}>
                            <a href="/investor" style={{marginBottom:'20px'}} name='investor' className={location.pathname  === '/investor' ? 'activedCustom' : undefined} onClick={(e) => this.handleClick(e)}>
                                <div class="row">
                                    <div class="col-sm-1">
                                        <i className='fa fa-cogs' />
                                    </div>
                                    <div class="col-sm-9">
                                        {this.state.active ? '' : ' Investor'}
                                    </div>
                                </div>
                            </a>
                            <div class="row">
                                <div class="col-sm-1">
                                    <i className='fa fa-cogs' />
                                </div>
                            <div class="col-sm-9">
                                <Button className="collapsePermmission" color="primary" onClick={this.collapse} style={{ marginBottom: '1rem' }}>Permission</Button>
                            </div>
                            </div>
                            <Collapse isOpen={this.state.collapse} style={{marginBottom:'20px', marginLeft:'30px'}}>
                                {/* <div className="collapse"> */}
                                    <a href="/" style={{marginBottom:'20px'}} name='' className={location.pathname  === '/' ? 'activedCustom' : undefined} onClick={(e) => this.handleClick(e)}>
                                        <div class="row">
                                            <div class="col-sm-9">
                                                {this.state.active ? '' : ' Member'}
                                            </div>
                                        </div>
                                    </a>
                                    <a href="/" style={{marginBottom:'20px'}} name='' className={location.pathname  === '/role' ? 'activedCustom' : undefined} onClick={(e) => this.handleClick(e)}>
                                        <div class="row">
                                            <div class="col-sm-9">
                                                {this.state.active ? '' : ' Role'}
                                            </div>
                                        </div>
                                    </a>
                                {/* </div> */}
                            </Collapse>
                            <br />
                            <br />
                            <a href="changelog" name='changelog' className={location.pathname  === '/changelog' ? 'activedCustom' : undefined} onClick={(e) => this.handleClick(e)}>
                                <div class="row">
                                    <div class="col-sm-1">
                                        <i className='fa fa-database' />
                                    </div>
                                    <div class="col-sm-9">
                                    {this.state.active ? '' : 'Change Log'}
                                    </div>
                                </div>
                            </a>
                            <br />
                            <br />
                        </div>
                </div>
                <div id="content">
                    <div className="navbar navbar-expand-lg navbar-light">
                        <div className="container-fluid">
                            <MediaQuery query="(min-width: 768px)">
                                <div 
                                    id="sidebarCollapseLeft" 
                                    onClick={()=>this.state.active ? this.setState({active:false, buttonSidebar: 'open'}) : this.setState({active:true, buttonSidebar: 'close'})}>
                                    <i className='fa fa-bars'></i>
                                </div>
                                <Collapse isOpen={this.state.dropdownOpen} navbar>
                                    <Nav className="ml-auto" navbar>
                                        <UncontrolledDropdown nav inNavbar>
                                            <DropdownToggle nav>
                                                {this.props.name} <i className=' fa fa-angle-down'></i> 
                                            </DropdownToggle>
                                            <DropdownMenu right size="sm">
                                                <DropdownItem
                                                onClick=''
                                                disabled
                                                >
                                                    <img class="photoProfile" src={this.props.picture} />
                                                    <div className="ketProfile">
                                                        <p className="nameProfile">{this.props.name}</p>
                                                        {this.props.emailName !== "undifined" ? 
                                                            <p className="emailProfile">{this.props.emailName}@gmail.com</p>
                                                        :
                                                            <p className="emailProfile">{this.props.email}</p>
                                                        }
                                                    </div>
                                                </DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem class="logout" disabled>
                                                    <Button
                                                    onClick={this.props.auth.logout}
                                                    className="logoutBtn"
                                                    size="sm"
                                                    >
                                                        Logout
                                                    </Button>
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Nav>
                                </Collapse>
                            </MediaQuery>
                        </div>
                    </div>
                    <div style={{width: '100%', height: '90%'}}>
                    {/* <Offline>
                        <p className='offline'>Internet Disconnected</p>
                    </Offline> */}
                    <MediaQuery query="(min-width: 768px)">
                        <FreeScrollBar>
                            {this.props.children}
                        </FreeScrollBar>
                    </MediaQuery>
                    </div>
                </div>
            </div>
        )
    }
}