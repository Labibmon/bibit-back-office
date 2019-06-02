import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input} from 'reactstrap';

const buttonAction = (cell,row) => {
    return (
      <div>
        <Button color="default" className="btnEdit" size="sm" onClick={() => {openModal(row)}}><i className=" fa fa-pen" /></Button>
        <Button color="danger" className="btnDelete" size="sm" onClick={() => this.toggleDelete('delete', row)}><i className=" fa fa-trash" /></Button>
      </div>
    )
  } 

const openModal = (row) => {
    console.log('Open', row)
} 

const HandleTableUtil ={
    buttonAction,
}

export default HandleTableUtil;