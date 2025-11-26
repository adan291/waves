/**
 * Toast Notifications Module
 * Displays non-intrusive notifications to the user
 * Supports different types: info, success, warning, error
 * 
 * @module toastNotifications
 */

const ToastNotifications = (() => {
    'use strict';

    // Configuration
    const CONFIG = {
        container: 'toast-container',
        defaultDuration: 3000,
        maxNotifications: 5,
        animationDuration: 300
    };

    // Notification types
    const TYPES = {
        INFO: 'info',
        SUCCESS: 'success',
        WARNING: 'warning',
        ERROR: 'error'
    };

    // Icons for each type
    const ICONS = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };

    // Colors for each type
    const COLORS = {
        info: '#0066cc',
        success: '#00cc00',
        warning: '#ff9900',
        error: '#cc0000'
    };

    // Active notifications
    let notifications = [];

    /**
     * Create toast container if it doesn't exist
     */
    function ensureContainer() {
        let container = document.getElementById(CONFIG.container);
        if (!container) {
            container = document.createElement('div');
            container.id = CONFIG.container;
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px; max-width: 400px; pointer-events: none;';
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Create toast element
     * @param {string} message - Message to display
     * @param {string} type - Type of notification
     * @returns {Element} Toast element
     */
    function createToastElement(message, type) {
        const toast = document.createElement('div');
        const icon = ICONS[type] || ICONS.info;
        const color = COLORS[type] || COLORS.info;

        toast.className = 'toast toast-' + type;
        toast.style.cssText = 'background: white; border-left: 4px solid ' + color + '; border-radius: 4px; padding: 16px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); display: flex; align-items: center; gap: 12px; animation: slideInRight 300ms ease-out; pointer-events: auto; cursor: pointer; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; font-size: 14px; color: #333;';

        // Icon
        const iconEl = document.createElement('span');
        iconEl.textContent = icon;
        iconEl.style.cssText = 'font-size: 20px; flex-shrink: 0;';

        // Message
        const messageEl = document.createElement('span');
        messageEl.textContent = message;
        messageEl.style.cssText = 'flex: 1; word-break: break-word;';

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = 'background: none; border: none; color: #999; cursor: pointer; font-size: 18px; padding: 0; margin-left: 8px; flex-shrink: 0; transition: color 0.2s;';
        closeBtn.onmouseover = () => closeBtn.style.color = '#333';
        closeBtn.onmouseout = () => closeBtn.style.color = '#999';
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            removeToast(toast);
        };

        toast.appendChild(iconEl);
        toast.appendChild(messageEl);
        toast.appendChild(closeBtn);

        return toast;
    }

    /**
     * Remove toast notification
     * @param {Element} toast - Toast element to remove
     */
    function removeToast(toast) {
        toast.style.animation = 'slideOutRight 300ms ease-in';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            notifications = notifications.filter(n => n !== toast);
        }, CONFIG.animationDuration);
    }

    /**
     * Show notification
     * @param {string} message - Message to display
     * @param {string} type - Type of notification
     * @param {number} duration - Duration in milliseconds
     */
    function show(message, type, duration) {
        type = type || TYPES.INFO;
        duration = duration !== undefined ? duration : CONFIG.defaultDuration;

        if (typeof message !== 'string' || !message.trim()) {
            return;
        }

        const container = ensureContainer();

        // Limit number of notifications
        if (notifications.length >= CONFIG.maxNotifications) {
            removeToast(notifications[0]);
        }

        const toast = createToastElement(message, type);
        container.appendChild(toast);
        notifications.push(toast);

        // Auto-dismiss if duration > 0
        if (duration > 0) {
            setTimeout(() => {
                if (notifications.includes(toast)) {
                    removeToast(toast);
                }
            }, duration);
        }

        return toast;
    }

    /**
     * Show info notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds
     */
    function info(message, duration) {
        return show(message, TYPES.INFO, duration);
    }

    /**
     * Show success notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds
     */
    function success(message, duration) {
        return show(message, TYPES.SUCCESS, duration);
    }

    /**
     * Show warning notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds
     */
    function warning(message, duration) {
        return show(message, TYPES.WARNING, duration);
    }

    /**
     * Show error notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds
     */
    function error(message, duration) {
        duration = duration !== undefined ? duration : 5000;
        return show(message, TYPES.ERROR, duration);
    }

    /**
     * Clear all notifications
     */
    function clearAll() {
        const container = document.getElementById(CONFIG.container);
        if (container) {
            container.innerHTML = '';
        }
        notifications = [];
    }

    /**
     * Get active notifications count
     * @returns {number} Number of active notifications
     */
    function getCount() {
        return notifications.length;
    }

    /**
     * Add CSS animations to document
     */
    function addAnimations() {
        if (document.getElementById('toast-animations')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = '@keyframes slideInRight { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } } @media (max-width: 768px) { #toast-container { left: 10px !important; right: 10px !important; max-width: none !important; } }';
        document.head.appendChild(style);
    }

    // Initialize animations on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addAnimations);
    } else {
        addAnimations();
    }

    // Public API
    return {
        show: show,
        info: info,
        success: success,
        warning: warning,
        error: error,
        clearAll: clearAll,
        getCount: getCount,
        TYPES: TYPES
    };
})();

// Expose for debugging
if (typeof window !== 'undefined') {
    window.ToastNotifications = ToastNotifications;
}
