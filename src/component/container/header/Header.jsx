import React, { Component } from 'react';
import { 
    Button,
    Navbar, 
    Nav, 
    NavbarToggler,
    Collapse,
    UncontrolledDropdown, 
    DropdownToggle, 
    DropdownMenu,
    DropdownItem } from 'reactstrap' ;
import './header.css'

export default class Header extends Component{
    constructor(){
        super();
        this.state = {
            isOpen: false,
        }
    }
    toggle = () => {
        this.setState({
          isOpen: !this.state.isOpen
        });
      }
      
    render(){
        return(
            <Navbar className="header" color="white" light expand="md">
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav style={{backgroundColor:'white'}}>
                                {this.props.name} <i className=' fa fa-angle-down'></i> 
                            </DropdownToggle>
                            <DropdownMenu right size="sm">
                                <DropdownItem
                                            disabled
                                >
                                    <img className="photoProfile" src={this.props.picture} alt=""/>
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
                                    <Button onClick={this.props.auth.logout} className="logoutBtn" size="sm">Logout</Button>
                                <DropdownItem className="logout" disabled>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}