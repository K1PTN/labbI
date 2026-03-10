import { UIComponent } from './UIComponent.js';

export class ToDoWidget extends UIComponent {
    constructor(config) {
        super({ ...config, title: '📝 Список дел' });
        this.tasks = [];
    }

    render() {
        super.render();
        const container = this.getContentContainer();

        container.innerHTML = `
            <div class="todo-input-group">
                <input type="text" id="todo-input-${this.id}" placeholder="Новая задача...">
                <button id="todo-add-${this.id}">+</button>
            </div>
            <ul id="todo-list-${this.id}"></ul>
        `;

        const input = container.querySelector(`#todo-input-${this.id}`);
        const addBtn = container.querySelector(`#todo-add-${this.id}`);
        const list = container.querySelector(`#todo-list-${this.id}`);

        const addTask = () => {
            const text = input.value.trim();
            if (text) {
                this.addTask(text, list);
                input.value = '';
            }
        };

        addBtn.addEventListener('click', addTask);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });

        return this.element;
    }

    addTask(text, listElement) {
        const task = { id: Date.now(), text, done: false };
        this.tasks.push(task);
        this.renderTask(task, listElement);
    }

    renderTask(task, listElement) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <button class="delete-task-btn">🗑️</button>
        `;
        
        li.querySelector('.task-text').addEventListener('click', () => {
            li.classList.toggle('done');
            const t = this.tasks.find(t => t.id === task.id);
            if(t) t.done = !t.done;
        });

        li.querySelector('.delete-task-btn').addEventListener('click', () => {
            li.remove();
            this.tasks = this.tasks.filter(t => t.id !== task.id);
        });

        listElement.appendChild(li);
    }

    destroy() {
        super.destroy();
        this.tasks = [];
    }
}