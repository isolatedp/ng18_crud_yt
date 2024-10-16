import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmployeeModel } from './models/employee';
import { max } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  employeeForm: FormGroup = new FormGroup({});
  employeeItme: EmployeeModel = new EmployeeModel();
  employeeList: EmployeeModel[] = [];

  constructor() {
    this.createEmployeeForm();

    const oldData = localStorage.getItem('EmpData');
    if (oldData) {
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    } else {
      this.employeeList = [];
    }
  }

  createEmployeeForm() {
    this.employeeForm = new FormGroup({
      empId: new FormControl(this.employeeItme.empId)
      , name: new FormControl(this.employeeItme.name)
      , city: new FormControl(this.employeeItme.city)
      , state: new FormControl(this.employeeItme.state)
      , emailId: new FormControl(this.employeeItme.emailId)
      , contactNo: new FormControl(this.employeeItme.contactNo)
      , pinCode: new FormControl(this.employeeItme.pinCode)
      , address: new FormControl(this.employeeItme.address)
    })
  }

  onSave() {
    const oldData = localStorage.getItem('EmpData');
    const currentEmpId = this.employeeForm.controls['empId'].value;
    const editFlag = currentEmpId !== 0;

    let maxIdx = 0;
    switch (editFlag) {
      case true:
        const existEmp = this.employeeList.find((item) => item.empId === currentEmpId) as EmployeeModel;
        if (existEmp) {
          existEmp.name = this.employeeForm.controls['name'].value
          existEmp.city = this.employeeForm.controls['city'].value
          existEmp.state = this.employeeForm.controls['state'].value
          existEmp.emailId = this.employeeForm.controls['emailId'].value
          existEmp.contactNo = this.employeeForm.controls['contactNo'].value
          existEmp.pinCode = this.employeeForm.controls['pinCode'].value
          existEmp.address = this.employeeForm.controls['address'].value
        }
        break;
      default:
        // 此部分為新增
        if (oldData) {
          const parseData = JSON.parse(oldData) as EmployeeModel[];
          parseData.forEach((item) => {
            if (item.empId > maxIdx) maxIdx = item.empId;
          })
        }
        this.employeeForm.controls['empId'].setValue(maxIdx + 1);
        this.employeeList.unshift(this.employeeForm.value);
        break;
    }

    localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
    this.employeeItme = new EmployeeModel();
    this.createEmployeeForm();
  }

  onEdit(item: EmployeeModel) {
    this.employeeItme = item;
    this.createEmployeeForm();
  }


  onDel(item: EmployeeModel) {
    const existIdx = this.employeeList.findIndex((empInfo) => empInfo === item);
    if (existIdx > -1) {
      this.employeeList.splice(existIdx, 1);
    } 

    localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
  }

}
