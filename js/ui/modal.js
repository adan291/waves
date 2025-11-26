/**
 * Modal UI Module
 * Custom modal dialogs with ocean theme
 */

const ModalUI = {
    /**
     * Show confirmation modal
     * @param {Object} options - Modal options
     * @param {string} options.title - Modal title
     * @param {string} options.message - Modal message
     * @param {string} options.confirmText - Confirm button text
     * @param {string} options.cancelText - Cancel button text
     * @param {Function} options.onConfirm - Callback on confirm
     * @param {Function} options.onCancel - Callback on cancel (optional)
     */
    showConfirm(options) {
        const {
            title = '¿Estás seguro?',
            message = '',
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            onConfirm = () => {},
            onCancel = () => {}
        } = options;

        // Create modal HTML
        const modalHTML = `
            <div class="modal-overlay" id="customModal">
                <div class="modal-container">
                    <div class="modal-header">
                        <h2 class="modal-title">${this.escapeHtml(title)}</h2>
                    </div>
                    <div class="modal-body">
                        <p class="modal-message">${this.escapeHtml(message)}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-btn modal-btn-cancel" id="modalCancelBtn">
                            ${this.escapeHtml(cancelText)}
                        </button>
                        <button class="modal-btn modal-btn-confirm" id="modalConfirmBtn">
                            ${this.escapeHtml(confirmText)}
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Get elements
        const modal = document.getElementById('customModal');
        const confirmBtn = document.getElementById('modalConfirmBtn');
        const cancelBtn = document.getElementById('modalCancelBtn');

        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        // Handle confirm
        confirmBtn.addEventListener('click', () => {
            this.closeModal(modal);
            onConfirm();
        });

        // Handle cancel
        cancelBtn.addEventListener('click', () => {
            this.closeModal(modal);
            onCancel();
        });

        // Handle overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
                onCancel();
            }
        });

        // Handle ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
                onCancel();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    },

    /**
     * Close and remove modal
     * @param {HTMLElement} modal - Modal element
     */
    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    },

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Show info modal (single button)
     * @param {Object} options - Modal options
     */
    showInfo(options) {
        const {
            title = 'Información',
            message = '',
            buttonText = 'Entendido',
            onClose = () => {}
        } = options;

        const modalHTML = `
            <div class="modal-overlay" id="customModal">
                <div class="modal-container">
                    <div class="modal-header">
                        <h2 class="modal-title">${this.escapeHtml(title)}</h2>
                    </div>
                    <div class="modal-body">
                        <p class="modal-message">${this.escapeHtml(message)}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-btn modal-btn-confirm" id="modalCloseBtn">
                            ${this.escapeHtml(buttonText)}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('customModal');
        const closeBtn = document.getElementById('modalCloseBtn');

        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            this.closeModal(modal);
            onClose();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
                onClose();
            }
        });
    }
};

// Export to window
if (typeof window !== 'undefined') {
    window.ModalUI = ModalUI;
}

console.log('🎭 Modal UI module loaded');

// Export showConfirm as showCustomConfirm for testing
if (typeof window !== 'undefined') {
    window.showCustomConfirm = (title, message, onConfirm, onCancel) => {
        return ModalUI.showConfirm({
            title,
            message,
            onConfirm,
            onCancel
        });
    };
}
