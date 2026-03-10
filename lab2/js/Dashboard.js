import { ToDoWidget } from './ToDoWidget.js';
import { MemeWidget } from './MemeWidget.js';
import { CryptoWidget } from './CryptoWidget.js';

export class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.widgets = [];
    }

    addWidget(type) {
        let widget;
        const id = `w-${Date.now()}`;

        switch (type) {
            case 'todo':
                widget = new ToDoWidget({ id, title: 'Задачи' });
                break;
            case 'meme':
                widget = new MemeWidget({ id });
                break;
            case 'crypto':
                widget = new CryptoWidget({ id });
                break;
            default:
                console.error('Неизвестный тип виджета:', type);
                return;
        }

        const widgetEl = widget.render();
        
        if (!(widgetEl instanceof Node)) {
            console.error('render() не вернул DOM-элемент!', widgetEl);
            return;
        }
        
        this.container.appendChild(widgetEl);
        this.widgets.push(widget);
    }

    removeWidget(id) {
        const index = this.widgets.findIndex(w => w.id === id);
        if (index !== -1) {
            const widget = this.widgets[index];
            widget.destroy();
            this.widgets.splice(index, 1);
        }
    }
}