/**
 * Keyboard Shortcuts Module
 * Handles keyboard shortcuts for the application
 * 
 * Shortcuts:
 * - Ctrl+K / Cmd+K: Clear conversation
 * - Esc: Stop TTS playback
 * - Ctrl+/ / Cmd+/: Show shortcuts help
 * 
 * @module KeyboardShortcuts
 */

if (typeof KeyboardShortcuts !== 'undefined') {
    console.warn('KeyboardShortcuts already loaded, skipping...');
} else {
    var KeyboardShortcuts;
}

KeyboardShortcuts = KeyboardShortcuts || ((dependencies = {}) => {
    let isEnabled = true;
    let shortcuts = new Map();
    let deps = dependencies;
    let currentModal = null;
    
    /**
     * Initialize keyboard shortcuts with optional dependencies
     * @param {Object} injectedDeps - Optional dependencies to inject
     * @param {Function} injectedDeps.clearConversation - Function to clear conversation
     * @param {Function} injectedDeps.stopAudio - Function to stop audio playback
     */
    function init(injectedDeps = {}) {
        // Merge dependencies
        deps = { ...deps, ...injectedDeps };
        
        // Ctrl+K / Cmd+K: Clear conversation
        registerShortcut('k', { ctrl: true }, () => {
            // Try UIEventBus first (preferred), then injected dependency
            if (typeof window !== 'undefined' && window.UIEventBus) {
                window.UIEventBus.emit('conversation:clear');
            } else if (deps.clearConversation) {
                deps.clearConversation();
            } else {
                console.warn('⚠️ Clear conversation handler not available');
            }
        }, 'Limpiar conversación');
        
        // Esc: Stop TTS
        registerShortcut('Escape', {}, () => {
            // Try UIEventBus first (preferred), then injected dependency
            if (typeof window !== 'undefined' && window.UIEventBus) {
                window.UIEventBus.emit('audio:stopAll');
            } else if (deps.stopAudio) {
                deps.stopAudio();
            }
        }, 'Detener audio');
        
        // Ctrl+/ / Cmd+/: Show help
        registerShortcut('/', { ctrl: true }, () => {
            showShortcutsHelp();
        }, 'Mostrar atajos');
        
        // Setup event listener
        document.addEventListener('keydown', handleKeyDown);
        
        console.log('⌨️ Keyboard shortcuts initialized');
    }
    
    // Register a shortcut
    function registerShortcut(key, modifiers, callback, description) {
        const shortcutKey = createShortcutKey(key, modifiers);
        shortcuts.set(shortcutKey, { callback, description, key, modifiers });
    }
    
    // Create unique key for shortcut
    function createShortcutKey(key, modifiers) {
        const parts = [];
        if (modifiers.ctrl) parts.push('ctrl');
        if (modifiers.alt) parts.push('alt');
        if (modifiers.shift) parts.push('shift');
        parts.push(key.toLowerCase());
        return parts.join('+');
    }
    
    // Handle keydown event
    function handleKeyDown(event) {
        if (!isEnabled) return;
        
        // Don't trigger if user is typing in input
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            // Allow Esc even in input
            if (event.key !== 'Escape') return;
        }
        
        const shortcutKey = createShortcutKey(event.key, {
            ctrl: event.ctrlKey || event.metaKey,
            alt: event.altKey,
            shift: event.shiftKey
        });
        
        const shortcut = shortcuts.get(shortcutKey);
        if (shortcut) {
            event.preventDefault();
            shortcut.callback();
        }
    }
    
    /**
     * Show shortcuts help modal
     * Creates and displays a modal with all registered shortcuts
     */
    function showShortcutsHelp() {
        // Remove existing modal if any
        if (currentModal) {
            closeModal();
        }
        
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'shortcuts-help-overlay';
        
        // Build modal content
        overlay.innerHTML = `
            <div class="shortcuts-help-modal" onclick="event.stopPropagation()">
                <h3>⌨️ Atajos de Teclado</h3>
                <div class="shortcuts-list">
                    ${Array.from(shortcuts.values()).map(s => `
                        <div class="shortcut-item">
                            <kbd>${formatShortcut(s.key, s.modifiers)}</kbd>
                            <span>${s.description}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="close-help-btn">Cerrar</button>
            </div>
        `;
        
        // Event listeners
        overlay.addEventListener('click', closeModal);
        overlay.querySelector('.close-help-btn').addEventListener('click', closeModal);
        
        // Esc to close (temporary handler)
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        // Close modal function
        function closeModal() {
            if (overlay && overlay.parentNode) {
                overlay.remove();
            }
            document.removeEventListener('keydown', escHandler);
            currentModal = null;
        }
        
        // Add to DOM
        document.body.appendChild(overlay);
        currentModal = overlay;
    }
    
    // Format shortcut for display
    function formatShortcut(key, modifiers) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const parts = [];
        
        if (modifiers.ctrl) parts.push(isMac ? '⌘' : 'Ctrl');
        if (modifiers.alt) parts.push(isMac ? '⌥' : 'Alt');
        if (modifiers.shift) parts.push(isMac ? '⇧' : 'Shift');
        
        parts.push(key === 'Escape' ? 'Esc' : key.toUpperCase());
        
        return parts.join(' + ');
    }
    
    // Enable/disable shortcuts
    function setEnabled(enabled) {
        isEnabled = enabled;
    }
    
    // Cleanup
    function destroy() {
        document.removeEventListener('keydown', handleKeyDown);
        shortcuts.clear();
    }
    
    return {
        init,
        registerShortcut,
        setEnabled,
        destroy,
        showHelp: showShortcutsHelp
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => KeyboardShortcuts.init());
} else {
    KeyboardShortcuts.init();
}
