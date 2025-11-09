<template>
  <button @click="count++" class="ui-button">
    {{ title }}: {{ count }}
  </button>
</template>

<script setup>
    import { ref } from 'vue';

    defineProps({
        'title': {
            type: String,
            default: 'UI Button'
        }
    });
    const count = ref(0);



</script>