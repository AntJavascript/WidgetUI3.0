<template>
  <span>{{showTime}}</span>
</template>
<script>
import { computed } from 'vue';
import {utils} from './utils';
export default {
  props: {
    time: {
      type: String || Number,
      default: () => {
        return "";
      }
    },
    type: {
      type: String,
      default: () => {
        return "";
      }
    },
    format: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  setup (props) {
    const showTime = computed(()=> {
      return utils.getcurrentDate(props.time, props.type || "date");
    })
    return {
      showTime
    };
  }
};
</script>
