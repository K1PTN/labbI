export class UIComponent {
    constructor(config) {
        this.id = config.id || `widget-${Date.now()}`;
        this.title = config.title || 'Без названия';
        this.element = null;
    }

    render() {
        const widget = document.createElement('div');
        widget.classList.add('widget');
        widget.id = this.id;
        
        const header = document.createElement('div');
        header.classList.add('widget-header');
        header.innerHTML = `
            <h3>${this.title}</h3>
            <button class="close-btn" title="Закрыть">&times;</button>
        `;

        const content = document.createElement('div');
        content.classList.add('widget-content');

        widget.appendChild(header);
        widget.appendChild(content);
        this.element = widget;
        
        header.querySelector('.close-btn').addEventListener('click', () => {
            this.destroy();
        });

        return widget;
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    getContentContainer() {
        return this.element.querySelector('.widget-content');
    }
}