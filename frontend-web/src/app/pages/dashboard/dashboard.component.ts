import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastsService } from 'src/app/services/toasts.service';
import { AuthService } from 'src/app/services/auth.service';

import Task from '../../models/Task';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('f') newTaskForm: NgForm;
  @ViewChild('updateform') updateTaskForm: NgForm;

  tasks: Task[] = [];

  isNewTaskSelected = false;
  isUpdateTaskSelected = false;
  
  isFetching = false;
  
  isCreatingTask = false;
  
  selectedTaskModel: Task | null = null;

  constructor(
    private http: HttpClient,
    private toastsService: ToastsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isFetching = true;
    this.http.get('http://localhost:3333/tasks', {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` })
    }).subscribe(data => {
      this.isFetching = false;
      this.tasks = data as Task[];
    }, ({ error }) => {
      this.isFetching = false;
      this.toastsService.addToast('Erro ao carregar tarefas', error.error, 'error');
    });
  }

  onNewTaskClick() {
    this.isNewTaskSelected = !this.isNewTaskSelected;
    this.isUpdateTaskSelected = false;
    this.selectedTaskModel = null;
  }

  onTaskClick(task: Task) {
    this.selectedTaskModel = task;
    this.isNewTaskSelected = false;
    this.isUpdateTaskSelected = false;
  }

  onCheckmarkClick(i: number, task_id: string) {
    this.tasks[i].isUpdatingStatus = true;
    this.http.patch(`http://localhost:3333/tasks/${task_id}`, null, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` })
    }).subscribe((data) => {
      const { done_at } = data as Task;

      this.tasks[i].isUpdatingStatus = false;

      this.tasks[i].done_at = done_at;

      this.toastsService.addToast('Sucesso ao atualizar tarefa', '', 'sucess');
    }, ({ error }) => {
      this.tasks[i].isUpdatingStatus = false;
      this.toastsService.addToast('Erro ao atualizar tarefa', error.error, 'error');
    });
  }

  onSubmitNewTask(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const { value: formData } = this.newTaskForm;

    if (!formData.description) {
      formData.description = undefined;
    }

    this.isCreatingTask = true;
    this.http.post('http://localhost:3333/tasks', formData, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` })
    }).subscribe(data => {
      this.isCreatingTask = false;

      const { id, name, description, done_at } = data as Task;

      const newTask = new Task(id, name, description, done_at, false);

      this.tasks.push(newTask);

      this.toastsService.addToast('Sucesso ao criar tarefa', '', 'sucess');
    }, ({ error }) => {
      this.isCreatingTask = false;
      this.toastsService.addToast('Erro ao criar tarefa', error.error, 'error');
    });
  }

  onDelete(task_id: string) {
    this.isUpdateTaskSelected = false;
    
    const taskIndex = this.tasks.findIndex(task => task.id === task_id);

    this.tasks[taskIndex].isUpdatingStatus = true;

    this.http.delete(`http://localhost:3333/tasks/${this.selectedTaskModel.id}`, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` })
    }).subscribe(() => {
      const taskIndex = this.tasks.findIndex(task => task.id === this.selectedTaskModel.id);

      this.tasks.splice(taskIndex, 1);

      this.tasks.length ? this.selectedTaskModel = this.tasks[0] : this.selectedTaskModel = null;

      this.toastsService.addToast('Sucesso ao deletar tarefa', '', 'sucess');
    }, ({ error }) => {
      this.tasks[taskIndex].isUpdatingStatus = false;
      this.toastsService.addToast('Erro ao deletar tarefa', error.error, 'error');
    });
  }

  onLogout() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }

  onSubmitUpdateTask(form: NgForm, task_id: string) {
    if (!form.valid) {
      return;
    }

    const { value: formData } = this.updateTaskForm;

    if (!formData.description) {
      delete formData.description;
    }

    if (!formData.name) {
      delete formData.name;
    }

    const taskIndex = this.tasks.findIndex(task => task.id === task_id);

    this.tasks[taskIndex].isUpdatingStatus = true;

    this.http.put(`http://localhost:3333/tasks/${task_id}`, formData, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` })
    }).subscribe(data => {
      this.tasks[taskIndex].isUpdatingStatus = false;

      const { name, description } = data as Task;

      if (name) {
        this.tasks[taskIndex].name = name;
      }
  
      if (description) {
        this.tasks[taskIndex].description = description;
      }

      this.isUpdateTaskSelected = false;

      this.toastsService.addToast('Sucesso ao atualizar a tarefa', '', 'sucess');
    }, ({ error }) => {
      this.tasks[taskIndex].isUpdatingStatus = false;
      this.toastsService.addToast('Erro ao atualizar a tarefa', error.error, 'error');
    });
  }

  onUpdateTaskClick() {
    this.isUpdateTaskSelected = !this.isUpdateTaskSelected;
  }

  getTaskStatus(date: string) {
    if (date) {
      return 'Feita'
    }

    return 'A fazer'
  }

  getUsername() {
    return this.authService.getUsername();
  }

}
