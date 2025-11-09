<template>
    <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div :class="['modal-header', headerClass, 'text-white', 'border-0']">
                    <h5 class="modal-title d-flex align-items-center">
                        <span class="me-2" style="font-size: 1.5rem;">{{ icon }}</span>
                        {{ title }}
                    </h5>
                </div>
                <div class="modal-body text-center py-4">
                    <div class="battle-notification">
                        <div class="notification-icon mb-3">
                            <span style="font-size: 3rem;">{{ icon }}</span>
                        </div>
                        <p class="fs-5 fw-bold mb-2">{{ message }}</p>
                        <p v-if="details" class="text-muted mb-0">{{ details }}</p>
                    </div>
                </div>
                <div class="modal-footer border-0 justify-content-center">
                    <button 
                        @click="close" 
                        :class="['btn', buttonClass, 'px-4']"
                        ref="closeButton"
                    >
                        {{ buttonText }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue'

export default {
    name: 'BattleModal',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'info',
            validator: value => ['attack', 'damage', 'heal', 'victory', 'defeat', 'flee', 'info'].includes(value)
        },
        message: {
            type: String,
            required: true
        },
        details: {
            type: String,
            default: ''
        },
        autoClose: {
            type: Number,
            default: 2500 // millisecondi
        }
    },
    emits: ['close'],
    setup(props, { emit }) {
        const closeButton = ref(null);

        const modalConfig = {
            attack: {
                icon: '⚔️',
                title: 'Attacco!',
                headerClass: 'bg-primary',
                buttonClass: 'btn-primary',
                buttonText: 'Continua'
            },
            damage: {
                icon: '💥',
                title: 'Danno Subito!',
                headerClass: 'bg-danger',
                buttonClass: 'btn-danger',
                buttonText: 'Ohh!'
            },
            heal: {
                icon: '💚',
                title: 'Cura!',
                headerClass: 'bg-success',
                buttonClass: 'btn-success',
                buttonText: 'Bene!'
            },
            victory: {
                icon: '�',
                title: 'Vittoria!',
                headerClass: 'bg-success',
                buttonClass: 'btn-success',
                buttonText: 'Fantastico!'
            },
            defeat: {
                icon: '�',
                title: 'Sconfitta!',
                headerClass: 'bg-danger',
                buttonClass: 'btn-danger',
                buttonText: 'Riprova'
            },
            flee: {
                icon: '🏃',
                title: 'Fuga!',
                headerClass: 'bg-secondary',
                buttonClass: 'btn-secondary',
                buttonText: 'Ok'
            },
            info: {
                icon: 'ℹ️',
                title: 'Informazione',
                headerClass: 'bg-info',
                buttonClass: 'btn-info',
                buttonText: 'Ok'
            }
        };

        const config = modalConfig[props.type];

        const close = () => {
            emit('close');
        };

        // Auto-close dopo il tempo specificato
        let autoCloseTimeout;
        watch(() => props.show, (newShow) => {
            if (newShow) {
                // Focus sul bottone quando il modal si apre
                nextTick(() => {
                    if (closeButton.value) {
                        closeButton.value.focus();
                    }
                });

                // Auto-close se specificato
                if (props.autoClose > 0) {
                    autoCloseTimeout = setTimeout(() => {
                        close();
                    }, props.autoClose);
                }
            } else {
                // Pulisci il timeout se il modal viene chiuso manualmente
                if (autoCloseTimeout) {
                    clearTimeout(autoCloseTimeout);
                }
            }
        });

        // Gestione tasto Esc e Enter
        const handleKeydown = (event) => {
            if (props.show) {
                if (event.key === 'Escape' || event.key === 'Enter') {
                    close();
                }
            }
        };

        // Aggiungi listener per le tastiere
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', handleKeydown);
        }

        return {
            close,
            closeButton,
            icon: config.icon,
            title: config.title,
            headerClass: config.headerClass,
            buttonClass: config.buttonClass,
            buttonText: config.buttonText
        };
    }
}
</script>

<style scoped>
.modal.show {
    animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-content {
    border-radius: 15px;
    overflow: hidden;
}

.battle-notification {
    padding: 20px;
}

.notification-icon {
    animation: bounceIn 0.6s ease-out;
}

@keyframes bounceIn {
    0% {
        transform: scale(0.3);
        opacity: 0;
    }
    50% {
        transform: scale(1.05);
    }
    70% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.modal-header {
    padding: 1rem 1.5rem;
}

.modal-footer {
    padding: 1rem 1.5rem;
}

.btn {
    border-radius: 10px;
    font-weight: 600;
    min-width: 100px;
}

/* Effetti speciali per vittoria */
.modal-header.bg-success {
    background: linear-gradient(45deg, #28a745, #20c997) !important;
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
    animation: victoryGlow 2s ease-in-out infinite alternate;
}

@keyframes victoryGlow {
    from {
        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
    }
    to {
        box-shadow: 0 4px 25px rgba(40, 167, 69, 0.8);
    }
}

/* Effetti speciali per sconfitta */
.modal-header.bg-danger {
    background: linear-gradient(45deg, #dc3545, #c82333) !important;
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
    animation: defeatPulse 1.5s ease-in-out infinite;
}

@keyframes defeatPulse {
    0%, 100% {
        box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
    }
    50% {
        box-shadow: 0 4px 25px rgba(220, 53, 69, 0.7);
    }
}

/* Icone animate per vittoria e sconfitta */
.notification-icon span {
    display: inline-block;
}

/* Animazione rotazione per trofeo vittoria */
.modal-header.bg-success ~ .modal-body .notification-icon span {
    animation: trophySpin 2s ease-in-out infinite;
}

@keyframes trophySpin {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(-10deg) scale(1.1); }
    50% { transform: rotate(0deg) scale(1.2); }
    75% { transform: rotate(10deg) scale(1.1); }
}

/* Animazione shake per sconfitta */
.modal-header.bg-danger ~ .modal-body .notification-icon span {
    animation: skullShake 0.5s ease-in-out infinite;
}

@keyframes skullShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
</style>