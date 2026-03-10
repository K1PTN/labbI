import { UIComponent } from './UIComponent.js';

export class QuoteWidget extends UIComponent {
    constructor(config) {
        super({ ...config, title: 'Цитата дня (API)' });
        this.quoteData = null;
    }

    render() {
        super.render();
        const container = this.getContentContainer();
        container.innerHTML = `
            <div class="quote-content">
                <p class="quote-text">Загрузка...</p>
                <p class="quote-author"></p>
            </div>
            <button class="refresh-btn">Обновить</button>
        `;

        const refreshBtn = container.querySelector('.refresh-btn');
        refreshBtn.addEventListener('click', () => this.fetchQuote(container));

        this.fetchQuote(container);
        
        return this.element; // 🔥 ВАЖНО: возвращаем элемент!
    }

    async fetchQuote(container) {
        const textEl = container.querySelector('.quote-text');
        const authorEl = container.querySelector('.quote-author');
        
        textEl.textContent = 'Загрузка...';
        
        try {
            // 🔥 Добавлен https://
            const response = await fetch('https://api.quotable.io/random');
            if (!response.ok) throw new Error('API error');
            
            const data = await response.json();
            this.quoteData = data;
            textEl.textContent = `"${data.content}"`;
            authorEl.textContent = `— ${data.author}`;
        } catch (error) {
            textEl.textContent = '❌ Ошибка загрузки';
            console.error('Quote API error:', error);
        }
    }
}