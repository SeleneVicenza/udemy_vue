<template>
    <div class="col-6">
        <button
            @click="handleClick"
            :disabled="disabled"
            :class="buttonClasses"
            class="btn w-100"
        >
            {{ label }}
        </button>
    </div>
</template>

<script>
import { computed } from 'vue'

export default {
    name: 'ActionButton',
    props: {
        label: {
            type: String,
            required: true
        },
        action: {
            type: String,
            required: true,
            validator: (value) => ['attack', 'superAttack', 'heal', 'flee'].includes(value)
        },
        disabled: {
            type: Boolean,
            default: false
        },
        variant: {
            type: String,
            default: 'primary',
            validator: (value) => ['primary', 'warning', 'success', 'danger'].includes(value)
        }
    },
    emits: ['action-clicked'],
    setup(props, { emit }) {
        const buttonClasses = computed(() => {
            return `btn-${props.variant}`;
        });

        const handleClick = () => {
            emit('action-clicked', props.action);
        };

        return {
            buttonClasses,
            handleClick
        };
    }
};
</script>