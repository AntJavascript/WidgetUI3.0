<template>
  <div class="wt-calendar">
    <div class="date mint-content">
      <div class="calendar-content">
        <!-- 年份 月份 -->
        <div class="year-month">
          <div class="month" v-if="direction=='horizontal'">
            <i class="icon-back" @click="pickPre()"></i>
            <span>{{ state.currentYear }} 年 {{ state.currentMonth }} 月</span>
            <i class="icon-right" @click="pickNext()"></i>
          </div>
        </div>
        <!-- 星期 -->
        <ul class="weekdays" :class="{'fixed': direction=='vertical'}">
          <li v-for="(item, index) in headRule" :key="index">{{item}}</li>
        </ul>
        <div v-if="direction=='vertical'" style="height:2rem;"></div>
        <!-- 日期 -->
        <div
          class="bodyDiv"
          :class="direction"
          @touchstart="touchStart"
          @touchmove="touchMove"
          @touchend="touchEnd"
          :style="{transform: 'translate3d('+ state.distance +'px, 0px, 0px)'}"
        >
          <div class="months" v-for="(item,index0) in state.AllData" :key="index0">
            <div
              class="month-list"
              v-if="direction=='vertical'"
            >{{state.months[index0].getFullYear()}} - {{state.months[index0].getMonth() + 1}}</div>
            <ul class="days" v-for="(value,index1) in item" :key="index1">
              <li @click="pick(day,index+index1*7)" v-for="(day, index) in value" :key="index">
                <!--本月-->
                <div
                  class="dateItem"
                  :class="{
                'selected': selectedClassNme(day, index ),
                'disabled': disabledClassName(day),
                'other': otherClassNme(day),
                'currentDay': currentDayClassName(day),
                }"
                >
                  <span v-if="day==='spaces'"></span>
                  <span v-else>{{ day.getDate() }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted, getCurrentInstance } from "vue";

export default {
  props: {
    // 是否显示当月之外的数据(仅对direction=='horizontal'有效)
    isFull: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    // 限制显示区间
    section: {
      type: String,
      default: () => {
        return "";
      }
    },
    // 头部显示星期数据
    headRule: {
      type: Array,
      default: () => {
        return ["一", "二", "三", "四", "五", "六", "日"];
      }
    },
    // 日期布局显示方向（默认垂直）
    direction: {
      type: String,
      default: () => {
        return "vertical";
      }
    },
    // 默认选择日期
    SelectProp: {
      type: String,
      default: () => {
        return "";
      }
    },
    // 滑动多少比例触发下一页
    ratio: {
      type: Number,
      default: () => {
        return 0.5;
      }
    }
  },
  setup(props) {
    const { ctx } = getCurrentInstance();
    const state = reactive({
      days: [], // 临时存放数据数组，init初始化之后会情况
      daysUL: [], // 临时存放数据数组，init初始化之后会情况
      AllData: [], // 界面展示数据的数组，三维数组(月，星期)
      currentYear: 0, // 当前显示的年份
      currentMonth: 0, // 当前显示的月份
      startX: 0, // 触摸点X坐标
      startY: 0, // 触摸点Y坐标
      moveX: 0, // 触摸移动点X坐标
      moveY: 0, // 触摸移动点Y坐标
      moveing: false, // 是否正在执行滑动动画
      sectionBegin: "", // 时间开始范围
      sectionEnd: "", // 时间结束范围
      currentDate: new Date(), // 当前选择数据
      months: [], // 所有年月(仅对direction=='vertical'有效)
      distance: 0, // 滑动距离
      thisDistance: 0, // 本次滑动距离
      currentIndex: 0, // 当前处于第几个
      width: 0 // 组件宽度
    });
    // 获取当月有多少天
    const getcurMonthDays = (year, month) => {
      const curMonthDays = new Date(year, month, 0).getDate();
      return curMonthDays;
    };
    // 某月1号是星期几
    const dayWeek = (year, month) => {
      const week = new Date("" + year + "/" + month + "/" + "1").getDay();
      return week === 0 ? 7 : week;
    };
    // 是否有7天数据，有的话push给 "daysUL"
    const isSevenDay = flag => {
      if (flag) {
        state.daysUL.push(state.days);
        state.days = [];
        return;
      }
      if (state.days.length % 7 === 0) {
        state.daysUL.push(state.days);
        state.days = [];
      }
    };
    // 获取某月数据
    const getAllMouthData = (year, month) => {
      // 循环当月总天数
      const curMonthDays = getcurMonthDays(year, month);
      for (let i = 0; i <= curMonthDays; i += 1) {
        const d = new Date(year + "/" + month + "/" + 1);
        if (i < curMonthDays) {
          // 小于当月最大天数，放入数组
          d.setDate(d.getDate() + i);
          state.days.push(d);
        } else {
          // 不足7天用 "spaces" 代替
          for (let j = state.days.length, l = 1; j < 7; j++, l++) {
            // 如果存在 ifFull 参数说明需要显示42天
            if (state.isFull) {
              if (month === 12) {
                state.days.push(new Date(year + 1 + "/1/" + l));
              } else {
                state.days.push(new Date(year + "/" + (month + 1) + "/" + l));
              }
            }
          }
        }
        isSevenDay();
      }
      isSevenDay(true);
      // isFull = true && 没有42条数据
      if (props.isFull && state.daysUL.length < 6) {
        let lastData = state.daysUL[state.daysUL.length - 1][6]; // 最后一条数据
        if (!lastData && state.daysUL[state.daysUL.length - 1].length === 0) {
          try {
             lastData = state.daysUL[state.daysUL.length - 2][6];
          } catch(err) {
            console.log(err, "请检查数组是否越界")
          }
        }
        for (let j = lastData.getDate(); j < 7 + lastData.getDate(); j++) {
          state.days.push(
            new Date(
              lastData.getFullYear() + "/" + (lastData.getMonth() + 1) + "/" + j
            )
          );
        }
        isSevenDay();
      }
      // 如果 state.daysUL[0] 没有值
      if (props.isFull && state.daysUL[0].length === 0) {
        state.daysUL.splice(0, 1);
        let lastData = state.daysUL[state.daysUL.length - 1][6]; // 最后一条数据
        if (!lastData && state.daysUL[state.daysUL.length - 1].length === 0) {
          try {
             lastData = state.daysUL[state.daysUL.length - 2][6];
          } catch(err) {
            console.log(err, "请检查数组是否越界")
          }
        }
        for (let j = lastData.getDate(); j < 7 + lastData.getDate(); j++) {
          state.days.push(
            new Date(
              lastData.getFullYear() + "/" + (lastData.getMonth() + 1) + "/" + j
            )
          );
        }
        isSevenDay();
      }
    };
    // 处理开始范围
    if (props.section !== "") {
      state.sectionBegin = props.section.split("-")[0].replace(/\[/, "");
    } else {
      state.sectionBegin = `${new Date().getFullYear()}/${new Date().getMonth() +
        1}/${new Date().getDate()}`;
    }
    // 处理结束范围
    if (props.section !== "") {
      state.sectionEnd = props.section.split("-")[1].replace(/\]/, "");
    } else {
      const count = getcurMonthDays(
        new Date().getFullYear(),
        new Date().getMonth() + 1
      );
      state.sectionEnd = `${new Date().getFullYear()}/${new Date().getMonth() +
        1}/${count}`;
    }
    const currentDate = new Date(state.sectionBegin);
    state.currentYear = currentDate.getFullYear(); // 当前年份
    state.currentMonth = currentDate.getMonth() + 1; // 当前月份
    // 初始当前选中
    if (props.SelectProp) {
      state.currentDate = new Date(props.SelectProp);
    }
    const formatDate = (year, month, day) => {
      const y = year;
      let m = month;
      if (m < 10) {
        m = `0${m}`;
      }
      let d = day;
      if (d < 10) {
        d = `0${d}`;
      }
      return `${y}/${m}/${d}`;
    };

    onMounted(() => {
      state.width = ctx.$el.clientWidth;
    });
    const touchStart = event => {
      // 开始触摸坐标
      state.startX = event.touches[0].clientX;
      state.startY = event.touches[0].clientY;
    };
    // 触摸滑动事件
    const touchMove = event => {
      if (props.direction === "vertical") {
        return;
      }
      event.currentTarget.style.transitionDuration = "0s";
      // 移动触摸坐标
      state.moveX = event.touches[0].clientX;
      state.moveY = event.touches[0].clientY;
      if (Math.abs(state.startY - state.moveY) > 30) {
        return;
      } else {
        event.preventDefault();
      }
      event.preventDefault();
      // 本次滑动距离
      const thisDistance = state.moveX - state.startX;
      state.thisDistance = thisDistance;
      let resistance = 1;
      if (
        (thisDistance > 0 && state.currentIndex === 0) ||
        (thisDistance < 0 && state.currentIndex === state.AllData.length - 1)
      ) {
        resistance = 0.2;
      }
      // 需要滑动的距离
      state.distance =
        -(state.currentIndex * state.width) + thisDistance * resistance;
    };
    // 触摸介绍事件
    const touchEnd = event => {
      // 300毫秒内只允许滑动一次，避免滑动过快
      if (state.moveing) {
        return;
      }
      state.moveing = true;
      setTimeout(() => {
        state.moveing = false;
      }, 300);
      const distance = state.moveX - state.startX;
      if (props.direction === "vertical") {
        return;
      }
      event.currentTarget.style.transitionDuration = "300ms";
      // 如果往左滑 < -state.width * state.ratio
      if (state.moveX !== 0 && distance < -state.width * props.ratio) {
        // 如果是最后一个滑动，则设置最大滑动距离
        pickNext();
        // 如果往右滑 > state.width * state.ratio
      } else if (distance > state.width * props.ratio) {
        // 如果不是第一个滑动
        pickPre();
      } else {
        // 滚回当前滚动距离
        state.distance = -(state.currentIndex * state.width);
      }
      setTimeout(() => {
        state.startX = 0;
        state.moveX = 0;
      }, 200);
    };
    // 初始化日期
    const initData = (cur, init) => {
      const paramDate = new Date(cur);
      if (init) {
        state.currentYear = paramDate.getFullYear();
        state.currentMonth = paramDate.getMonth() + 1;
      }
      const year = paramDate.getFullYear();
      const month = paramDate.getMonth() + 1;
      state.days.length = 0;
      // 没有的日期用 "spaces" 代替
      const firstWeek = dayWeek(
        paramDate.getFullYear(),
        paramDate.getMonth() + 1
      );
      const beforeSpaces = new Array(firstWeek - 1).fill(
        "spaces",
        0,
        firstWeek - 1
      );
      // 如果存在 ifFull 参数说明需要显示42天
      if (props.isFull) {
        let prevMonth = 0;
        // 如果当前月份是1月
        if (month === 1) {
          prevMonth = new Date(year - 1, 12, 0).getDate(); // 取上一个月的最后一天
          beforeSpaces.forEach((item, index) => {
            state.days.push(
              new Date(
                year -
                  1 +
                  "/" +
                  "12/" +
                  (prevMonth - (beforeSpaces.length - (index + 1)))
              )
            );
          });
        } else {
          prevMonth = new Date(year, month - 1, 0).getDate(); // 取上一个月的最后一天
          beforeSpaces.forEach((item, index) => {
            const date = `${year}/${month - 1}/${prevMonth -
              (beforeSpaces.length - (index + 1))}`;
            state.days.push(new Date(date));
          });
        }
      } else {
        beforeSpaces.forEach((item) => {
          state.days.push(item);
        });
      }
      isSevenDay();
      if (
        new Date("" + year + "/" + month + "/" + "1") <
        new Date(state.sectionEnd)
      ) {
        state.months.push(new Date("" + year + "/" + month));
        getAllMouthData(year, month);
        state.AllData.push(state.daysUL);
        state.daysUL = [];
        if (month === 12) {
          initData(formatDate(year + 1, 1, 1), false);
        } else {
          initData(formatDate(year, month + 1, 1), false);
        }
      }
    };
    // 初始化
    initData(formatDate(state.currentYear, state.currentMonth, 1), true);
    
    // 上一個月
    const pickPre = () => {
      if (state.currentIndex === 0) {
        state.distance = -(state.currentIndex * state.width);
        return;
      }
      // 如果滑动之前月份是1月份，那就设置为12月份，年份-1, 否则只有月份-1
      if (state.currentMonth === 1) {
        state.currentMonth = 12;
        state.currentYear--;
      } else {
        state.currentMonth--;
      }
      state.currentIndex--;
      state.distance = -(state.currentIndex * state.width);
    };
    // 下一个月
    const pickNext = () => {
      if (state.currentIndex === state.AllData.length - 1) {
        state.distance = -(state.currentIndex * state.width);
        return;
      }
      // 如果滑动之前月份是12月份，那就设置为1月份，年份+1, 否则只有月份+1
      if (state.currentMonth === 12) {
        state.currentMonth = 1;
        state.currentYear++;
      } else {
        state.currentMonth++;
      }
      state.currentIndex++;
      state.distance = -(state.currentIndex * state.width);
    };
    // 当前选择日期
    const pick = (date) => {
      if (disabledClassName(date)) {
        return;
      }
      if (date === "spaces") {
        return;
      }
      state.currentDate = date;
      // 传值父组件
      ctx.$emit("change", date);
    };
    // 显示 other 类
    const otherClassNme = day => {
      if (
        new Date(day).getFullYear() === state.currentYear &&
        day.getMonth() + 1 === state.currentMonth
      ) {
        return false;
      } else {
        return true;
      }
    };
    // 显示 currentDay 类
    const currentDayClassName = day => {
      // 年月日都相等，则显示currentDay类，说明是当天
      if (
        new Date(day).getFullYear() === new Date().getFullYear() &&
        day.getMonth() + 1 === new Date().getMonth() + 1 &&
        day.getDate() === new Date().getDate()
      ) {
        return true;
      } else {
        return false;
      }
    };
    /*
     * 年月日都相等
     */
    const selectedClassNme = day => {
      if (typeof state.currentDate === "string" || typeof day === "string") {
        return false;
      }
      // 选择时间的年月日
      const selectDateYear = day.getFullYear();
      const selectDateMonth = day.getMonth() + 1;
      const selectDateDate = day.getDate();
      // 参数时间年月日
      const paramsDateYear = state.currentDate.getFullYear();
      const paramsDateMonth = state.currentDate.getMonth() + 1;
      const paramsDateDate = state.currentDate.getDate();

      if (
        selectDateYear === paramsDateYear &&
        selectDateMonth === paramsDateMonth &&
        selectDateDate === paramsDateDate
      ) {
        return true;
      } else {
        return false;
      }
    };
    // 超出规定范围，是否允许点击
    const disabledClassName = day => {
      const date = new Date(day);
      const sectionBeginDate = new Date(state.sectionBegin);
      const sectionEndDate = new Date(state.sectionEnd);
      if (date < sectionBeginDate || date > sectionEndDate) {
        return true;
      } else {
        return false;
      }
    };
    return {
      state,
      touchStart,
      touchMove,
      touchEnd,
      pick,
      otherClassNme,
      currentDayClassName,
      selectedClassNme,
      disabledClassName
    }
  }
};
</script>
<style scoped lang="less" rel="styleSheet/less">
.wt-calendar {
  // overflow: hidden;
  .date {
    color: #333;
    float: left;
    width: 100%;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    .calendar-content {
      background: #fff;
      .year-month {
        &.showBtn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 0.3rem;
        }
        .month {
          font-size: 0.7rem;
          text-align: center;
          // width: 100%;
          // border-bottom: 1px solid gainsboro;
          line-height: 2.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          i {
            cursor: pointer;
            width: 2.2rem;
            height: 2.2rem;
            display: block;
            line-height: 2.2rem;
          }
        }
      }
      .weekdays {
        opacity: 0.6;
        display: flex;
        font-size: 0.7rem;
        border-bottom: 1px solid #eee;
        background: #fff;
        &.fixed {
          position: fixed;
          z-index: 10;
          opacity: 1;
          width: 100%;
        }
        li {
          flex: 1;
          font-size: 0.7rem;
          width: 2.7rem;
          list-style-type: none;
          text-align: center;
          line-height: 2rem;
          cursor: pointer;
        }
      }
      .bodyDiv {
        display: flex;
        transition-timing-function: ease-out;
        transition-property: transform;
        transition-duration: 300ms;
        &.vertical {
          display: block;
        }
        .months {
          min-width: 100%;
          width: 100%;
          .month-list {
            text-align: center;
            font-size: 0.8rem;
            font-weight: bold;
            background: #eee;
            padding: 0.2rem;
          }
          .days {
            display: flex;
            li {
              // flex: 1;
              font-size: 0.7rem;
              list-style-type: none;
              text-align: center;
              line-height: 2rem;
              cursor: pointer;
              width: 14.285%;
              padding: 0 0 14.285%;
              position: relative;
              .dateItem {
                position: relative;
                justify-content: center;
                align-items: center;
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                &.other {
                  color: #333;
                }
                &.disabled {
                  background: #e2e0e0;
                  color: #999;
                }
                &.currentDay {
                  background: #f6f6f6;
                }
                &.selected {
                  color: #fff;
                  background-color: #1bb5f1;
                }
              }
            }
          }
        }
        // border-bottom: 1px solid gainsboro;
      }
    }
  }
}
</style>
