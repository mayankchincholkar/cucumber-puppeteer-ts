import { setWorldConstructor, setDefaultTimeout }from 'cucumber';
setDefaultTimeout(60 * 1000);
import {expect} from 'chai';
import { Browser, ElementHandle, launch, Page, Response} from 'puppeteer';

const PAGE = "http://todomvc.com/examples/react/#/";

class TodoWorld {

  private browser: Browser;
  private page: Page;
  private todo: string;
  private inputElement: any;

  constructor() {
    this.todo = "";

  }

  async openTodoPage() {
    this.browser = await launch({headless: false});
    this.page = await this.browser.newPage();
    await this.page.goto(PAGE);
  }

  setTodo(todo) {
    this.todo = todo;
  }

  async writeTodo() {
    const inputSelector = "section input";
    await this.page.waitForSelector(inputSelector);
    this.inputElement = await this.page.$(inputSelector);
    await this.inputElement.type(this.todo);
  }

  async submit() {
    await this.inputElement.press("Enter");
    await this.page.waitFor(10000);
  }

  async checkTodoIsInList() {
    const todoSelector = "ul.todo-list li label";
    await this.page.waitForSelector(todoSelector);
    const todo = await this.page.evaluate(
      todoSelector => document.querySelector(todoSelector).innerText,
      todoSelector
    );
    expect(this.todo).to.eql(todo);
  }

  async closeTodoPage() {
    await this.browser.close();
  }
}

setWorldConstructor(TodoWorld);