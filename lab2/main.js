import { Dashboard } from './js/Dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard('dashboard-grid');

    document.getElementById('add-todo')?.addEventListener('click', () => {
        dashboard.addWidget('todo');
    });

    document.getElementById('add-meme')?.addEventListener('click', () => {
        dashboard.addWidget('meme');
    });

    document.getElementById('add-crypto')?.addEventListener('click', () => {
        dashboard.addWidget('crypto');
    });

    // Виджет по умолчанию
    dashboard.addWidget('meme');
});