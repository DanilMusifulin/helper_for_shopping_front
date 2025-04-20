// Ждем загрузки DOM перед выполнением кода
document.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM
    const startScreen = document.querySelector('.start-screen');
    const mainScreen = document.querySelector('.main-screen');
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const guestBtn = document.getElementById('guest-btn');
    const profileIcon = document.querySelector('.profile-icon');
    const profileMenu = document.querySelector('.profile-menu');
    const logoutBtn = document.getElementById('logout-btn');
    const sendBtn = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    const messages = document.querySelector('.messages');
    const cartItems = document.querySelector('.cart-items');
    const totalPriceEl = document.getElementById('total-price');

    // Динамическое изменение высоты поля ввода 
    /*messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto'; // Сбрасываем высоту
        messageInput.style.height = `${Math.min(messageInput.scrollHeight, 90)}px`; // Устанавливаем высоту до 3 строк
    });*/

    // Переменные состояния
    let isGuest = false; // Флаг гостевого режима
    let cart = []; // Массив товаров в корзине
    let currentUser = null; // Текущий пользователь

    // Показ основного экрана
    function showMainScreen() {
        startScreen.style.display = 'none';
        mainScreen.style.display = 'flex';
    }

    // Обработка кнопки "Регистрация"
    registerBtn.addEventListener('click', () => {
        startScreen.innerHTML = `
            <h2>Регистрация</h2>
            <input type="text" id="reg-username" placeholder="Имя пользователя">
            <input type="password" id="reg-password" placeholder="Пароль">
            <button id="reg-submit">Зарегистрироваться</button>
        `;
        document.getElementById('reg-submit').addEventListener('click', () => {
            const username = document.getElementById('reg-username').value;
            const password = document.getElementById('reg-password').value;
            if (username && password) {
                // Проверка, существует ли пользователь
                if (localStorage.getItem(username)) {
                    alert('Пользователь уже существует');
                } else {
                    localStorage.setItem(username, password); // Сохранение в localStorage
                    currentUser = username;
                    alert('Регистрация успешна');
                    showMainScreen();
                }
            }
        });
    });

    // Обработка кнопки "Вход"
    loginBtn.addEventListener('click', () => {
        startScreen.innerHTML = `
            <h2>Вход</h2>
            <input type="text" id="login-username" placeholder="Имя пользователя">
            <input type="password" id="login-password" placeholder="Пароль">
            <button id="login-submit">Войти</button>
        `;
        document.getElementById('login-submit').addEventListener('click', () => {
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const storedPassword = localStorage.getItem(username);
            if (storedPassword && storedPassword === password) {
                currentUser = username;
                alert('Вход успешен');
                showMainScreen();
            } else {
                alert('Неверное имя пользователя или пароль');
            }
        });
    });

    // Обработка кнопки "Зайти как гость"
    guestBtn.addEventListener('click', () => {
        isGuest = true;
        currentUser = null;
        showMainScreen();
    });

    // Показ/скрытие меню профиля
    profileIcon.addEventListener('click', () => {
        profileMenu.style.display = profileMenu.style.display === 'none' ? 'block' : 'none';
    });

    // Обработка выхода из профиля
    logoutBtn.addEventListener('click', () => {
        isGuest = false;
        currentUser = null;
        cart = []; // Очистка корзины при выходе
        mainScreen.style.display = 'none';
        startScreen.style.display = 'flex';
        startScreen.innerHTML = `
            <button id="register-btn">Регистрация</button>
            <button id="login-btn">Вход</button>
            <button id="guest-btn">Зайти как гость</button>
        `;
        // Перепривязка обработчиков событий
        registerBtn = document.getElementById('register-btn');
        loginBtn = document.getElementById('login-btn');
        guestBtn = document.getElementById('guest-btn');
        registerBtn.addEventListener('click', registerBtn.onclick);
        loginBtn.addEventListener('click', loginBtn.onclick);
        guestBtn.addEventListener('click', guestBtn.onclick);
    });

    // Добавление сообщения в чат
    function addMessage(sender, text) {
        const messageEl = document.createElement('div');
        messageEl.classList.add('message', sender);
        messageEl.textContent = text;
        messages.appendChild(messageEl);
        messages.scrollTop = messages.scrollHeight; // Прокрутка вниз
    }

    // Обработка отправки сообщения в чате
    sendBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            addMessage('user', message);
            processChatRequest(message); // Обработка запроса
            messageInput.value = '';
        }
    });

    // Обработка запросов в чате
    function processChatRequest(message) {
        const lowerMessage = message.toLowerCase();
    
        // Пример обработки запросов
        if (lowerMessage.includes('добавить в корзину')) {
            const productMatch = lowerMessage.match(/добавить в корзину (.+),\s*(\d+)/);
            if (productMatch) {
                const productName = productMatch[1].trim(); // Название товара
                const productPrice = parseInt(productMatch[2], 10); // Цена товара
                if (!isNaN(productPrice)) {
                    addToCart({ name: productName, price: productPrice });
                    addMessage('bot', `Добавлено в корзину: ${productName} за ${productPrice} руб.`);
                    return;
                } else {
                    addMessage('bot', 'Укажите корректную цену.');
                    return;
                }
            } else {
                addMessage('bot', 'Пожалуйста, укажите товар и его цену в формате: "добавить в корзину товар, цена".');
                return;
            }
        } else if (lowerMessage.includes('рекомендации')) {
            addMessage('bot', 'Рекомендую базовую футболку, джинсы и кроссовки для капсульного гардероба.');
            return;
        } else if (lowerMessage.includes('поиск')) {
            addMessage('bot', 'Уточните категорию, бренд или название товара.');
            return;
        }
    
        // Эмуляция ответа бота по умолчанию
        setTimeout(() => {
            addMessage('bot', 'Я могу помочь с покупками. Что вы хотите найти или добавить в корзину?');
        }, 1000);
    }

    // Добавление товара в корзину
    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        renderCart();
    }

    // Рендеринг корзины
    function renderCart() {
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item');
            const itemTotal = item.price * item.quantity; // Цена за единицу * количество
            itemEl.innerHTML = `
                <span>${item.name} - ${item.price} руб. (x${item.quantity}) = ${itemTotal} руб.</span>
                <div class="quantity-controls">
                    <button class="minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="plus" data-index="${index}">+</button>
                </div>
            `;
            cartItems.appendChild(itemEl);
            total += itemTotal;

            // Обработчики кнопок + и -
            itemEl.querySelector('.minus').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart.splice(index, 1); // Удаление товара, если количество = 0
                }
                renderCart();
            });
            itemEl.querySelector('.plus').addEventListener('click', () => {
                item.quantity++;
                renderCart();
            });
        });
        totalPriceEl.textContent = total; // Общая цена всех товаров
    }

    // Пример начального наполнения корзины
    addToCart({ name: 'Футболка', price: 500 });
    addToCart({ name: 'Джинсы', price: 2000 });
});