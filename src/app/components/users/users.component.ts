import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToDoService } from '../../services/to-do.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  closeResult = '';
  usersList: any = {};

  constructor(
    private todoService: ToDoService,
    private modalService: NgbModal) { 
    }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  };

  ngOnInit() {
    this.getUsers()
  }

  //getUsers
  getUsers(): void {
    this.todoService.getUsers()
      .subscribe(users => {
        this.usersList = users;
       // console.log(this.usersList);
      //  this.users = users
      });
  };

  //deleteUser
  deleteUser(id: string): void {
    this.todoService.deleteUser(id).subscribe(user => {
      //console.log('This user was successfully deleted');
      this.getUsers();
    })
  }



}
