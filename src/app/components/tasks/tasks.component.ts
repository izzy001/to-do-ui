import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToDoService } from '../../services/to-do.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  closeResult = '';
  closeResultAddToExistingTask = '';
  description = '';
  taskList: any = {};
  newTask: any;
  taskId = this._Activatedroute.snapshot.paramMap.get("id");
  taskListId = '';
  errors: any;
 
 
  

  constructor(
    private todoService: ToDoService,
    private modalService: NgbModal,
    private _Activatedroute: ActivatedRoute,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.description = result;
      //console.log(this.closeResult);
      this.addNewTaskForUser();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  openExistingTask(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResultAddToExistingTask = `Closed with: ${result}`;
      this.description = result;
      //console.log(this.closeResultAddToExistingTask);
      this.addTaskToTaskList();
    }, (reason) => {
      this.closeResultAddToExistingTask = `Dismissed ${this.getDismissReason(reason)}`;
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

  ngOnInit(): void {
    this.getTasks();
  }

//get user task
  getTasks(): void {
    let id = this.taskId;
   // console.log(id);
    this.todoService.getUserTask(id)
      .subscribe(tasks => {
        this.taskList = tasks;
        //console.log(this.taskList);
        this.taskListId = tasks.data._id;
      });
  };

  //add Task
  addNewTaskForUser(): void {
    const payload = {
      user_id: this.taskId,
      description: this.description
    }
    if (!payload) { return; }
    this.todoService.newUserTask(payload)
      .subscribe(task => {
        this.newTask = task;
        this.getTasks();
      })
  }

  //add Task to an existing TaskList
  addTaskToTaskList(): void {
    let payload = {
      tasks: {
        description: this.description
      }
    }
    let id = this.taskListId

    if (!id) { return; }
    this.todoService.addTaskToTaskList(payload, id)
      .subscribe(newTask => {
        //console.log(newTask);
        this.getTasks();
      });
  };

  //update user task status
  updateTaskStatus(id: any, newState:any): void {
    console.log(id);
    console.log(newState);
    let payload = {
      state: newState
    };

    this.todoService.updateTaskStatus(payload, id)
      .subscribe(newStatus => {
       // console.log(newStatus);
        this.getTasks();
      });
  }

 



}
