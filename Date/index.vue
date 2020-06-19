<template>
    <div class='wt-date-picker'>
      <div class="head">
            <wt-button title="取消" type="default" size="small" style="width: 3rem;" @click="cancel"></wt-button>
            <wt-button title="确定" type="primary" size="small" style="width: 3rem;" color="#fff" @click="comfirm"></wt-button>
      </div>
        <datePicker v-if="type =='date'" @change="change" :section="section"></datePicker>
        <dateTimePicker v-if="type =='dateTime'" @change="change" :section="section"></dateTimePicker>
        <timePicker v-if="type =='time'" @change="change" :section="section"></timePicker>
    </div>
</template>
<script>
import Button from '../Button.vue';
import datePicker from './Date.vue';
import dateTimePicker from './DateTime.vue';
import timePicker from './Time.vue';

import { getCurrentInstance, provide } from 'vue';
export default {
  components: {
    datePicker,
    dateTimePicker,
    timePicker,
    'wt-button': Button
  },
  props: [
  'yearFormat',
  'monthFormat',
  'dayFormat',
  'hourFormat',
  'minuteFormat',
  'defaultVal',
  'type',
  'section'
  ],
  setup(props, {emit}) {
    provide('Format', props)
    const { ctx } = getCurrentInstance()
    const change = (value) => {
     emit('change', value)
    }
    // 取消按钮
    const cancel = () => {
      emit('cancel');
    }
    // 确定按钮
    const comfirm = () => {
     let value = '';
     if(props.type === "date"){
        value = ctx.$refs.date.getValue();
     } else if (props.type === "dateTime") {
        value = ctx.$refs.dateTime.getValue();
    } else if (props.type === "time") {
        value = ctx.$refs.time.getValue();
    }
      emit('comfirm', value);
    }
  return {
    change,
    comfirm,
    cancel
  }
  }
};
</script>
<style lang='less' scoped>
    .wt-date-picker {
        position: fixed;
        background: #fff;
        width: 100%;
        bottom: 0;
        left: 0;
        .head {
            border-bottom: 1px solid #eee;
            padding: 0.5rem;
            position: absolute;
            z-index: 2;
            width: 100%;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            justify-content:  space-between;
        }
    }
</style>