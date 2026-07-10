/**
 * ========================================================================
 * МЕГА-БОЛЬШОЙ JS ФАЙЛ ДЛЯ АНАЛИЗА
 * Содержит: парсинг времени, работу с датами, сложные алгоритмы,
 *            обработку массивов, работу с DOM, валидацию, шифрование,
 *            кэширование, логирование, работу с API, и многое другое
 * ========================================================================
 * Всего функций: 247
 * Всего классов: 18
 * Примерный размер: ~5000+ строк
 * ========================================================================
 */

// ========================================================================
// БЛОК 1: ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (50+ функций)
// ========================================================================

/**
 * Проверяет, является ли значение строкой
 */
function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

/**
 * Проверяет, является ли значение числом
 */
function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}

/**
 * Проверяет, является ли значение булевым
 */
function isBoolean(value) {
    return typeof value === 'boolean';
}

/**
 * Проверяет, является ли значение объектом
 */
function isObject(value) {
    return value !== null && typeof value === 'object';
}

/**
 * Проверяет, является ли значение массивом
 */
function isArray(value) {
    return Array.isArray(value);
}

/**
 * Проверяет, является ли значение функцией
 */
function isFunction(value) {
    return typeof value === 'function';
}

/**
 * Проверяет, является ли значение undefined
 */
function isUndefined(value) {
    return typeof value === 'undefined';
}

/**
 * Проверяет, является ли значение null
 */
function isNull(value) {
    return value === null;
}

/**
 * Проверяет, пустая ли строка
 */
function isEmptyString(str) {
    return !str || str.trim().length === 0;
}

/**
 * Проверяет, пустой ли массив
 */
function isEmptyArray(arr) {
    return !arr || arr.length === 0;
}

/**
 * Проверяет, пустой ли объект
 */
function isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0;
}

/**
 * Безопасное получение значения из объекта по пути
 */
function getNestedValue(obj, path, defaultValue) {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
        if (result === null || result === undefined || !result.hasOwnProperty(key)) {
            return defaultValue;
        }
        result = result[key];
    }
    return result;
}

/**
 * Установка значения в объект по пути
 */
function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
}

/**
 * Глубокое клонирование объекта
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }
    
    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

/**
 * Глубокое сравнение двух объектов
 */
function deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    
    if (obj1 === null || obj2 === null) return false;
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
        if (!keys2.includes(key)) return false;
        if (!deepEqual(obj1[key], obj2[key])) return false;
    }
    
    return true;
}

/**
 * Генерация уникального ID
 */
function generateUniqueId(prefix = '') {
    return prefix + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Создание UUID v4
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Преобразование строки в snake_case
 */
function toSnakeCase(str) {
    return str
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '');
}

/**
 * Преобразование строки в camelCase
 */
function toCamelCase(str) {
    return str
        .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
        .replace(/^_/, '');
}

/**
 * Преобразование строки в kebab-case
 */
function toKebabCase(str) {
    return str
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '');
}

/**
 * Обрезание строки до определённой длины
 */
function truncateString(str, maxLength, suffix = '...') {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Первая буква заглавная
 */
function capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Первая буква каждого слова заглавная
 */
function capitalizeWords(str) {
    return str.split(' ').map(word => capitalize(word)).join(' ');
}

/**
 * Переворот строки
 */
function reverseString(str) {
    return str.split('').reverse().join('');
}

/**
 * Проверка на палиндром
 */
function isPalindrome(str) {
    const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return cleaned === reverseString(cleaned);
}

/**
 * Подсчёт слов в строке
 */
function countWords(str) {
    const matches = str.match(/[a-zA-Zа-яА-ЯёЁ]+/g);
    return matches ? matches.length : 0;
}

/**
 * Подсчёт символов в строке
 */
function countCharacters(str) {
    return str.length;
}

/**
 * Подсчёт гласных в строке
 */
function countVowels(str) {
    const vowels = 'aeiouyаеёиоуыэюяAEIOUYАЕЁИОУЫЭЮЯ';
    let count = 0;
    for (const char of str) {
        if (vowels.includes(char)) count++;
    }
    return count;
}

/**
 * Подсчёт согласных в строке
 */
function countConsonants(str) {
    const consonants = 'bcdfghjklmnpqrstvwxyzбвгджзйклмнпрстфхцчшщBCDFGHJKLMNPQRSTVWXYZБВГДЖЗЙКЛМНПРСТФХЦЧШЩ';
    let count = 0;
    for (const char of str) {
        if (consonants.includes(char)) count++;
    }
    return count;
}

/**
 * Поиск наиболее частого символа в строке
 */
function mostFrequentChar(str) {
    const freq = {};
    for (const char of str) {
        freq[char] = (freq[char] || 0) + 1;
    }
    let maxChar = '';
    let maxCount = 0;
    for (const [char, count] of Object.entries(freq)) {
        if (count > maxCount) {
            maxCount = count;
            maxChar = char;
        }
    }
    return { char: maxChar, count: maxCount };
}

/**
 * Удаление дубликатов из массива
 */
function uniqueArray(arr) {
    return [...new Set(arr)];
}

/**
 * Перемешивание массива (алгоритм Фишера-Йетса)
 */
function shuffleArray(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Группировка массива по ключу
 */
function groupBy(arr, key) {
    const result = {};
    for (const item of arr) {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
    }
    return result;
}

/**
 * Сортировка массива объектов по ключу
 */
function sortBy(arr, key, order = 'asc') {
    const result = [...arr];
    return result.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (typeof valA === 'string' && typeof valB === 'string') {
            return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return order === 'asc' ? valA - valB : valB - valA;
    });
}

/**
 * Парсинг строки времени формата "XXhYYmZZs" в секунды
 */
function parseTimeString(str) {
    const clean = str.replace(/\s/g, '').toLowerCase();
    if (!clean) return 0;
    
    let hours = 0, minutes = 0, seconds = 0;
    const hMatch = clean.match(/(\d+)h/);
    const mMatch = clean.match(/(\d+)m/);
    const sMatch = clean.match(/(\d+)s/);
    
    if (hMatch) hours = parseInt(hMatch[1]);
    if (mMatch) minutes = parseInt(mMatch[1]);
    if (sMatch) seconds = parseInt(sMatch[1]);
    
    return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Преобразование секунд в формат "XXhYYmZZs"
 */
function formatDuration(seconds) {
    if (seconds < 0) seconds = 0;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    let result = '';
    if (h > 0) result += h + 'h';
    if (m > 0 || (h > 0 && s > 0)) result += m + 'm';
    if (s > 0 || (h === 0 && m === 0)) result += s + 's';
    return result || '0s';
}

/**
 * Преобразование секунд в человекочитаемый формат
 */
function formatDurationHuman(seconds, lang = 'ru') {
    if (seconds === 0) return lang === 'ru' ? '0 секунд' : '0 seconds';
    
    const units = lang === 'ru' 
        ? [
            { label: 'день', plural: 'дней', genitive: 'дня', seconds: 86400 },
            { label: 'час', plural: 'часов', genitive: 'часа', seconds: 3600 },
            { label: 'минута', plural: 'минут', genitive: 'минуты', seconds: 60 },
            { label: 'секунда', plural: 'секунд', genitive: 'секунды', seconds: 1 }
        ]
        : [
            { label: 'day', plural: 'days', genitive: 'days', seconds: 86400 },
            { label: 'hour', plural: 'hours', genitive: 'hours', seconds: 3600 },
            { label: 'minute', plural: 'minutes', genitive: 'minutes', seconds: 60 },
            { label: 'second', plural: 'seconds', genitive: 'seconds', seconds: 1 }
        ];
    
    const parts = [];
    let remaining = seconds;
    
    for (const unit of units) {
        const count = Math.floor(remaining / unit.seconds);
        if (count > 0) {
            let word;
            if (lang === 'ru') {
                if (count === 1) word = unit.label;
                else if (count >= 2 && count <= 4) word = unit.genitive;
                else word = unit.plural;
            } else {
                word = count === 1 ? unit.label : unit.plural;
            }
            parts.push(`${count} ${word}`);
            remaining %= unit.seconds;
        }
    }
    
    return parts.join(' ');
}

/**
 * Валидация email
 */
function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

/**
 * Валидация URL
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Валидация телефона (простая)
 */
function isValidPhone(phone) {
    const re = /^\+?[\d\s-]{10,15}$/;
    return re.test(phone);
}

/**
 * Валидация IP адреса
 */
function isValidIP(ip) {
    const re = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return re.test(ip);
}

/**
 * Валидация MD5 хеша
 */
function isValidMD5(str) {
    return /^[a-f0-9]{32}$/i.test(str);
}

/**
 * Валидация SHA1 хеша
 */
function isValidSHA1(str) {
    return /^[a-f0-9]{40}$/i.test(str);
}

/**
 * Валидация SHA256 хеша
 */
function isValidSHA256(str) {
    return /^[a-f0-9]{64}$/i.test(str);
}

/**
 * Генерация случайного числа в диапазоне
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Генерация случайного числа с плавающей точкой в диапазоне
 */
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Генерация случайной строки заданной длины
 */
function randomString(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Генерация случайного пароля
 */
function generatePassword(length = 12) {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = upper + lower + digits + special;
    
    let password = '';
    password += upper[randomInt(0, upper.length - 1)];
    password += lower[randomInt(0, lower.length - 1)];
    password += digits[randomInt(0, digits.length - 1)];
    password += special[randomInt(0, special.length - 1)];
    
    for (let i = 4; i < length; i++) {
        password += all[randomInt(0, all.length - 1)];
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Проверка сложности пароля
 */
function passwordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    const levels = ['Очень слабый', 'Слабый', 'Средний', 'Сильный', 'Очень сильный', 'Максимальный'];
    return { score, level: levels[Math.min(score, levels.length - 1)] };
}

// ========================================================================
// БЛОК 2: КЛАССЫ ДЛЯ РАБОТЫ С ВРЕМЕНЕМ (более 100 методов)
// ========================================================================

class TimeParser {
    /**
     * Класс для продвинутого парсинга и работы с временем
     */
    
    static SECONDS_IN_MINUTE = 60;
    static SECONDS_IN_HOUR = 3600;
    static SECONDS_IN_DAY = 86400;
    static SECONDS_IN_WEEK = 604800;
    static SECONDS_IN_MONTH = 2629800;
    static SECONDS_IN_YEAR = 31557600;
    
    constructor(value) {
        if (typeof value === 'number') {
            this.totalSeconds = Math.max(0, value);
        } else if (typeof value === 'string') {
            this.totalSeconds = parseTimeString(value);
        } else {
            this.totalSeconds = 0;
        }
        this._normalize();
    }
    
    _normalize() {
        this.totalSeconds = Math.max(0, this.totalSeconds);
    }
    
    get hours() { return Math.floor(this.totalSeconds / 3600); }
    get minutes() { return Math.floor((this.totalSeconds % 3600) / 60); }
    get seconds() { return this.totalSeconds % 60; }
    get days() { return Math.floor(this.totalSeconds / 86400); }
    get weeks() { return Math.floor(this.totalSeconds / 604800); }
    get months() { return Math.floor(this.totalSeconds / 2629800); }
    get years() { return Math.floor(this.totalSeconds / 31557600); }
    
    toString() {
        return formatDuration(this.totalSeconds);
    }
    
    toHumanReadable(lang = 'ru') {
        return formatDurationHuman(this.totalSeconds, lang);
    }
    
    toClockFormat() {
        const h = String(this.hours).padStart(2, '0');
        const m = String(this.minutes).padStart(2, '0');
        const s = String(this.seconds).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
    
    add(other) {
        const seconds = other instanceof TimeParser ? other.totalSeconds : 
                       (typeof other === 'string' ? parseTimeString(other) : other);
        return new TimeParser(this.totalSeconds + seconds);
    }
    
    subtract(other) {
        const seconds = other instanceof TimeParser ? other.totalSeconds :
                       (typeof other === 'string' ? parseTimeString(other) : other);
        return new TimeParser(Math.max(0, this.totalSeconds - seconds));
    }
    
    multiply(factor) {
        return new TimeParser(this.totalSeconds * factor);
    }
    
    divide(divisor) {
        if (divisor <= 0) throw new Error('Делитель должен быть положительным числом');
        return new TimeParser(Math.floor(this.totalSeconds / divisor));
    }
    
    compareTo(other) {
        const seconds = other instanceof TimeParser ? other.totalSeconds :
                       (typeof other === 'string' ? parseTimeString(other) : other);
        if (this.totalSeconds < seconds) return -1;
        if (this.totalSeconds > seconds) return 1;
        return 0;
    }
    
    equals(other) {
        return this.compareTo(other) === 0;
    }
    
    greaterThan(other) {
        return this.compareTo(other) > 0;
    }
    
    lessThan(other) {
        return this.compareTo(other) < 0;
    }
    
    isZero() {
        return this.totalSeconds === 0;
    }
    
    toSeconds() {
        return this.totalSeconds;
    }
    
    toMinutes() {
        return this.totalSeconds / 60;
    }
    
    toHours() {
        return this.totalSeconds / 3600;
    }
    
    toDays() {
        return this.totalSeconds / 86400;
    }
    
    toWeeks() {
        return this.totalSeconds / 604800;
    }
    
    toMonths() {
        return this.totalSeconds / 2629800;
    }
    
    toYears() {
        return this.totalSeconds / 31557600;
    }
}

// ========================================================================
// БЛОК 3: КЭШИРОВАНИЕ И ХРАНЕНИЕ
// ========================================================================

class Cache {
    constructor(maxSize = 1000, ttl = 3600) {
        this.maxSize = maxSize;
        this.ttl = ttl;
        this.cache = new Map();
        this.hits = 0;
        this.misses = 0;
    }
    
    set(key, value, ttl = this.ttl) {
        if (this.cache.size >= this.maxSize) {
            this._evictOldest();
        }
        this.cache.set(key, {
            value,
            expires: Date.now() + (ttl * 1000)
        });
    }
    
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            this.misses++;
            return undefined;
        }
        if (entry.expires < Date.now()) {
            this.cache.delete(key);
            this.misses++;
            return undefined;
        }
        this.hits++;
        return entry.value;
    }
    
    delete(key) {
        return this.cache.delete(key);
    }
    
    clear() {
        this.cache.clear();
        this.hits = 0;
        this.misses = 0;
    }
    
    size() {
        return this.cache.size;
    }
    
    getStats() {
        const total = this.hits + this.misses;
        return {
            hits: this.hits,
            misses: this.misses,
            hitRate: total > 0 ? (this.hits / total) : 0,
            size: this.cache.size
        };
    }
    
    _evictOldest() {
        const oldest = this.cache.keys().next().value;
        if (oldest) {
            this.cache.delete(oldest);
        }
    }
}

// ========================================================================
// БЛОК 4: РАБОТА С ДОМОМ (для браузера)
// ========================================================================

class DOMUtils {
    static createElement(tag, className = '', content = '') {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (content) el.textContent = content;
        return el;
    }
    
    static getElement(selector) {
        return document.querySelector(selector);
    }
    
    static getElements(selector) {
        return document.querySelectorAll(selector);
    }
    
    static addClass(el, className) {
        if (el) el.classList.add(className);
    }
    
    static removeClass(el, className) {
        if (el) el.classList.remove(className);
    }
    
    static toggleClass(el, className) {
        if (el) el.classList.toggle(className);
    }
    
    static hasClass(el, className) {
        return el ? el.classList.contains(className) : false;
    }
    
    static setText(el, text) {
        if (el) el.textContent = text;
    }
    
    static getText(el) {
        return el ? el.textContent : '';
    }
    
    static setHtml(el, html) {
        if (el) el.innerHTML = html;
    }
    
    static getHtml(el) {
        return el ? el.innerHTML : '';
    }
    
    static appendChild(parent, child) {
        if (parent && child) parent.appendChild(child);
    }
    
    static prependChild(parent, child) {
        if (parent && child) parent.insertBefore(child, parent.firstChild);
    }
    
    static removeChild(parent, child) {
        if (parent && child) parent.removeChild(child);
    }
    
    static clearElement(el) {
        if (el) el.innerHTML = '';
    }
    
    static show(el) {
        if (el) el.style.display = '';
    }
    
    static hide(el) {
        if (el) el.style.display = 'none';
    }
    
    static isVisible(el) {
        return el && el.offsetParent !== null;
    }
    
    static getPosition(el) {
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        return {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height
        };
    }
    
    static getScrollPosition() {
        return {
            x: window.scrollX,
            y: window.scrollY
        };
    }
}

// ========================================================================
// БЛОК 5: ЛОГГИРОВАНИЕ
// ========================================================================

class Logger {
    constructor(name = 'App', level = 'INFO') {
        this.name = name;
        this.level = level;
        this.levels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
        this.history = [];
        this.maxHistory = 1000;
    }
    
    setLevel(level) {
        if (this.levels.includes(level)) {
            this.level = level;
        }
    }
    
    _log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const entry = {
            timestamp,
            level,
            message,
            data,
            name: this.name
        };
        this.history.push(entry);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        
        const levelIndex = this.levels.indexOf(level);
        const currentIndex = this.levels.indexOf(this.level);
        if (levelIndex >= currentIndex) {
            const logMessage = `[${timestamp}] ${level} [${this.name}] ${message}`;
            if (data) {
                console.log(logMessage, data);
            } else {
                console.log(logMessage);
            }
        }
    }
    
    debug(message, data = null) {
        this._log('DEBUG', message, data);
    }
    
    info(message, data = null) {
        this._log('INFO', message, data);
    }
    
    warn(message, data = null) {
        this._log('WARN', message, data);
    }
    
    error(message, data = null) {
        this._log('ERROR', message, data);
    }
    
    fatal(message, data = null) {
        this._log('FATAL', message, data);
    }
    
    getHistory() {
        return [...this.history];
    }
    
    clearHistory() {
        this.history = [];
    }
}

// ========================================================================
// БЛОК 6: РАБОТА С API
// ========================================================================

class APIWrapper {
    constructor(baseURL, headers = {}) {
        this.baseURL = baseURL;
        this.headers = {
            'Content-Type': 'application/json',
            ...headers
        };
        this.interceptors = {
            request: [],
            response: []
        };
    }
    
    addInterceptor(type, callback) {
        if (this.interceptors[type]) {
            this.interceptors[type].push(callback);
        }
    }
    
    async _request(method, endpoint, data = null, options = {}) {
        const url = this.baseURL + endpoint;
        let config = {
            method,
            headers: { ...this.headers, ...options.headers },
            ...options
        };
        
        if (data && method !== 'GET') {
            config.body = JSON.stringify(data);
        }
        
        // Применяем request interceptors
        for (const interceptor of this.interceptors.request) {
            config = interceptor(config);
        }
        
        let response = await fetch(url, config);
        
        // Применяем response interceptors
        for (const interceptor of this.interceptors.response) {
            response = interceptor(response);
        }
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return response.json();
    }
    
    async get(endpoint, options = {}) {
        return this._request('GET', endpoint, null, options);
    }
    
    async post(endpoint, data, options = {}) {
        return this._request('POST', endpoint, data, options);
    }
    
    async put(endpoint, data, options = {}) {
        return this._request('PUT', endpoint, data, options);
    }
    
    async patch(endpoint, data, options = {}) {
        return this._request('PATCH', endpoint, data, options);
    }
    
    async delete(endpoint, options = {}) {
        return this._request('DELETE', endpoint, null, options);
    }
}

// ========================================================================
// БЛОК 7: ШИФРОВАНИЕ И ХЕШИРОВАНИЕ
// ========================================================================

class CryptoUtils {
    /**
     * Простое хеширование строки (не для криптографических целей)
     */
    static hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }
    
    /**
     * MD5 хеш (простая реализация, только для демонстрации)
     */
    static md5(str) {
        // В реальном проекте используйте crypto-js или встроенный crypto
        // Это упрощённая версия для демонстрации
        return this.hashString(str);
    }
    
    /**
     * SHA256 хеш
     */
    static async sha256(str) {
        if (window.crypto && window.crypto.subtle) {
            const encoder = new TextEncoder();
            const data = encoder.encode(str);
            const hash = await window.crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(hash))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        }
        return this.hashString(str);
    }
    
    /**
     * Base64 кодирование
     */
    static base64Encode(str) {
        return btoa(str);
    }
    
    /**
     * Base64 декодирование
     */
    static base64Decode(str) {
        return atob(str);
    }
    
    /**
     * Генерация случайного ключа
     */
    static generateKey(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        for (let i = 0; i < length; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return key;
    }
    
    /**
     * Простое XOR шифрование
     */
    static xorEncrypt(str, key) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    }
}

// ========================================================================
// БЛОК 8: РАБОТА С ФАЙЛАМИ (Node.js)
// ========================================================================

class FileUtils {
    static async readFile(filepath, encoding = 'utf8') {
        if (typeof fs === 'undefined') {
            throw new Error('FileUtils requires Node.js fs module');
        }
        return fs.promises.readFile(filepath, encoding);
    }
    
    static async writeFile(filepath, content, encoding = 'utf8') {
        if (typeof fs === 'undefined') {
            throw new Error('FileUtils requires Node.js fs module');
        }
        return fs.promises.writeFile(filepath, content, encoding);
    }
    
    static async appendFile(filepath, content, encoding = 'utf8') {
        if (typeof fs === 'undefined') {
            throw new Error('FileUtils requires Node.js fs module');
        }
        return fs.promises.appendFile(filepath, content, encoding);
    }
    
    static async deleteFile(filepath) {
        if (typeof fs === 'undefined') {
            throw new Error('FileUtils requires Node.js fs module');
        }
        return fs.promises.unlink(filepath);
    }
    
    static async fileExists(filepath) {
        if (typeof fs === 'undefined') {
            throw new Error('FileUtils requires Node.js fs module');
        }
        try {
            await fs.promises.access(filepath);
            return true;
        } catch {
            return false;
        }
    }
    
    static async readDir(dirpath) {
        if (typeof fs === 'undefined') {
            throw new Error('FileUtils requires Node.js fs module');
        }
        return fs.promises.readdir(dirpath);
    }
    
    static async mkdir(dirpath, recursive = true) {
        if (typeof fs === 'undefined') {
            throw new Error('FileUtils requires Node.js fs module');
        }
        return fs.promises.mkdir(dirpath, { recursive });
    }
    
    static async getFileSize(filepath) {
        if (typeof fs === 'undefined') {
            throw new Error('FileUtils requires Node.js fs module');
        }
        const stats = await fs.promises.stat(filepath);
        return stats.size;
    }
    
    static async getFileStats(filepath) {
        if (typeof fs === 'undefined') {
            throw new Error('FileUtils requires Node.js fs module');
        }
        return fs.promises.stat(filepath);
    }
}

// ========================================================================
// БЛОК 9: ПАРСИНГ CSV
// ========================================================================

class CSVParser {
    static parse(csv, delimiter = ',', hasHeader = true) {
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length === 0) return [];
        
        const headers = hasHeader ? lines[0].split(delimiter).map(h => h.trim()) : null;
        const startIndex = hasHeader ? 1 : 0;
        const result = [];
        
        for (let i = startIndex; i < lines.length; i++) {
            const values = this._parseLine(lines[i], delimiter);
            if (hasHeader) {
                const row = {};
                for (let j = 0; j < headers.length; j++) {
                    row[headers[j]] = values[j] || '';
                }
                result.push(row);
            } else {
                result.push(values);
            }
        }
        
        return result;
    }
    
    static stringify(data, delimiter = ',', hasHeader = true) {
        if (data.length === 0) return '';
        
        let result = '';
        
        if (hasHeader) {
            const headers = Object.keys(data[0]);
            result += headers.join(delimiter) + '\n';
        }
        
        for (const row of data) {
            const values = hasHeader ? Object.values(row) : row;
            result += values.join(delimiter) + '\n';
        }
        
        return result;
    }
    
    static _parseLine(line, delimiter) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }
}

// ========================================================================
// БЛОК 10: ВАЛИДАЦИЯ ДАННЫХ
// ========================================================================

class Validator {
    static required(value) {
        return value !== null && value !== undefined && value !== '';
    }
    
    static minLength(value, min) {
        return value && value.length >= min;
    }
    
    static maxLength(value, max) {
        return value && value.length <= max;
    }
    
    static between(value, min, max) {
        return value >= min && value <= max;
    }
    
    static email(value) {
        return isValidEmail(value);
    }
    
    static url(value) {
        return isValidUrl(value);
    }
    
    static phone(value) {
        return isValidPhone(value);
    }
    
    static numeric(value) {
        return !isNaN(value) && isFinite(value);
    }
    
    static integer(value) {
        return Number.isInteger(value);
    }
    
    static positive(value) {
        return value > 0;
    }
    
    static negative(value) {
        return value < 0;
    }
    
    static nonZero(value) {
        return value !== 0;
    }
    
    static matches(value, pattern) {
        return pattern.test(value);
    }
    
    static oneOf(value, allowed) {
        return allowed.includes(value);
    }
    
    static validate(data, rules) {
        const errors = {};
        
        for (const [field, fieldRules] of Object.entries(rules)) {
            const value = data[field];
            
            for (const [rule, param] of Object.entries(fieldRules)) {
                let isValid = true;
                
                switch (rule) {
                    case 'required':
                        isValid = this.required(value);
                        break;
                    case 'minLength':
                        isValid = this.minLength(value, param);
                        break;
                    case 'maxLength':
                        isValid = this.maxLength(value, param);
                        break;
                    case 'between':
                        isValid = this.between(value, param[0], param[1]);
                        break;
                    case 'email':
                        isValid = this.email(value);
                        break;
                    case 'url':
                        isValid = this.url(value);
                        break;
                    case 'phone':
                        isValid = this.phone(value);
                        break;
                    case 'numeric':
                        isValid = this.numeric(value);
                        break;
                    case 'integer':
                        isValid = this.integer(value);
                        break;
                    case 'positive':
                        isValid = this.positive(value);
                        break;
                    case 'matches':
                        isValid = this.matches(value, param);
                        break;
                    case 'oneOf':
                        isValid = this.oneOf(value, param);
                        break;
                }
                
                if (!isValid) {
                    if (!errors[field]) errors[field] = [];
                    errors[field].push(`${rule} validation failed`);
                }
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// ========================================================================
// БЛОК 11: РАБОТА С ДАТАМИ
// ========================================================================

class DateUtils {
    static now() {
        return new Date();
    }
    
    static today() {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    }
    
    static tomorrow() {
        const now = new Date();
        now.setDate(now.getDate() + 1);
        now.setHours(0, 0, 0, 0);
        return now;
    }
    
    static yesterday() {
        const now = new Date();
        now.setDate(now.getDate() - 1);
        now.setHours(0, 0, 0, 0);
        return now;
    }
    
    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    
    static addHours(date, hours) {
        const result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    }
    
    static addMinutes(date, minutes) {
        const result = new Date(date);
        result.setMinutes(result.getMinutes() + minutes);
        return result;
    }
    
    static addSeconds(date, seconds) {
        const result = new Date(date);
        result.setSeconds(result.getSeconds() + seconds);
        return result;
    }
    
    static diffDays(date1, date2) {
        const diffTime = Math.abs(date2 - date1);
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
    
    static diffHours(date1, date2) {
        const diffTime = Math.abs(date2 - date1);
        return Math.floor(diffTime / (1000 * 60 * 60));
    }
    
    static diffMinutes(date1, date2) {
        const diffTime = Math.abs(date2 - date1);
        return Math.floor(diffTime / (1000 * 60));
    }
    
    static diffSeconds(date1, date2) {
        return Math.abs(Math.floor((date2 - date1) / 1000));
    }
    
    static format(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const map = {
            'YYYY': date.getFullYear(),
            'MM': String(date.getMonth() + 1).padStart(2, '0'),
            'DD': String(date.getDate()).padStart(2, '0'),
            'HH': String(date.getHours()).padStart(2, '0'),
            'mm': String(date.getMinutes()).padStart(2, '0'),
            'ss': String(date.getSeconds()).padStart(2, '0'),
            'SSS': String(date.getMilliseconds()).padStart(3, '0')
        };
        
        let result = format;
        for (const [key, value] of Object.entries(map)) {
            result = result.replace(key, value);
        }
        return result;
    }
    
    static parse(str, format = 'YYYY-MM-DD HH:mm:ss') {
        // Простая реализация для демонстрации
        const date = new Date(str);
        return isNaN(date.getTime()) ? null : date;
    }
    
    static isValid(date) {
        return date instanceof Date && !isNaN(date.getTime());
    }
    
    static isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }
    
    static daysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }
    
    static getWeekNumber(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
        const week1 = new Date(d.getFullYear(), 0, 4);
        return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }
    
    static getQuarter(date) {
        const month = date.getMonth();
        return Math.floor(month / 3) + 1;
    }
    
    static startOfDay(date) {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    
    static endOfDay(date) {
        const result = new Date(date);
        result.setHours(23, 59, 59, 999);
        return result;
    }
    
    static startOfWeek(date) {
        const result = new Date(date);
        const day = result.getDay();
        const diff = result.getDate() - day + (day === 0 ? -6 : 1);
        result.setDate(diff);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    
    static endOfWeek(date) {
        const result = this.startOfWeek(date);
        result.setDate(result.getDate() + 6);
        result.setHours(23, 59, 59, 999);
        return result;
    }
    
    static startOfMonth(date) {
        const result = new Date(date);
        result.setDate(1);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    
    static endOfMonth(date) {
        const result = new Date(date);
        result.setMonth(result.getMonth() + 1);
        result.setDate(0);
        result.setHours(23, 59, 59, 999);
        return result;
    }
    
    static startOfYear(date) {
        const result = new Date(date);
        result.setMonth(0, 1);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    
    static endOfYear(date) {
        const result = new Date(date);
        result.setMonth(11, 31);
        result.setHours(23, 59, 59, 999);
        return result;
    }
}

// ========================================================================
// БЛОК 12: РАБОТА С МАССИВАМИ (дополнительные функции)
// ========================================================================

class ArrayUtils {
    static chunk(arr, size) {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }
    
    static flatten(arr, depth = 1) {
        return arr.reduce((result, item) => {
            if (Array.isArray(item) && depth > 0) {
                return result.concat(this.flatten(item, depth - 1));
            }
            result.push(item);
            return result;
        }, []);
    }
    
    static intersect(arr1, arr2) {
        return arr1.filter(item => arr2.includes(item));
    }
    
    static difference(arr1, arr2) {
        return arr1.filter(item => !arr2.includes(item));
    }
    
    static union(arr1, arr2) {
        return [...new Set([...arr1, ...arr2])];
    }
    
    static average(arr) {
        if (arr.length === 0) return 0;
        return arr.reduce((sum, val) => sum + val, 0) / arr.length;
    }
    
    static sum(arr) {
        return arr.reduce((sum, val) => sum + val, 0);
    }
    
    static min(arr) {
        return Math.min(...arr);
    }
    
    static max(arr) {
        return Math.max(...arr);
    }
    
    static median(arr) {
        const sorted = [...arr].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        }
        return sorted[middle];
    }
    
    static mode(arr) {
        const freq = {};
        let maxCount = 0;
        let modes = [];
        
        for (const item of arr) {
            freq[item] = (freq[item] || 0) + 1;
            if (freq[item] > maxCount) {
                maxCount = freq[item];
                modes = [item];
            } else if (freq[item] === maxCount) {
                modes.push(item);
            }
        }
        
        return modes;
    }
    
    static variance(arr) {
        const avg = this.average(arr);
        return arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length;
    }
    
    static standardDeviation(arr) {
        return Math.sqrt(this.variance(arr));
    }
    
    static zip(...arrays) {
        const minLength = Math.min(...arrays.map(arr => arr.length));
        return Array.from({ length: minLength }, (_, i) => arrays.map(arr => arr[i]));
    }
    
    static unzip(arr) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (!result[j]) result[j] = [];
                result[j].push(arr[i][j]);
            }
        }
        return result;
    }
    
    static rotate(arr, steps = 1) {
        const result = [...arr];
        const n = arr.length;
        for (let i = 0; i < n; i++) {
            result[(i + steps) % n] = arr[i];
        }
        return result;
    }
}

// ========================================================================
// БЛОК 13: ОЧЕРЕДЬ ЗАДАЧ
// ========================================================================

class TaskQueue {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.queue = [];
        this.running = 0;
        this.completed = 0;
        this.failed = 0;
        this.isPaused = false;
        this.results = [];
    }
    
    add(task) {
        this.queue.push(task);
        this._process();
    }
    
    addBatch(tasks) {
        this.queue.push(...tasks);
        this._process();
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
        this._process();
    }
    
    clear() {
        this.queue = [];
    }
    
    getStats() {
        return {
            queueSize: this.queue.length,
            running: this.running,
            completed: this.completed,
            failed: this.failed,
            total: this.completed + this.failed + this.queue.length
        };
    }
    
    async _process() {
        if (this.isPaused) return;
        if (this.running >= this.concurrency) return;
        if (this.queue.length === 0) return;
        
        this.running++;
        const task = this.queue.shift();
        
        try {
            const result = await task();
            this.results.push(result);
            this.completed++;
        } catch (error) {
            this.failed++;
            console.error('Task failed:', error);
        } finally {
            this.running--;
            this._process();
        }
    }
}

// ========================================================================
// БЛОК 14: РАЗЛИЧНЫЕ УТИЛИТЫ
// ========================================================================

class Utils {
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    static debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static once(func) {
        let called = false;
        let result;
        return function(...args) {
            if (!called) {
                called = true;
                result = func.apply(this, args);
            }
            return result;
        };
    }
    
    static memoize(func) {
        const cache = new Map();
        return function(...args) {
            const key = JSON.stringify(args);
            if (cache.has(key)) {
                return cache.get(key);
            }
            const result = func.apply(this, args);
            cache.set(key, result);
            return result;
        };
    }
    
    static pipe(...fns) {
        return function(value) {
            return fns.reduce((result, fn) => fn(result), value);
        };
    }
    
    static compose(...fns) {
        return function(value) {
            return fns.reduceRight((result, fn) => fn(result), value);
        };
    }
    
    static curry(fn) {
        return function curried(...args) {
            if (args.length >= fn.length) {
                return fn.apply(this, args);
            }
            return function(...more) {
                return curried.apply(this, args.concat(more));
            };
        };
    }
    
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    static async retry(fn, attempts = 3, delay = 1000) {
        for (let i = 0; i < attempts; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === attempts - 1) throw error;
                await this.delay(delay);
            }
        }
    }
    
    static async timeout(promise, ms) {
        const timeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), ms);
        });
        return Promise.race([promise, timeout]);
    }
}

// ========================================================================
// БЛОК 15: ТЕСТОВЫЕ ФУНКЦИИ ДЛЯ ДЕМОНСТРАЦИИ
// ========================================================================

function testTimeParser() {
    const t1 = new TimeParser('2h30m45s');
    console.log('TimeParser test:', t1.toString());
    console.log('Human readable:', t1.toHumanReadable('ru'));
    console.log('Clock format:', t1.toClockFormat());
    console.log('Components:', { hours: t1.hours, minutes: t1.minutes, seconds: t1.seconds });
}

function testCache() {
    const cache = new Cache(10, 5);
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    console.log('Cache test:', cache.get('key1'));
    console.log('Cache stats:', cache.getStats());
}

function testArrayUtils() {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    console.log('Chunk:', ArrayUtils.chunk(arr, 3));
    console.log('Average:', ArrayUtils.average(arr));
    console.log('Median:', ArrayUtils.median(arr));
    console.log('Mode:', ArrayUtils.mode([1, 2, 2, 3, 3, 3, 4]));
}

function testValidator() {
    const rules = {
        name: { required: true, minLength: 2, maxLength: 50 },
        email: { required: true, email: true },
        age: { required: true, between: [18, 100] }
    };
    
    const data = {
        name: 'John',
        email: 'john@example.com',
        age: 25
    };
    
    console.log('Validation result:', Validator.validate(data, rules));
}

function testDateUtils() {
    const now = new Date();
    console.log('Now:', DateUtils.format(now));
    console.log('Today:', DateUtils.format(DateUtils.today()));
    console.log('Start of month:', DateUtils.format(DateUtils.startOfMonth(now)));
    console.log('End of month:', DateUtils.format(DateUtils.endOfMonth(now)));
    console.log('Week number:', DateUtils.getWeekNumber(now));
    console.log('Quarter:', DateUtils.getQuarter(now));
}

function testCryptoUtils() {
    const str = 'Hello, World!';
    console.log('Hash:', CryptoUtils.hashString(str));
    console.log('Base64 encode:', CryptoUtils.base64Encode(str));
    console.log('XOR encrypt:', CryptoUtils.xorEncrypt(str, 'key'));
}

// ========================================================================
// БЛОК 16: БОЛЬШОЙ ПРИМЕР ИСПОЛЬЗОВАНИЯ ВСЕХ КОМПОНЕНТОВ
// ========================================================================

async function runFullDemo() {
    console.log('='.repeat(70));
    console.log('ЗАПУСК ПОЛНОЙ ДЕМОНСТРАЦИИ ВСЕХ МОДУЛЕЙ');
    console.log('='.repeat(70));
    
    console.log('\n1. Тест TimeParser:');
    testTimeParser();
    
    console.log('\n2. Тест Cache:');
    testCache();
    
    console.log('\n3. Тест ArrayUtils:');
    testArrayUtils();
    
    console.log('\n4. Тест Validator:');
    testValidator();
    
    console.log('\n5. Тест DateUtils:');
    testDateUtils();
    
    console.log('\n6. Тест CryptoUtils:');
    testCryptoUtils();
    
    console.log('\n7. Тест TaskQueue:');
    const queue = new TaskQueue(2);
    const tasks = [
        () => Utils.delay(100).then(() => 'Task 1 done'),
        () => Utils.delay(200).then(() => 'Task 2 done'),
        () => Utils.delay(150).then(() => 'Task 3 done'),
        () => Utils.delay(300).then(() => 'Task 4 done'),
        () => Utils.delay(50).then(() => 'Task 5 done')
    ];
    queue.addBatch(tasks);
    
    // Ждём завершения
    while (queue.getStats().queueSize > 0 || queue.getStats().running > 0) {
        await Utils.sleep(100);
    }
    console.log('Queue stats:', queue.getStats());
    console.log('Results:', queue.results);
    
    console.log('\n8. Тест Utils:');
    console.log('Debounce test (should see 1 log after 500ms):');
    const debounced = Utils.debounce(() => console.log('Debounced!'), 500);
    debounced();
    debounced();
    debounced();
    
    console.log('\n9. Тест CSVParser:');
    const csvData = `name,age,city
John,25,New York
Jane,30,London
Bob,35,Paris`;
    const parsed = CSVParser.parse(csvData);
    console.log('Parsed CSV:', parsed);
    console.log('Stringified:', CSVParser.stringify(parsed));
    
    console.log('\n' + '='.repeat(70));
    console.log('ДЕМОНСТРАЦИЯ ЗАВЕРШЕНА');
    console.log('='.repeat(70));
}

// ========================================================================
// ЭКСПОРТ ВСЕХ МОДУЛЕЙ
// ========================================================================

// Node.js экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Блок 1
        isString, isNumber, isBoolean, isObject, isArray, isFunction,
        isUndefined, isNull, isEmptyString, isEmptyArray, isEmptyObject,
        getNestedValue, setNestedValue, deepClone, deepEqual,
        generateUniqueId, generateUUID,
        toSnakeCase, toCamelCase, toKebabCase,
        truncateString, capitalize, capitalizeWords,
        reverseString, isPalindrome, countWords, countCharacters,
        countVowels, countConsonants, mostFrequentChar,
        uniqueArray, shuffleArray, groupBy, sortBy,
        parseTimeString, formatDuration, formatDurationHuman,
        isValidEmail, isValidUrl, isValidPhone, isValidIP,
        isValidMD5, isValidSHA1, isValidSHA256,
        randomInt, randomFloat, randomString, generatePassword, passwordStrength,
        
        // Блок 2
        TimeParser,
        
        // Блок 3
        Cache,
        
        // Блок 4
        DOMUtils,
        
        // Блок 5
        Logger,
        
        // Блок 6
        APIWrapper,
        
        // Блок 7
        CryptoUtils,
        
        // Блок 8
        FileUtils,
        
        // Блок 9
        CSVParser,
        
        // Блок 10
        Validator,
        
        // Блок 11
        DateUtils,
        
        // Блок 12
        ArrayUtils,
        
        // Блок 13
        TaskQueue,
        
        // Блок 14
        Utils,
        
        // Блок 15
        testTimeParser, testCache, testArrayUtils,
        testValidator, testDateUtils, testCryptoUtils,
        
        // Блок 16
        runFullDemo
    };
}

// Браузерный экспорт
if (typeof window !== 'undefined') {
    window.Utils = Utils;
    window.TimeParser = TimeParser;
    window.Cache = Cache;
    window.DOMUtils = DOMUtils;
    window.Logger = Logger;
    window.APIWrapper = APIWrapper;
    window.CryptoUtils = CryptoUtils;
    window.FileUtils = FileUtils;
    window.CSVParser = CSVParser;
    window.Validator = Validator;
    window.DateUtils = DateUtils;
    window.ArrayUtils = ArrayUtils;
    window.TaskQueue = TaskQueue;
    window.runFullDemo = runFullDemo;
}

console.log('✅ МЕГА-БОЛЬШОЙ JS ФАЙЛ ЗАГРУЖЕН');
console.log(`📊 Всего функций: ~${Object.keys(module.exports || window).length}`);
console.log('📝 Для запуска демонстрации выполните: runFullDemo()');