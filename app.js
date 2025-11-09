const { 
    createApp, 
    ref,
    computed, 
    watch
} = Vue;

const app = createApp({
    setup() {
        const nomeGioco = 'Battaglia amichevole';
        const playerHealth = ref(100);
        const enemyHealth = ref(100);
        const round = ref(1);
        const vittorie = ref(0);
        const sconfitte = ref(0);
        const partiteRecenti = ref([]);



        // Funzioni di gioco
        const randomAttackValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const enemyAttack = () => {
            const attackValue = randomAttackValue(8, 14);
            playerHealth.value -= attackValue;
            alert(`Nemico attacca con ${attackValue} danni`);
        }

        // Azioni del giocatore
        const attaccoBase = () => {
            const attackValue = randomAttackValue(5, 12);
            enemyHealth.value -= attackValue;
            alert(`Hai attaccato con ${attackValue} danni`);
            enemyAttack();
            round.value++;

        };
        const attaccoSuper = () => {
            const attackValue = randomAttackValue(10, 25);
            enemyHealth.value -= attackValue;
            alert(`Hai eseguito un attacco super con ${attackValue} danni`);
            enemyAttack();
            round.value++;
            console.log('Attacco super eseguito');
        };
        
        const cura = () => {
            const curaValue = randomAttackValue(8, 20);
            playerHealth.value += curaValue;
            if (playerHealth.value > 100) {
                playerHealth.value = 100;
            }
            alert(`Hai recuperato ${curaValue} punti salute`);
            enemyAttack();
            round.value++;
        };

        const fuga = () => {
            alert('Hai scelto di fuggire dalla battaglia!');
            sconfitte.value++;
            aggiungiPartita('Fuga');
            resetGame();
        };

        // Calcoli per le barre della salute
        const BarHealthPlayer = computed(() => {
            return { width: playerHealth.value + '%' };
        });     

        const BarHealthEnemy = computed(() => {
            return { width: enemyHealth.value + '%' };
        });

        // Funzioni di servizio
        const disabilitaSspeciali = computed(() => {
            return round.value % 3 !== 0;
        });

        // Fine partita
        watch(enemyHealth, (enemyHealth, prevEnemyHealth) => {
            if (enemyHealth <= 0) {
                alert('Hai sconfitto il nemico!');
                vittorie.value++;
                aggiungiPartita('Vittoria');
                resetGame();
            }
        });

        watch(playerHealth, (playerHealth, prevPlayerHealth) => {
            if (playerHealth <= 0) {
                alert('Sei stato sconfitto dal nemico!');
                sconfitte.value++;
                aggiungiPartita('Sconfitta');
                resetGame();
            }
        });

        const aggiungiPartita = (esito) => {
            const dataOra = new Date().toLocaleString();
            const partita = {
                id: Date.now(),
                esito: esito,
                round: round.value,
                data: dataOra
            };
            partiteRecenti.value.unshift(partita); // Aggiungi all'inizio della lista
            
            // Mantieni solo le ultime 10 partite
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
            attaccoBase,
            attaccoSuper,
            cura,
            fuga,
            playerHealth,
            enemyHealth,
            round,
            BarHealthPlayer,
            BarHealthEnemy,
            disabilitaSspeciali,
            vittorie,
            sconfitte,
            partiteRecenti,
        };
    }
}); 

app.mount('#game');