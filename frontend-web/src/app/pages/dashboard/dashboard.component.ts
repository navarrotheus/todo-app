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
  tasks: Task[] = [];
  isNewTaskSelected = true;
  selectedTaskModel: Task | null = null;
  isFetching = false;

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
      this.toastsService.addToast('Erro ao carregar tarefas', error.error, 'error');
    });
  }

  onNewTaskClick() {
    this.isNewTaskSelected = true;
    this.selectedTaskModel = null;
  }

  onTaskClick(task: Task) {
    this.selectedTaskModel = task;
    console.log(this.selectedTaskModel);
    this.isNewTaskSelected = false;
  }

  onCheckmarkClick(i: number, task_id: string) {
    this.http.patch(`http://localhost:3333/tasks/${task_id}`, null, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` })
    }).subscribe((data) => {
      const { done_at } = data as Task;
      this.tasks[i].done_at = done_at;
    }, ({ error }) => {
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

    this.http.post('http://localhost:3333/tasks', formData, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` })
    }).subscribe(data => {
      const { id, name, description, done_at } = data as Task;
      const newTask = new Task(id, name, description, done_at);

      this.tasks.push(newTask);
    }, ({ error }) => {
      this.toastsService.addToast('Erro ao criar tarefa', error.error, 'error');
    });
  }

  onDelete() {
    this.http.delete(`http://localhost:3333/tasks/${this.selectedTaskModel.id}`, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` })
    }).subscribe(() => {
      const taskIndex = this.tasks.findIndex(task => task.id === this.selectedTaskModel.id);
      this.tasks.splice(taskIndex, 1);
      this.selectedTaskModel = null;
      this.isNewTaskSelected = true;
    }, ({ error }) => {
      this.toastsService.addToast('Erro ao deletar tarefa', error.error, 'error');
    });
  }

  onLogout() {
    this.authService.signOut();
    this.router.navigate(['/']);
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
