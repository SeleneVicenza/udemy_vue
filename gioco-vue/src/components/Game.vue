<template>
    <Card :titleHeader="'Modalità: ' + nomeGioco" :headerClasses="'bg-primary text-white text-center'">
       <CardBody>

            <!-- Giocatori affiancati -->
            <div class="row mb-4">
                <!-- Giocatore -->
                <div class="col-md-6 mb-3 mb-md-0">
                    <CharacterCard 
                        name="Eroe Coraggioso"
                        :health="playerHealth"
                        type="player"
                        emoji="🤠"
                        :show-status="true"
                    />
                </div>
                
                <!-- VS Separator -->
                <div class="col-12 d-md-none text-center mb-3">
                    <h2 class="text-danger fw-bold">⚔️ VS ⚔️</h2>
                </div>
                
                
                <!-- Nemico -->
                <div class="col-md-6">
                    <CharacterCard 
                        name="Drago Nemico"
                        :health="enemyHealth"
                        type="enemy"
                        emoji="🐲"
                        :show-status="true"
                    />
                </div>
            </div>

            <!-- Azioni -->
            <Card :titleHeader="'Azioni'">
                <CardBody>
                    <div class="row mb-2">
                        <ActionButton 
                            label="Attacco Base"
                            action="attack"
                            variant="primary"
                            @action-clicked="handleAction"
                        />
                        <ActionButton 
                            label="Attacco Super"
                            action="superAttack"
                            variant="warning"
                            :disabled="disabilitaSpeciali"
                            @action-clicked="handleAction"
                        />
                    </div>
                    <div class="row">
                        <ActionButton 
                            label="Cura"
                            action="heal"
                            variant="success"
                            :disabled="disabilitaSpeciali"
                            @action-clicked="handleAction"
                        />
                        <ActionButton 
                            label="Fuga"
                            action="flee"
                            variant="danger"
                            @action-clicked="handleAction"
                        />
                    </div>
                </CardBody>
                <div class="card-footer text-center">
                    <h2>Round: {{ round }}</h2>
                    <div class="d-flex justify-content-around">
                        <h3>Totale Partite: {{ vittorie + sconfitte }}</h3>
                        <h3 class="text-success">Vittorie: {{ vittorie }}</h3>
                        <h3 class="text-danger">Sconfitte: {{ sconfitte }}</h3>
                    </div>
                </div>
            </Card>

            <!-- Partite Recenti -->
            <Card :titleHeader="'Partite recenti'">
                <CardBody> 
                    <ul class="list-group" v-if="partiteRecenti.length > 0">
                        <li 
                            v-for="partita in partiteRecenti" 
                            :key="partita.id"
                            class="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div>
                                <strong :class="{
                                    'text-success': partita.esito === 'Vittoria',
                                    'text-danger': partita.esito === 'Sconfitta',
                                    'text-warning': partita.esito === 'Fuga'
                                }">{{ partita.esito }}</strong>
                                - Round {{ partita.round }}
                            </div>
                            <small class="text-muted">{{ partita.data }}</small>
                        </li>
                    </ul>
                    <p v-else class="text-muted text-center">Nessuna partita giocata ancora</p>
                </CardBody>
            </Card>

       </CardBody>
    </Card>

    <!-- Modal per le notifiche di battaglia -->
    <BattleModal 
        :show="modal.show"
        :type="modal.type"
        :message="modal.message"
        :details="modal.details"
        @close="closeModal"
    />
</template>

<script>
import { ref, computed, watch } from 'vue'
import ActionButton from './ActionButton.vue'
import Card from './card.vue';
import CardBody from './cardBody.vue';
import CharacterCard from './CharacterCard.vue';
import BattleModal from './BattleModal.vue';

export default {
    name: 'GameComponent',
    components: {
        ActionButton,
        Card,
        CardBody,
        CharacterCard,
        BattleModal
    },
    setup() {
        const nomeGioco = 'Battaglia amichevole';
        const playerHealth = ref(100);
        const enemyHealth = ref(100);
        const round = ref(1);
        const vittorie = ref(0);
        const sconfitte = ref(0);
        const partiteRecenti = ref([]);

        // Modal state
        const modal = ref({
            show: false,
            type: 'info',
            message: '',
            details: ''
        });

        // Funzioni di utilità
        const randomAttackValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        // Gestione Modal
        const showModal = (type, message, details = '') => {
            modal.value = {
                show: true,
                type,
                message,
                details
            };
        };

        const closeModal = () => {
            modal.value.show = false;
        };

        const enemyAttack = () => {
            const attackValue = randomAttackValue(8, 14);
            playerHealth.value -= attackValue;
            showModal('damage', `Il Drago ti attacca!`, `Hai subito ${attackValue} danni`);
        };

        // Azioni del giocatore
        const attaccoBase = () => {
            const attackValue = randomAttackValue(5, 12);
            enemyHealth.value -= attackValue;
            showModal('attack', `Attacco riuscito!`, `Hai inflitto ${attackValue} danni al drago`);
            setTimeout(() => {
                if (enemyHealth.value > 0) {
                    enemyAttack();
                }
                round.value++;
            }, 2500);
        };

        const attaccoSuper = () => {
            const attackValue = randomAttackValue(10, 25);
            enemyHealth.value -= attackValue;
            showModal('attack', `Attacco Devastante!`, `Il tuo attacco super ha inflitto ${attackValue} danni!`);
            setTimeout(() => {
                if (enemyHealth.value > 0) {
                    enemyAttack();
                }
                round.value++;
            }, 2500);
        };
        
        const cura = () => {
            const curaValue = randomAttackValue(8, 20);
            const oldHealth = playerHealth.value;
            playerHealth.value += curaValue;
            if (playerHealth.value > 100) {
                playerHealth.value = 100;
            }
            const actualHealing = playerHealth.value - oldHealth;
            showModal('heal', `Ti sei curato!`, `Hai recuperato ${actualHealing} punti salute`);
            setTimeout(() => {
                enemyAttack();
                round.value++;
            }, 2500);
        };

        const fuga = () => {
            showModal('flee', 'Sei fuggito dalla battaglia!', 'A volte la fuga è la scelta più saggia...');
            setTimeout(() => {
                sconfitte.value++;
                aggiungiPartita('Fuga');
                resetGame();
            }, 2500);
        };

        // Handler delle azioni - QUESTA È LA PARTE CHIAVE
        const handleAction = (action) => {
            switch (action) {
                case 'attack':
                    attaccoBase();
                    break;
                case 'superAttack':
                    attaccoSuper();
                    break;
                case 'heal':
                    cura();
                    break;
                case 'flee':
                    fuga();
                    break;
                default:
                    console.warn('Azione non riconosciuta:', action);
            }
        };

        // Computed properties
        const barHealthPlayer = computed(() => {
            return { width: playerHealth.value + '%' };
        });     

        const barHealthEnemy = computed(() => {
            return { width: enemyHealth.value + '%' };
        });

        const disabilitaSpeciali = computed(() => {
            return round.value % 3 !== 0;
        });

        // Watchers per fine partita
        watch(enemyHealth, (newHealth) => {
            if (newHealth <= 0) {
                enemyHealth.value = 0; // Assicuriamoci che non vada sotto zero
                showModal('victory', 'Vittoria Epica!', `Hai sconfitto il drago in ${round.value} round!`);
                setTimeout(() => {
                    vittorie.value++;
                    aggiungiPartita('Vittoria');
                    resetGame();
                }, 3000);
            }
        });

        watch(playerHealth, (newHealth) => {
            if (newHealth <= 0) {
                playerHealth.value = 0; // Assicuriamoci che non vada sotto zero
                showModal('defeat', 'Sei stato sconfitto!', `Il drago ti ha battuto al round ${round.value}...`);
                setTimeout(() => {
                    sconfitte.value++;
                    aggiungiPartita('Sconfitta');
                    resetGame();
                }, 3000);
            }
        });

        // Funzioni di servizio
        const aggiungiPartita = (esito) => {
            const dataOra = new Date().toLocaleString();
            const partita = {
                id: Date.now(),
                esito: esito,
                round: round.value,
                data: dataOra
            };
            partiteRecenti.value.unshift(partita);
            
            if (partiteRecenti.value.length > 10) {
                partiteRecenti.value.pop();
            }
        };

        const resetGame = () => {
            playerHealth.value = 100;
            enemyHealth.value = 100;
            round.value = 1;
        };

        return {
            nomeGioco,
            playerHealth,
            enemyHealth,
            round,
            vittorie,
            sconfitte,
            partiteRecenti,
            barHealthPlayer,
            barHealthEnemy,
            disabilitaSpeciali,
            handleAction,
            modal,
            closeModal
        };
    }
}; 
</script>