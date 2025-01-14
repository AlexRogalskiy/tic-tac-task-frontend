import {AbstractEntity} from './abstract-entity';
import {Objects} from '../util/objects';

export class TaskList extends AbstractEntity {
  id: number;
  name: string;
  completed: boolean;

  constructor(name: string = null) {
    super();
    this.name = name;
  }

  deserialize(input: any): TaskList {
    this.id = input.id;
    this.name = input.name;
    this.completed = input.completed;
    return this;
  }

  clone(): TaskList {
    const clone = new TaskList();
    clone.id = this.id;
    clone.name = this.name;
    clone.completed = this.completed;
    return clone;
  }

  equals(other: TaskList): boolean {
    return Objects.equals(this.id, other.id)
      && Objects.equals(this.name, other.name)
      && Objects.equals(this.completed, other.completed);
  }
}
