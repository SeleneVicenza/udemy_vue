<template>
    <div :class="['card-body', classes]">
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'CardBody',
  props: {
    classes: {
      type: String,
      required: false,
      default: ''
    }
  }
};
</script>