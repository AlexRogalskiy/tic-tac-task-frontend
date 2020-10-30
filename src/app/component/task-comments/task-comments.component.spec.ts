import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';

import * as moment from 'moment';
import {of} from 'rxjs';

import {TaskCommentsComponent} from './task-comments.component';
import {TaskComment} from '../../model/task-comment';
import {TaskCommentService} from '../../service/task-comment.service';
import {ConfigService} from '../../service/config.service';
import {TestSupport} from '../../test/test-support';
import {PageRequest} from '../../service/page-request';
import any = jasmine.any;

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('TaskCommentsComponent', () => {
  let component: TaskCommentsComponent;
  let fixture: ComponentFixture<TaskCommentsComponent>;
  let taskCommentService: TaskCommentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: TestSupport.IMPORTS,
      declarations: TestSupport.DECLARATIONS,
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: MatDialog, useClass: MatDialogMock},
        {provide: ConfigService, useValue: {apiBaseUrl: 'http://backend.com'}}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCommentsComponent);

    taskCommentService = fixture.debugElement.injector.get(TaskCommentService);
    const createdAt = moment().utc().subtract(1, 'days').format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
    const comments = [];
    for (let i = 0; i < 3; i++) {
      comments.push(new TaskComment().deserialize({id: i + 1, commentText: `Test comment ${i + 1}`, createdAt}));
    }
    spyOn(taskCommentService, 'getComments').and.returnValue(of(comments));
    spyOn(taskCommentService, 'createComment').and.callFake(c => {
      const result = new TaskComment().deserialize(c);
      if (!c.id) {
        result.id = 4;
      }
      return of(result);
    });
    spyOn(taskCommentService, 'updateComment').and.callFake(c => of(new TaskComment().deserialize(c)));
    spyOn(taskCommentService, 'deleteComment').and.returnValue(of(null));

    component = fixture.componentInstance;
    fixture.detectChanges();

    moment.locale('ru');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable new comment form when comment text is not blank', () => {
    fixture.whenStable().then(() => {
      component.newCommentFormModel.commentText = 'New comment';
      component.onNewCommentInputKeyUp();
      fixture.detectChanges();
      expect(component.newCommentFormEnabled).toBeTruthy();
    });
  });

  it('should disable new comment form when comment text is blank', () => {
    fixture.whenStable().then(() => {
      component.newCommentFormModel.commentText = ' ';
      component.onNewCommentInputKeyUp();
      fixture.detectChanges();
      expect(component.newCommentFormEnabled).toBeFalsy();
    });
  });

  it('should create comment', () => {
    const commentText = 'New comment';
    fixture.whenStable().then(() => {
      component.newCommentFormModel.commentText = commentText;
      component.onNewCommentFormSubmit();
      fixture.detectChanges();
      expect(component.comments.length).toBe(4);
      expect(component.comments[0].commentText).toEqual(commentText);
    });
  });

  it('should create comment on Ctrl + Enter', () => {
    const commentText = 'New comment';
    fixture.whenStable().then(() => {
      component.newCommentFormModel.commentText = commentText;
      component.onNewCommentInputKeyDown({ctrlKey: true, code: 'Enter'});
      fixture.detectChanges();
      expect(component.comments.length).toBe(4);
      expect(component.comments[0].commentText).toEqual(commentText);
    });
  });

  it('should not create comment with blank comment text', () => {
    fixture.whenStable().then(() => {
      component.newCommentFormModel.commentText = ' ';
      component.onNewCommentFormSubmit();
      fixture.detectChanges();
      expect(taskCommentService.createComment).not.toHaveBeenCalled();
    });
  });

  it('should show comment header buttons on comment container mouse over', () => {
    const commentId = component.comments[0].id;
    const buttonsSelector = By.css('.comment-' + commentId + ' .comment-header .header-buttons');
    fixture.whenStable().then(() => {
      component.onCommentContainerMouseOver(component.comments[0]);
      fixture.detectChanges();
      expect(fixture.debugElement.query(buttonsSelector).nativeElement.getAttribute('hidden')).toBeNull();
    });
  });

  it('should hide comment header buttons on comment container mouse out', () => {
    const commentId = component.comments[0].id;
    const buttonsSelector = By.css('.comment-' + commentId + ' .comment-header .header-buttons');
    component.onCommentContainerMouseOver(component.comments[0]);
    fixture.whenStable().then(() => {
      component.onCommentContainerMouseOut(null);
      fixture.detectChanges();
      expect(fixture.debugElement.query(buttonsSelector).nativeElement.getAttribute('hidden')).toEqual('');
    });
  });

  it('should hide comment text element on edit comment button click', () => {
    const commentId = component.comments[0].id;
    const spanSelector = By.css('.comment-' + commentId + ' .comment-body .comment-text');
    fixture.whenStable().then(() => {
      component.onEditCommentButtonClick(component.comments[0]);
      fixture.detectChanges();
      expect(fixture.debugElement.query(spanSelector)).toBeFalsy();
    });
  });

  it('should show edit comment form on edit comment button click', () => {
    const commentId = component.comments[0].id;
    fixture.whenStable().then(() => {
      component.onEditCommentButtonClick(component.comments[0]);
      fixture.detectChanges();
      const commentForm = fixture.debugElement.query(By.css('.comment-' + commentId + ' .comment-body form'));
      expect(commentForm).toBeTruthy();
    });
  });

  it('should enable edit comment form when comment text is not blank', () => {
    fixture.whenStable().then(() => {
      component.onEditCommentButtonClick(component.comments[0]);
      component.editCommentFormModel.commentText = 'Edited comment';
      component.onEditCommentInputKeyUp();
      fixture.detectChanges();
      expect(component.editCommentFormEnabled).toBeTruthy();
    });
  });

  it('should disable edit comment form when comment text is blank', () => {
    fixture.whenStable().then(() => {
      component.onEditCommentButtonClick(component.comments[0]);
      component.editCommentFormModel.commentText = ' ';
      component.onEditCommentInputKeyUp();
      fixture.detectChanges();
      expect(component.editCommentFormEnabled).toBeFalsy();
    });
  });

  it('should edit comment', () => {
    const commentText = 'Edited comment';
    fixture.whenStable().then(() => {
      component.onEditCommentButtonClick(component.comments[0]);
      component.editCommentFormModel.commentText = commentText;
      component.onEditCommentFormSubmit();
      fixture.detectChanges();
      expect(component.comments[0].commentText).toEqual(commentText);
    });
  });

  it('should not save edited comment with blank comment text', () => {
    const commentText = component.comments[0].commentText;
    fixture.whenStable().then(() => {
      component.onEditCommentButtonClick(component.comments[0]);
      component.editCommentFormModel.commentText = ' ';
      component.onEditCommentFormSubmit();
      fixture.detectChanges();
      expect(component.comments[0].commentText).toEqual(commentText);
    });
  });

  it('should restore original comment text on cancel edit comment button click', () => {
    const commentText = component.comments[0].commentText;
    fixture.whenStable().then(() => {
      component.onEditCommentButtonClick(component.comments[0]);
      component.editCommentFormModel.commentText = 'Edited comment';
      component.onCancelEditCommentButtonClick();
      fixture.detectChanges();
      expect(component.comments[0].commentText).toEqual(commentText);
    });
  });

  it('should render relative comment date in Russian', () => {
    fixture.whenStable().then(() => {
      const relativeDate = component.getRelativeCommentDate(component.comments[0]);
      expect(relativeDate).toEqual('день назад');
    });
  });

  it('should delete comment', () => {
    fixture.whenStable().then(() => {
      const commentToDelete = component.comments[0];
      component.onDeleteCommentButtonClick(commentToDelete);
      fixture.detectChanges();
      expect(component.comments.length).toBe(2);
      expect(component.comments[0]).not.toEqual(commentToDelete);
    });
  });

  it('should load next task page on task list scroll', () => {
    fixture.whenStable().then(() => {
      component.onCommentListScroll();
      expect(taskCommentService.getComments).toHaveBeenCalledWith(any(Number), new PageRequest(1));
    });
  });
});