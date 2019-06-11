import {Serializable} from './serializable';

import * as moment from 'moment';

export class TaskComment implements Serializable<TaskComment> {
  id: number;
  commentText: string;
  createdAt: Date;
  updatedAt: Date;

  deserialize(input: any): TaskComment {
    this.id = input.id;
    this.commentText = input.commentText;
    this.createdAt = moment.utc(input.createdAt, moment.HTML5_FMT.DATETIME_LOCAL_MS).local().toDate();
    if (input.updatedAt) {
      this.updatedAt = moment.utc(input.updatedAt, moment.HTML5_FMT.DATETIME_LOCAL_MS).local().toDate();
    }
    return this;
  }
}
