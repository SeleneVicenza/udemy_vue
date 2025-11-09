<template>
    <Card :titleHeader="title" :headerClasses="headerClasses">
        <CardBody :classes="'text-center'">
            <!-- Avatar/Immagine del personaggio -->
            <div class="character-avatar mb-3">
                <div class="position-relative d-inline-block">
                    <div :class="[avatarClasses, type === 'player' ? 'player-avatar' : 'enemy-avatar']">
                        {{ emoji }}
                    </div>
                    <!-- Indicatore di stato (opzionale) -->
                    <div v-if="health <= 25" class="position-absolute top-0 start-100 translate-middle">
                        <span class="badge bg-danger rounded-pill">⚠️</span>
                    </div>
                </div>
            </div>
            
            <!-- Barra della salute con stile migliorato -->
            <div class="health-container">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <small class="text-muted">Salute</small>
                    <small class="fw-bold">{{ health }}/100</small>
                </div>
                <div class="progress" style="height: 20px;">
                    <div 
                        :class="['progress-bar', progressBarClass]" 
                        :style="{ width: health + '%' }"
                        role="progressbar"
                    >
                        {{ health }}%
                    </div>
                </div>
            </div>
            
            <!-- Status effects (opzionale per future espansioni) -->
            <div v-if="showStatus" class="character-status mt-2">
                <span v-if="health > 75" class="badge bg-success">In Forma</span>
                <span v-else-if="health > 50" class="badge bg-warning">Ferito</span>
                <span v-else-if="health > 25" class="badge bg-danger">Gravemente Ferito</span>
                <span v-else class="badge bg-dark">Critico</span>
            </div>
        </CardBody>
    </Card>
</template>

<script>
import Card from './card.vue'
import CardBody from './cardBody.vue'
import { computed } from 'vue'

export default {
    name: 'CharacterCard',
    components: {
        Card,
        CardBody
    },
    props: {
        name: {
            type: String,
            required: true
        },
        health: {
            type: Number,
            required: true,
            default: 100
        },
        type: {
            type: String,
            required: true,
            validator: value => ['player', 'enemy'].includes(value)
        },
        emoji: {
            type: String,
            default: '👤'
        },
        showStatus: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {
        const title = computed(() => `${props.name} (${props.health})`);
        
        const headerClasses = computed(() => {
            return props.type === 'player' ? 'bg-success text-white' : 'bg-danger text-white';
        });
        
        const avatarClasses = computed(() => {
            const baseClasses = 'character-image rounded-circle d-flex align-items-center justify-content-center';
            const sizeClasses = 'fs-1';
            const bgClass = props.type === 'player' ? 'bg-success-subtle' : 'bg-danger-subtle';
            return `${baseClasses} ${sizeClasses} ${bgClass}`;
        });
        
        const progressBarClass = computed(() => {
            if (props.health > 75) return 'bg-success';
            if (props.health > 50) return 'bg-warning';
            if (props.health > 25) return 'bg-danger';
            return 'bg-dark';
        });
        
        return {
            title,
            headerClasses,
            avatarClasses,
            progressBarClass
        };
    }
}
</script>

<style scoped>
.character-image {
    width: 80px;
    height: 80px;
    border: 3px solid;
    transition: transform 0.3s ease;
}

.character-image:hover {
    transform: scale(1.05);
}

/* Effetti specifici per il tipo di personaggio */
.character-image.player-avatar {
    border-color: #198754;
    box-shadow: 0 0 15px rgba(25, 135, 84, 0.3);
}

.character-image.enemy-avatar {
    border-color: #dc3545;
    box-shadow: 0 0 15px rgba(220, 53, 69, 0.3);
}

.progress {
    border-radius: 10px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
}

.progress-bar {
    transition: width 0.6s ease;
    border-radius: 10px;
    font-weight: bold;
    font-size: 0.8rem;
}

.character-status .badge {
    font-size: 0.7rem;
    margin: 0 2px;
}

.health-container {
    max-width: 300px;
    margin: 0 auto;
}
</style>