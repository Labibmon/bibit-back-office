import React from "react";
import MediaQuery from 'react-responsive';
import { NavLink } from "react-router-dom";
import mainLogo from '../images/bibit-robo-white.png';
import FreeScrollBar from 'react-free-scrollbar';
import { Offline, Online } from "react-detect-offline";
import { Collapse,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';
import './css/home.css';

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            active:false,
            dropdownOpen: false,
            buttonSidebar: 'open',
            title: '',
            status: true
        }
        this.toggle = this.toggle.bind(this);   
    }

    handleMouseHover = () => {
        if (this.state.buttonSidebar === 'close')
        this.setState(prevState => ({active : !prevState.active}));
    }
    toggle() {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
      }
  render() {
    return (
        <div className="wrapper">
            {/* Slider Start  */}

            <nav id="sidebar"
                onMouseEnter={this.handleMouseHover} 
                onMouseLeave={this.handleMouseHover}
                className={this.state.active ? 'active' : undefined}>
                <div className="sidebar-header">
                    <img src={mainLogo} alt="" />
                    <h3>Back Office</h3>
                </div>
                <span />
                <ul className={this.state.active ? 'list-unstyled components' : undefined}>
                    <li className="">
                        <NavLink to="/" exact activeClassName="activeLink" >
                            {this.state.active ? <i className='fa fa-cogs'></i> : <div><i className='fa fa-cogs'></i>Permission</div>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/changelog" activeClassName="activeLink"> 
                            {this.state.active ? <i className='fa fa-database'></i> : <div><i className='fa fa-database'></i>       Change Log</div>}
                        </NavLink>
                    </li>
                </ul>
            </nav>
            {/* Slider End  */}

        <div id="content">
            {/* Header Start */}

            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <MediaQuery query="(min-width: 768px)">
                        <div 
                            id="sidebarCollapseLeft" 
                            onClick={()=>this.state.active ? this.setState({active:false, buttonSidebar: 'open'}) : this.setState({active:true, buttonSidebar: 'close'})}>
                            <i className='fa fa-bars'></i>
                           
                        </div>
                        {/* <Collapse isOpen={this.state.dropdownOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav>
                                        User <i className=' fa fa-angle-down'></i> 
                                    </DropdownToggle>
                                    <DropdownMenu right size="sm">
                                        <DropdownItem>
                                            Logout
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav>
                        </Collapse> */}
                    </MediaQuery>
                </div>
            </nav>
            {/* Header End */}

            {/* Content Start */}
            <div style={{width: '100%', height: '90%'}}>
            <Offline>
                <p className='offline'>Internet Disconnected</p>
            </Offline>
            <MediaQuery query="(min-width: 768px)">
                <FreeScrollBar>
                    {this.props.children}
                </FreeScrollBar>
            </MediaQuery>
            </div>
            {/* Content End */}
        </div>
    </div>
    );
  }
}
 
export default Home ;