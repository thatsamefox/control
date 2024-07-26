import { handleError } from './error.js'
import {Callback, Context} from './host.js'
import chalk from 'chalk'

export class Task {
  callback?: Callback<void>
  group?: string[]
  become?: string

  constructor(
    public name: string,
    callback: Callback<void> | string[]
  ) {
    if (Array.isArray(callback)) {
      this.group = callback
      return
    }
    this.callback = callback
  }

  as(name: string) {
    this.become = name
  }
}

export const allTasks: Map<string, Task> = new Map()

export function task(name: string, callback: Callback<void> | string[]): Task {
  if (Array.isArray(callback)) {
    for (const taskName of callback) {
      if (!allTasks.has(taskName)) {
        throw new Error(`Task "${taskName}" is not defined`)
      }
    }
  }
  const task = new Task(name, callback)
  allTasks.set(name, task)
  return task
}

export let currentlyRunningTask: string

export async function runTask(taskName: string, context: Context) {
  const task = allTasks.get(taskName)
  if (!task) {
    throw new Error(`Task "${taskName}" is not defined.`)
  }
  if (task.group) {
    for (const taskName of task.group) {
      await runTask(taskName, context)
    }
    return
  }
  if (!task.callback) {
    throw new Error(`Task "${taskName}" has no callback.`)
  }
  currentlyRunningTask = taskName
  if (context.config.verbose) {
    console.log(chalk.bold('task') + ' ' + chalk.cyan(taskName))
  }
  context.$.cd('')
  if (task.become && task.become != context.config.remoteUser) {
    context.config.become = task.become
    context.$ = context.$.with({become: task.become})
  }
  await task.callback(context).catch(handleError)
}
