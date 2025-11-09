<template>
    <div class="card mb-3">
        <CardHeader :title="titleHeader" :classes="headerClasses" />
        <CardBody :classes="bodyClasses">
            <slot></slot>
        </CardBody>
    </div>
</template>

<script>
import CardHeader from './cardHeader.vue';
import CardBody from './cardBody.vue';

export default {
  name: 'Card',
  components: {
    CardHeader,
    CardBody
  },
  props: {
    titleHeader: {
      type: String,
      required: true
    },
    bodyClasses: {
      type: String,
      required: false,
      default: ''
    },
    headerClasses: {
      type: String,
      required: false,
      default: ''
    }
  }
};
</script>