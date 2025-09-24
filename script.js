// I18n
const I18N_DICTIONARY = {
	ru: {
		title: 'Футбольные прогнозы 2.0',
		download_app: 'Скачать приложение',
		version_prefix: 'Версия',
		features: { predictions: 'Прогнозы', statistics: 'Статистика', h2h: '1 vs 2' },
		toast_preparing: 'Идет подготовка загрузки...',
		toast_start: 'Загрузка APK начнется сейчас...'
	},
	en: {
		title: 'Football Predictions 2.0',
		download_app: 'Download App',
		version_prefix: 'Version',
		features: { predictions: 'Predictions', statistics: 'Statistics', h2h: 'Head-to-Head' },
		toast_preparing: 'Preparing download...',
		toast_start: 'APK download will start now...'
	}
};

function getSavedLang() {
	return localStorage.getItem('lang') || 'ru';
}

function setLang(langCode) {
	const next = langCode === 'ru' || langCode === 'en' ? langCode : 'ru';
	localStorage.setItem('lang', next);
	applyTranslations(next);
	updateLangToggle(next);
	const html = document.documentElement;
	if (html) html.setAttribute('lang', next);
}

function updateLangToggle(langCode) {
	const btn = document.querySelector('.lang-toggle');
	if (!btn) return;
	btn.textContent = langCode === 'ru' ? 'EN' : 'RU';
	btn.setAttribute('aria-label', langCode === 'ru' ? 'Switch language to English' : 'Сменить язык на русский');
}

function applyTranslations(langCode) {
	const dict = I18N_DICTIONARY[langCode] || I18N_DICTIONARY.ru;
	// Simple keys
	document.querySelectorAll('[data-i18n]').forEach((el) => {
		const key = el.getAttribute('data-i18n');
		if (!key) return;
		const parts = key.split('.');
		let value = dict;
		for (const part of parts) {
			value = value && value[part];
		}
		if (typeof value === 'string') {
			el.textContent = value;
		}
	});
	// Version label: keep number separate
	const prefixEl = document.querySelector('.version-prefix');
	if (prefixEl) prefixEl.textContent = dict.version_prefix;
}

function initLang() {
	const saved = getSavedLang();
	applyTranslations(saved);
	updateLangToggle(saved);
	const btn = document.querySelector('.lang-toggle');
	if (btn && !btn.__bound) {
		btn.addEventListener('click', () => {
			const current = getSavedLang();
			setLang(current === 'ru' ? 'en' : 'ru');
		});
		btn.__bound = true;
	}
	// Ensure html lang attribute
	const html = document.documentElement;
	if (html) html.setAttribute('lang', saved);
}

// Функция для скачивания приложения
function downloadApp() {
	// Показываем уведомление о скачивании
	const dict = I18N_DICTIONARY[getSavedLang()] || I18N_DICTIONARY.ru;
	showDownloadNotification(dict.toast_preparing);

	// Если уже знаем актуальную ссылку на APK — качаем сразу
	if (window.__latestApkUrl) {
		triggerDirectDownload(window.__latestApkUrl);
		return;
	}

	// Иначе пытаемся получить последнюю ссылку из GitHub Releases
	fetchLatestApkUrl()
		.then((apkUrl) => {
			if (apkUrl) {
				triggerDirectDownload(apkUrl);
			} else {
				// Фолбэк на фиксированную версию
				triggerDirectDownload('https://github.com/footballpredictions/footballpredictions.github.io/releases/download/v2.0.2/FootballPredictions-release.apk');
			}
		})
		.catch(() => {
			triggerDirectDownload('https://github.com/footballpredictions/footballpredictions.github.io/releases/download/v2.0.2/FootballPredictions-release.apk');
		});
}

function triggerDirectDownload(url) {
    const dict = I18N_DICTIONARY[getSavedLang()] || I18N_DICTIONARY.ru;
    showDownloadNotification(dict.toast_start);
	const downloadBtn = document.querySelector('.download-btn');
	if (downloadBtn) {
		downloadBtn.style.transform = 'scale(0.95)';
		setTimeout(() => { downloadBtn.style.transform = ''; }, 150);
	}
	// Прямой переход на файл APK
	window.location.href = url;
}

// Получение последнего релиза и ссылки на APK
async function fetchLatestApkUrl() {
	try {
		const res = await fetch('https://api.github.com/repos/footballpredictions/FootballAdminData/releases/latest', {
			headers: { 'Accept': 'application/vnd.github+json' }
		});
		if (!res.ok) throw new Error('Failed to fetch latest release');
		const data = await res.json();
		// Ищем asset c расширением .apk
		const apkAsset = Array.isArray(data.assets) ? data.assets.find(a => typeof a.browser_download_url === 'string' && a.browser_download_url.toLowerCase().endsWith('.apk')) : null;
		if (apkAsset && apkAsset.browser_download_url) {
			window.__latestApkUrl = apkAsset.browser_download_url;
			window.__latestVersionTag = data.tag_name || '';
			updateVersionLabel(window.__latestVersionTag);
			return window.__latestApkUrl;
		}
		return null;
	} catch (e) {
		return null;
	}
}

function updateVersionLabel(tag) {
	if (!tag) return;
	const el = document.querySelector('.version-info');
	if (el) {
        const prefixEl = el.querySelector('.version-prefix');
        const numberEl = el.querySelector('.version-number');
        if (prefixEl && numberEl) {
            numberEl.textContent = tag;
        } else {
            el.textContent = `${tag}`;
        }
	}
}

// Показ уведомления о скачивании
function showDownloadNotification(text) {
	// Создаем элемент уведомления
	const notification = document.createElement('div');
	notification.className = 'download-notification';
	notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">📱</span>
            <span class="notification-text">${text || 'Переход к странице загрузки...'}</span>
        </div>
    `;
	// Добавляем стили для уведомления
	notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
        font-family: 'Roboto', sans-serif;
    `;
	// Добавляем уведомление на страницу
	document.body.appendChild(notification);
	// Удаляем уведомление через 3 секунды
	setTimeout(() => {
		notification.style.animation = 'slideOutRight 0.5s ease-in';
		setTimeout(() => {
			if (notification.parentNode) {
				notification.parentNode.removeChild(notification);
			}
		}, 500);
	}, 3000);
}

// Дополнительные эффекты при загрузке страницы
// (Удалены летающие элементы)
function initPage() {
	// Опционально подгрузим актуальную версию, чтобы сразу показать ее пользователю
	fetchLatestApkUrl();
	// Звуковой эффект остаётся опциональным
	addSoundEffects();
	// Init language
	initLang();
	// Безопасная обработка ошибок загрузки изображения мяча (под CSP без inline)
	const ballImg = document.querySelector('.ball-image');
	if (ballImg && !ballImg.__bound) {
		ballImg.addEventListener('error', () => {
			ballImg.style.display = 'none';
			const fallback = ballImg.nextElementSibling;
			if (fallback) fallback.style.display = 'block';
		});
		ballImg.__bound = true;
	}

	// Назначаем обработчик кнопке скачивания вместо inline-обработчика
	const downloadBtn = document.querySelector('.download-btn');
	if (downloadBtn && !downloadBtn.__bound) {
		downloadBtn.addEventListener('click', downloadApp);
		downloadBtn.__bound = true;
	}

	// Лёгкая защита буфера обмена: предупреждаем при копировании/вставке ссылок
	setupClipboardGuards();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initPage);
} else {
	initPage();
}

// Звуковые эффекты (опционально)
function addSoundEffects() {
	// Создаем аудио контекст для звуковых эффектов
	let audioContext;
	function playClickSound() {
		if (!audioContext) {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
		}
		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();
		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);
		oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
		gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
		oscillator.start(audioContext.currentTime);
		oscillator.stop(audioContext.currentTime + 0.1);
	}
	const downloadBtn = document.querySelector('.download-btn');
	if (downloadBtn) downloadBtn.addEventListener('click', playClickSound);
}

// Обработка ошибок
window.addEventListener('error', function(e) {
	console.log('Произошла ошибка:', e.message);
});

// Предотвращение контекстного меню на мяче для лучшего UX
document.addEventListener('contextmenu', function(e) {
	if (e.target.closest('.football-ball')) {
		e.preventDefault();
	}
});

// Поддержка клавиатуры
document.addEventListener('keydown', function(e) {
	if (e.key === 'Enter' || e.key === ' ') {
		const downloadBtn = document.querySelector('.download-btn');
		if (document.activeElement === downloadBtn) {
			downloadApp();
		}
	}
});

// Параллакс заголовка при скролле
window.addEventListener('scroll', function() {
	const scrolled = window.pageYOffset;
	const parallax = document.querySelector('.splash-screen');
	const speed = scrolled * 0.5;
	if (parallax) {
		parallax.style.transform = `translateY(${speed}px)`;
	}
});

// Минимальная защита от копирования/вставки ссылок и простого хотлинкинга
function setupClipboardGuards() {
	// Блокируем drag-n-drop внешних ресурсов внутрь страницы
	document.addEventListener('dragover', (e) => e.preventDefault());
	document.addEventListener('drop', (e) => e.preventDefault());

	// Предупреждение при копировании текста
	document.addEventListener('copy', (e) => {
		const selection = document.getSelection();
		if (selection && selection.toString().length > 0) {
			showTransientNotice('Копирование включено. Пожалуйста, указывайте источник.');
		}
	});

	// Предупреждение при вставке URL
	document.addEventListener('paste', (e) => {
		const text = (e.clipboardData || window.clipboardData).getData('text');
		if (/https?:\/\//i.test(text)) {
			showTransientNotice('Вставка ссылок ограничена политикой сайта.');
		}
	});
}

function showTransientNotice(message) {
	const notice = document.createElement('div');
	notice.textContent = message;
	notice.style.cssText = 'position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,.7); color: #fff; padding: 8px 12px; border-radius: 8px; z-index: 1100; font-size: 14px;';
	document.body.appendChild(notice);
	setTimeout(() => { notice.remove(); }, 2200);
}
