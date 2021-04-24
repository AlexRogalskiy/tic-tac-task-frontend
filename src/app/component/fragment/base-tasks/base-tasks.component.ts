import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

import {I18nService} from '../../../service/i18n.service';
import {TaskService} from '../../../service/task.service';
import {PageNavigationService} from '../../../service/page-navigation.service';
import {PageRequest} from '../../../service/page-request';
import {Task} from '../../../model/task';
import {TaskStatus} from '../../../model/task-status';
import {HttpRequestError} from '../../../error/http-request.error';
import {ResourceNotFoundError} from '../../../error/resource-not-found.error';
import {HTTP_REQUEST_ERROR_HANDLER, HttpRequestErrorHandler} from '../../../error/handler/http-request-error.handler';
import {Strings} from '../../../util/strings';

export class MenuItem {
  constructor(public readonly name: string, public readonly handler: () => void) {
  }
}

@Component({
  selector: 'app-base-tasks',
  templateUrl: './base-tasks.component.html',
  styleUrls: ['./base-tasks.component.styl']
})
export class BaseTasksComponent {
  title = '';
  titleReadonly = false;
  titleMaxLength = 255;
  titlePlaceholder = 'title';
  titleEditing = false;
  taskListMenuItems: MenuItem[] = [];
  taskFormEnabled = false;
  taskFormSubmitEnabled = false;
  taskFormModel = new Task();
  tasks: Array<Task>;
  showInlineSpinner: boolean;

  @ViewChild('titleInput')
  titleElement: ElementRef;
  @ViewChild('taskForm')
  taskForm: NgForm;

  protected pageRequest = new PageRequest();

  constructor(public i18nService: I18nService,
              protected taskService: TaskService,
              protected pageNavigationService: PageNavigationService,
              @Inject(HTTP_REQUEST_ERROR_HANDLER) protected httpRequestErrorHandler: HttpRequestErrorHandler) {
  }

  onTitleTextClick() {
    if (!this.titleReadonly) {
      this.beginTitleEditing();
    }
  }

  onTitleInputBlur() {
    this.endTitleEditing();
  }

  onTitleInputEnterKeydown() {
    if (!Strings.isBlank(this.title)) {
      this.endTitleEditing();
    }
  }

  onTitleInputEscapeKeydown() {
    this.endTitleEditing();
  }

  onTaskFormModelChange() {
    this.taskFormSubmitEnabled = !Strings.isBlank(this.taskFormModel.title);
  }

  onTaskFormSubmit() {
    this.createTask();
  }

  onTaskListScroll(event: any) {
  }

  onTaskCompleteCheckboxChange(task: Task) {
    // Let animation to complete
    setTimeout(() => this.completeTask(task), 300);
  }

  protected onTitleEditingBegin() {
  }

  protected onTitleEditingEnd() {
  }

  protected beforeTaskCreate(task: Task) {
    task.status = TaskStatus.PROCESSED;
  }

  protected afterTaskCreate(task: Task) {
    this.tasks.push(task);
    this.taskForm.resetForm();
    this.taskService.updateTaskCounters();
  }

  protected beforeTasksLoad() {
    this.showInlineSpinner = true;
    this.pageRequest.page++;
  }

  protected afterTasksLoad(tasks: Task[]) {
    this.tasks = this.tasks.concat(tasks);
    this.showInlineSpinner = false;
  }

  protected onHttpRequestError(error: HttpRequestError) {
    this.showInlineSpinner = false;
    if (error instanceof ResourceNotFoundError) {
      this.pageNavigationService.navigateToNotFoundErrorPage().then();
    } else {
      this.httpRequestErrorHandler.handle(error);
    }
  }

  private beginTitleEditing() {
    this.titleEditing = true;
    setTimeout(() => this.titleElement.nativeElement.focus(), 0);
    this.onTitleEditingBegin();
  }

  private endTitleEditing() {
    this.titleEditing = false;
    this.onTitleEditingEnd();
  }

  private createTask() {
    if (!Strings.isBlank(this.taskFormModel.title)) {
      this.beforeTaskCreate(this.taskFormModel);
      this.taskService.createTask(this.taskFormModel).subscribe(
        task => this.afterTaskCreate(task),
        (error: HttpRequestError) => this.onHttpRequestError(error)
      );
    }
  }

  private completeTask(task: Task) {
    this.taskService.completeTask(task).subscribe(_ => {
      this.tasks = this.tasks.filter(e => e.id !== task.id);
      this.taskService.updateTaskCounters();
    }, (error: HttpRequestError) => this.onHttpRequestError(error));
  }
}
