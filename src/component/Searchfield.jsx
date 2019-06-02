import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './css/searchfield.css';

class Searchfield extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          dropdownOpen: false
        };
      }
    toggle = () => {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
      }
    render(){
        return(
            <div className='searchfield'>
                <ButtonDropdown  isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle className='searchbutton'>
                        Search By <i className='fa fa-angle-down'></i> 
                    </DropdownToggle>
                    <DropdownMenu>
                    <DropdownItem>Name</DropdownItem>
                    <DropdownItem>Phone</DropdownItem>
                    <DropdownItem>Email</DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>
                <div className='input'>
                  <input className='inputsearch'/>
                  <i className="fa fa-search"/>
                </div>
            </div>
        )
    }
}

export default Searchfield;