<template>
  <wt-model>
    <div class='wt-city-picker'>
      <div class="head">
            <wt-button title="取消" type="default" size="small" style="width: 3rem;" @click="cancel"></wt-button>
            <wt-button title="确定" type="primary" size="small" style="width: 3rem;" color="#fff" @click="comfirm"></wt-button>
      </div>
      <wt-row style="margin-top:3rem;">
        <wt-picker ref="province" :dataSource="dataSource" @change="provinceChange" :class="['item-picker', level == 2 ? 'halves' : '']"></wt-picker>
        <wt-picker ref="city" :dataSource="state.cityData" @change="cityChange" :class="['item-picker', level == 2 ? 'halves' : '']"></wt-picker>
        <wt-picker ref="area" :dataSource="state.areaData" @change="areaChange" :class="['item-picker', level == 2 ? 'halves' : '']" v-if="level == 3"></wt-picker>
       </wt-row>
    </div>
    </wt-model>
</template>
<script>
import Button from '../Button.vue';
import Picker from '../Picker.vue';
import Row from '../Row.vue';
import Model from '../Model.vue';
import CityData from './citydata';

import { getCurrentInstance, reactive } from 'vue';
export default {
  components: {
    'wt-picker': Picker,
    'wt-button': Button,
    'wt-row': Row,
    "wt-model": Model
  },
  props: {
    dataSource: {
      type: Array,
      default: () => {
        return CityData;
      }
    },
    level: {
      type: String || Number,
      default: () => {
        return 3;
      }
    },
  },
  setup(props, {emit}){
    const {ctx} = getCurrentInstance();
    const state = reactive({
      cityData: props.dataSource[0].children,
      areaData: props.dataSource[0].children[0].children
    })
    // 取消按钮
    const cancel = () => {
      emit('cancel');
    }
    // 确定按钮
    const comfirm = () => {
      emit('comfirm', {
        province: ctx.$refs.province.getCurrentIndex().data,
        city: ctx.$refs.city.getCurrentIndex().data,
        area: props.level >= 3 && ctx.$refs.area.getCurrentIndex().data,
      });
    }
     const provinceChange = (data) => {
       state.cityData = data.data.children;
       ctx.$refs.city.scrollTo(0);
       state.areaData = data.data.children && data.data.children[0].children;
       ctx.$refs.area && ctx.$refs.area.scrollTo(0);
        emit('change', {
          province: data.data,
          city: data.data.children[0],
          area: props.level >= 3 && data.data.children && data.data.children[0] && data.data.children[0] && data.data.children[0].children[0],
        })
     }
     const cityChange = (data) => {
       state.areaData = data.data.children;
       ctx.$refs.area && ctx.$refs.area.scrollTo(0);
        emit('change', {
          province: ctx.$refs.province.getCurrentIndex().data,
          city: data.data,
          area: props.level >= 3 && data.data && data.data.children && data.data.children[0],
        })
     }
     const areaChange = (data) => {
        emit('change', {
          province: ctx.$refs.province.getCurrentIndex().data,
          city: ctx.$refs.city.getCurrentIndex().data,
          area: data.data
        })
     }
    // 暴露给模板
    return {
      cancel,
      comfirm,
      state,
      provinceChange,
      cityChange,
      areaChange
    }
  }
}
</script>
<style lang='less' scoped>
    .wt-city-picker {
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
        .item-picker {
          min-width:33.33%;
          max-width:33.33%;
          &.halves {
            min-width:50%;
            max-width:50%;
          }
        }
    }
</style>
