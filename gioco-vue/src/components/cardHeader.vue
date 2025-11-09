<template>
    <div :class="['card-header', 'text-center', classes]">
        {{ title }}
    </div>
</template>

<script>
export default {
  name: 'CardHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    classes: {
      type: String,
      required: false,
      default: ''
    }
  }
};
</script>