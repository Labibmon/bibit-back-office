import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import { Collapse, Button } from 'reactstrap';
import mainLogo from '../../../images/bibit-robo-white.png'
import './sidebar.css'


export default class Sidebar extends Component{
    constructor(){
        super();
        this.state = {
            collapse: false,
            active:false,
            collapseSubcription: false,
            buttonSidebar: 'open',
            pathname: 'changelog'
        }
    }

    componentDidMount (){
        if(window.location.pathname.lastIndexOf('.') !== -1 || window.location.pathname === '/investor'){
            this.setState(state => ({ collapseSubcription: !state.collapseSubcription }));
        }
        if(window.location.pathname === '/role'){
            this.setState({
                pathname: 'role',
                collapse: true,
            })
        }
    }

    handleMouseHover = () => {
        if (this.state.buttonSidebar === 'close'){
            this.setState(prevState => ({active : !prevState.active}));
        }
    }


    collapse = () => {
        this.setState(state => ({ collapse: !state.collapse }));
    }

    collapseSubcription = () => {
        this.setState(state => ({ collapseSubcription: !state.collapseSubcription }));
    }

    handleClick = (event) => {
        this.setState({
            pathname: event
        })
    }

    render(){
        const { pathname } = this.state
        return(
            <div className="wrapper">
                <div 
                    id="sidebar"
                    onMouseEnter={this.handleMouseHover} 
                    onMouseLeave={this.handleMouseHover}
                    className={this.state.active ? 'active' : undefined}
                    >
                    <div className="sidebar-header">
                        <img src={mainLogo} alt="" />
                        <h3>Back Office</h3>
                    </div>
                    <ul className={this.state.active ? "marginSidebarFalse" : ''}>
                        <li>
                            <div style={{marginLeft: "10px"}}>
                                <div div="true" className="row">
                                    <div className="col-sm-1">
                                        <i className='fa fa-address-book' />
                                    </div>
                                    <div className="col-sm-9">
                                        <Button className="collapsePermmission" color="primary" onClick={this.collapseSubcription}>
                                            {this.state.active ? '' : ' Subcription'}
                                        </Button>
                                    </div>
                                </div>
                            </div>    
                            {this.state.active === false ? 
                            <Collapse isOpen={this.state.collapseSubcription} style={{marginBottom:'10px', marginLeft:'30px'}}>
                                    <Link to="/investor" style={pathname === 'bibit' ? {color: '#00ab6b'} : {} } onClick={ () => this.handleClick('bibit')}>                                      
                                        Bibit
                                    </Link>
                            </Collapse>
                                :
                            <div></div>
                            }
                        </li>
                        <li>
                            <div style={{marginLeft: "10px"}}>
                                <div div="true" className="row">
                                    <div className="col-sm-1">
                                        <i className='fa fa-cogs' />
                                    </div>
                                    <div className="col-sm-9">
                                        <Button className="collapsePermmission" color="primary" onClick={this.collapse}>
                                            {this.state.active ? '' : ' Permission'}
                                        </Button>
                                    </div>
                                </div>
                            </div>    
                            {this.state.active === false ? 
                            <Collapse isOpen={this.state.collapse} style={{marginBottom:'10px', marginLeft:'30px'}}>
                                    <Link to="/activity" style={pathname === 'activity' ? {color: '#00ab6b'} : {} }onClick={ () => this.handleClick('activity')}>
                                        Activity Role
                                    </Link>
                                    <Link to="/member" style={pathname === 'member' ? {color: '#00ab6b'} : {} } onClick={ () => this.handleClick('member')}>
                                        Member
                                    </Link>
                                    <Link to="/role" style={pathname === 'role' ? {color: '#00ab6b'} : {} } onClick={ () => this.handleClick('role')}>
                                        Role
                                    </Link>
                            </Collapse>
                                :
                            <div></div>
                            }
                        </li>
                        <li>
                            <Link to="/" style={pathname === 'changelog' ? {color: '#00ab6b'} : {} } onClick={ () => this.handleClick('changelog')}>
                                <div div="true" className="row">
                                    <div className="col-sm-1">
                                        <i className='fa fa-database' />
                                    </div>
                                    <div className="col-sm-9">
                                        {this.state.active ? '' : ' Change Log'}
                                    </div>
                                </div>
                            </Link>
                        </li>
                    </ul>

                    {this.props.routes.map((route, index) => (
                        <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        component={route.sidebar}
                        />
                    ))}
                </div>
                <div 
                    id="sidebarCollapseLeft" 
                    onClick={()=>this.state.active ? this.setState({active:false, buttonSidebar: 'open' }) : this.setState({active:true, buttonSidebar: 'close'})}>
                    <i className='fa fa-bars'></i>
                </div>
            </div>
        );
    }
}