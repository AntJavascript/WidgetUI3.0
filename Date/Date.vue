<template>
    <div class='wt-date-time'>
        <div class="flex-wrapper">
          <wt-picker :format="yearFormat" ref="year" :dataSource="state.yearData" @change="yearChange"></wt-picker>
          <wt-picker :format="monthFormat" ref="month" :dataSource="state.monthData" @change="monthChange"></wt-picker>
          <wt-picker :format="dayFormat" ref="day" :dataSource="state.dayData" @change="dayChange"></wt-picker>
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
    const { yearFormat, monthFormat, dayFormat, defaultVal } = inject("Format")
    const state = reactive({
      yearData: [], // 年份的取值范围
      yearValue: '', // 选择年份的值
      monthData: [], // 月份的的取值范围
      monthValue: '1', // 选择月份的值
      dayData: [], // 日期的的取值范围
      dayValue: '1',  // 选择某日的值
      curTime: '', // 设定默认选定时间
      begunYear: '', // 开始时间(年)
      endYear: '', // 结束时间(年)
      begunMonth: '',  // 开始时间(月)
      endMonth: '', // 结束时间(月)
      begunDay: '',  // 开始时间(日)
      endDay: '', // 结束时间(日)
      sectionStart: '',  // 开始区间
      sectionEnd: '' // 结束区间
    });
    // 计算年份区间
   const sectionDiff = (value) => {
      var self = state;
      const begunBase = new Date(value[0]);
      const endBase = new Date(value[1]);
      var begun = begunBase.getFullYear(); // 开始时间
      var end = endBase.getFullYear(); // 结束时间
      var section = end - begun;
      var yearSection = [];
      for (let i = 0; i <= section; i++) {
        yearSection.push(begun + i);
      }
      self.begunYear = begun; // 开始时间(年)
      self.endYear = end; // 结束时间(年)
      self.begunMonth =begunBase.getMonth() + 1; // 开始时间(月)
      self.endMonth = endBase.getMonth() + 1; // 结束时间(月)
      self.begunDay = begunBase.getDate(); // 开始时间(日)
      self.endDay = endBase.getDate(); // 结束时间(日)
      return yearSection;
    };
    // 获取当前时间
   const currentTime = (val) => {
      var self = state;
      var date = '';
      // 如果有值的话
      if (val) {
        date = new Date(val);
      } else {
        // 如果没有值，则获取10年前的1月1号
        date = new Date(self.yearData[0] + '/01/01');
      }
      var year = date.getFullYear(); // 当前年份
      var month = date.getMonth() + 1; // 当前月份
      var day = date.getDate(); // 当前是几号
      // 设置默认值
      self.yearValue = year;
      self.monthValue = month;
      self.dayValue = day;
      return {
        year,
        month,
        day
      }
    };
   // 获取某月的最大天数
   const getMaxDay = (year, month) => {
      var date = new Date(~~year, ~~month, 0);
      return date.getDate();
    };
    // 获取组件值
     const getValue = () => {
      const year = ctx.$refs.year && ctx.$refs.year.getCurrentIndex().data;
      const month = ctx.$refs.month && ctx.$refs.month.getCurrentIndex().data;
      const day = ctx.$refs.day && ctx.$refs.day.getCurrentIndex().data;
       return {
              value: "" + year + "/" + month + "/" + day,
              year,
              month,
              day
          }
    };
    // 指定每月天数
    const dayCount = (sum, begun = 1, init = true) => {
      const total = sum;
      let arr = []
      for (let i = begun || 1;  i <= total;  i++) {
        arr.push(i);
      }
      state.dayData = arr;
      if(!init) return
      let index = ctx.$refs.day && ctx.$refs.day.getCurrentIndex().index;
      if(index >= arr.length) {
        ctx.$nextTick(() => {
          ctx.$refs.day && ctx.$refs.day.scrollTo(index)
        })
      }
    };
   // 指定月份数据
    const monthCount = (begun, count,  init = true) => {
      let arr = []
      for (let i = begun || 1;  i <= count;  i++) {
        arr.push(i);
      }
      state.monthData = arr;
      if(!init) return
      let index = ctx.$refs.month && ctx.$refs.month.getCurrentIndex().index;
      if(index >= arr.length) {
        ctx.$nextTick(() => {
          ctx.$refs.month && ctx.$refs.month.scrollTo(index)
        })
      }
    };
  // 初始化数据
   const init = () => {
    const self = state;
    let section;
    let maxDay;
    if (props.section) {
      // 如果有指定取值范围
      section = props.section.replace(/[\\[\]]/g, '').split('-');
      self.sectionStart = new Date(section[0]);
      self.sectionEnd = new Date(section[1]);
      self.yearData = sectionDiff(section);
      // 指定默认时间
      self.curTime = currentTime(defaultVal || section[0]);
       if(!defaultVal) {
         monthCount(self.begunMonth, 12, false)
         maxDay = getMaxDay(self.yearValue, self.begunMonth + '')
         dayCount(maxDay, self.begunDay, false)
        }
    } else {
      // 如果没有指定取值范围
      const year = new Date().getFullYear(); // 当前年份
      const month = new Date().getMonth() + 1; // 当前月份
      // 没有指定取值范围则取当前年份的前后各10年
      section = [year - 10, year + 10];
      const arr = [];
      for (let i = 0; i <= ~~section[1] - ~~section[0]; i++) {
        arr.push(~~section[0] + i);
      }
      self.yearData = arr;
      const begunBase = new Date(`${arr[0]}/1/1`);
      const endBase = new Date(`${arr[arr.length -1]}/1/1`);

      self.begunYear = arr[0]; // 开始时间(年)
      self.endYear = arr[arr.length -1]; // 结束时间(年)
      self.begunMonth =begunBase.getMonth() + 1; // 开始时间(月)
      self.endMonth = endBase.getMonth() + 1; // 结束时间(月)
      self.begunDay = begunBase.getDate(); // 开始时间(日)
      self.endDay = endBase.getDate(); // 结束时间(日)

      monthCount(1, 12, false)
      maxDay = getMaxDay(year + "", month + '')
      dayCount(maxDay, 1, false)
      self.curTime = currentTime()
    }
    if(defaultVal) {
      const date = new Date(defaultVal)
      const begun = new Date(`${self.begunYear}/${self.begunMonth}/${self.begunDay}`)
      const end = new Date(`${self.endYear}/${self.endMonth}/${self.endDay}`)
      if(date < begun || date > end) return // 超出范围
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate(); 
      const maxDay = getMaxDay(year, month + '')
      if (year > self.begunYear && year > self.endYear) {
          monthCount(1, 12, false)
          dayCount(maxDay, 1, false)
      } else if(year == self.begunYear) {
          monthCount(self.begunMonth, 12, false)
          if(month ===self.endMonth ) {
              dayCount(maxDay, self.begunDay, false)
          }else if(month < self.endMonth) {
              dayCount(maxDay, 1, false)
           }
      }else if(year == self.endYear) {
        monthCount(1, self.endMonth, false)
        if(month ===self.endMonth ) {
              dayCount( self.endDay,1, false)
          }else if(month < self.endMonth) {
              dayCount(maxDay, 1, false)
           }
      }
      ctx.$nextTick(() => {
        const yearIndex = self.yearData.findIndex((item) => item === year)
        const monthIndex = self.monthData.findIndex((item) => item === month)
        const dayIndex = self.dayData.findIndex((item) => item === day)
        ctx.$refs.year && ctx.$refs.year.scrollTo(yearIndex);
        ctx.$refs.month && ctx.$refs.month.scrollTo(monthIndex);
        ctx.$refs.day && ctx.$refs.day.scrollTo(dayIndex);
      })
    }
  }
   init();
    const yearChange = (value) => {
    const self = state;
    // 如果有限制区间选择
    if (props.section) {
        const monthRef = ctx.$refs.month.getCurrentIndex()
        const monthIndex = monthRef.index >= self.monthData.length ? self.monthData.length  -1 : monthRef.index;
         if (value <= self.begunYear) {
            // 最小年份
             monthCount(self.begunMonth, 12)
             const sectionmaxDay = getMaxDay(value, self.monthData[monthIndex] + '')
             dayCount(sectionmaxDay,self.begunMonth === self.monthData[monthRef.index] ? self.begunDay : 1)
          } else if (value >= self.endYear) {
            // 最大年份
            monthCount(1, self.endMonth)
             if (self.monthData[monthIndex] < self.endMonth) {
                const maxDay = getMaxDay(value, ctx.$refs.month.getCurrentIndex().data);
                dayCount(maxDay)
              } else {
                 dayCount(self.endDay)
              }
          } else {
              const sectionmaxDay = getMaxDay(value, self.monthData[monthIndex] + '')
              monthCount(1, 12)
              dayCount(sectionmaxDay)
          }
    } else {
       // 唯一变化的就是2月份数据
       const max = getMaxDay(value, ctx.$refs.month.getCurrentIndex().data)
       dayCount(max)
    }
    ctx.$nextTick(() => {
      emit("change", getValue())
    })
  };
  const monthChange = (value) => {
      const self = state;
      // 如果有限制区间选择
      const year = ctx.$refs.year.getCurrentIndex().data
      const maxDay = getMaxDay(year, value + "")
      if (props.section) {
          // 最小限制年月
         if (year <= self.begunYear && value <= self.begunMonth) {
             dayCount(maxDay, self.begunDay)
          } else if (year === ~~self.endYear && value >= self.endMonth) {
              // 最大限制年月
               dayCount(self.endDay)
          } else {
            dayCount(maxDay)
          }
      } else {
        dayCount(maxDay)
      }
      ctx.$nextTick(() => {
         emit("change", getValue())
       })
   };
    const dayChange = () => {
      emit("change", getValue())
   };
   // 暴露给模板
   return  {
      state,
      yearFormat, 
      monthFormat, 
      dayFormat, 
      yearChange, 
      monthChange, 
      dayChange, 
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