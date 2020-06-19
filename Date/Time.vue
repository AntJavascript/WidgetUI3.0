<template>
    <div class='wt-date-time'>
        <div class="flex-wrapper">
          <wt-picker :format="hourFormat" ref="hour" :dataSource="state.hoursData" @change="hoursChange"></wt-picker>
          <wt-picker :format="minuteFormat" ref="minute" :dataSource="state.minuteData" @change="minuteChange"></wt-picker>
        </div>
    </div>
</template>
<script>
import { reactive, getCurrentInstance, inject } from 'vue';
import Picker from '../Picker.vue';
export default {
  components: {
    'wt-picker': Picker
  },
  props:['section'],
  setup(props, {emit}){
    const { ctx } = getCurrentInstance()
    const { hourFormat, minuteFormat, defaultVal } = inject("Format")
    const state = reactive({
      hoursData: [], // 小时的的取值范围
      minuteData: [], // 分钟的的取值范围
      begunHours: 0,  // 开始时间(小时)
      begunMinute: 0, // 开始时间(分钟)
      endHours: 0, // 结束时间(小时)
      endMinute: 0, // 结束时间(分钟)
      sectionStart: '',  // 开始区间
      sectionEnd: '' // 结束区间
    });
     // 指定循环小时
    const hoursCount = (start, count, init = false) => {
      const hour = ctx.$refs.hour;
      if(!hour && !init) return
      var s = start !== undefined ? start : 0;
      var c = count !== undefined ? count : 23;
      let arr = []
      for (let i = s; i <= c; i++) {
        arr.push(i);
      }
       state.hoursData = arr;
      if(init) return
      let index = hour.getCurrentIndex().index;
      if(index >= state.hoursData.length) {
        index = state.hoursData.length - 1
      }
     ctx.$nextTick(() => {
        hour.scrollTo(index)
      })
    }
    // 指定循环小时
    const minuteCount = (start, count, init = false) => {
      const minute = ctx.$refs.minute;
      if(!minute && !init) return
      var s = start !== undefined ? start : 0;
      var c = count !== undefined ? count : 59;
      let arr = []
      for (let i = s; i <= c; i++) {
        arr.push(i);
      }
       state.minuteData = arr;
      if(init) return
      let index = minute.getCurrentIndex().index;
      if(index >= state.minuteData.length) {
        index = state.minuteData.length - 1
      }
     ctx.$nextTick(() => {
        minute.scrollTo(index)
      })
    }
     const getValue = () => {
      const hour = ctx.$refs.hour && ctx.$refs.hour.getCurrentIndex().data;
      const minute = ctx.$refs.minute && ctx.$refs.minute.getCurrentIndex().data;
       return {
              value:" " +  hour + ":" + minute,
              hour,
              minute
          }
    }
    const init = () => {
    const self = state;
    let section;
    if (props.section) {
      // 如果有指定取值范围
      section = props.section.replace(/[\\[\]]/g, '').split('-');
      self.sectionStart = section[0].split(":");
      self.sectionEnd = section[1].split(":");
      hoursCount(~~self.sectionStart[0], ~~self.sectionEnd[0], true)
      // 指定默认时间
      self.begunHours = ~~self.sectionStart[0]; // 开始时间(小时)
      self.begunMinute = ~~self.sectionStart[1]; // 开始时间(分钟)
      self.endHours = ~~self.sectionEnd[0]; // 结束时间(小时)
      self.endMinute = ~~self.sectionEnd[1]; // 结束时间(分钟)

       if(!defaultVal) {
         minuteCount(~~self.sectionStart[1], 59, true)
        }
    } else {
      // 如果没有指定取值范围
       hoursCount(0, 23, true)
       minuteCount(0, 59, true)
    }
    if(defaultVal) {
      var val = defaultVal.split(":")
      if(~~val[0] < ~~self.sectionStart[0] || ~~val[0] > ~~self.sectionEnd[0]) {
         console.log('超出范围')
      } else {
         if(~~val[0] > ~~self.begunHours || ~~val[0] < ~~self.endHours) {
             minuteCount(0, 59, true)
          }else if(~~val[0] === ~~self.begunHours) {
             minuteCount( ~~self.sectionStart[1], 59, true)
          }else if(~~val[0] === ~~self.endHours) {
             minuteCount(0, ~~self.sectionEnd[1], true)
          }
      ctx.$nextTick(() => {
        const hourIndex = self.hoursData.findIndex((item) => item === ~~val[0])
        const minuteIndex = self.minuteData.findIndex((item) => item === ~~val[1])
        ctx.$refs.hour && ctx.$refs.hour.scrollTo(hourIndex);
        ctx.$refs.minute && ctx.$refs.minute.scrollTo(minuteIndex);
      })
    }
   }
  }
   init()
   const hoursChange = (value) => {
      const self = state;
      // 如果有限制区间选择
      if (props.section) {
          // 区间最小
         if (value <= self.begunHours) {
             minuteCount(self.begunMinute, 59)
          } else if (value >= self.endHours) {
             minuteCount(0,self.endMinute)
          } else {
             minuteCount()
          }
      }
      ctx.$nextTick(() => {
         emit("change", getValue())
       })
   }
 const minuteChange = () => {
      emit("change", getValue())
   }
   // 暴露给模板
    return {
      state,
      hourFormat,
      minuteFormat,
      hoursChange,
      minuteChange,
      getValue
    }
  }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
.wt-date-time {
    display: flex;
    margin-top: 3rem;
    position: relative;
    .flex-wrapper {
      display: flex;
      width: 100%;
    }
  }
</style>