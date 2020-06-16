<template>
    <div class="wt-step">
     <div class='horizontal' v-if="direction.toLocaleUpperCase() === 'H'">
        <div class="item-wrapper">
        <div class="item" 
        :class="[{current:item.active}]" 
        v-for='(item, index) of dataSource' 
        :key="index" 
        @tap="switchTap(index)"
        :style="{maxWidth: 100 / dataSource.length + '%'}"
        >
            <div class="line" :style="{backgroundColor:item.active ? color : ''}" v-if="index !=dataSource.length -1"></div>
            <p :style="{color:item.active ? color : ''}">{{item.text}}</p>
            <div :class="[{active:item.active}]" :style="{backgroundColor:item.active ? color : ''}" v-if="type=='default'"></div>
            <div :class="[{active:item.active}]" :style="{backgroundColor:item.active ? color : ''}" v-else-if="type=='number'">{{index + 1}}</div>
            <div :class="[{active:item.active},{'icon-check':item.active}]" :style="{backgroundColor:item.active ? color : ''}"  v-else-if="type=='check'"></div>
            </div>
        </div>
     </div>
     <div class='vertical' v-if="direction.toLocaleUpperCase() === 'V'">
        <div class="item-wrapper">
        <div class="item" :class="[{current:item.active}]" v-for='(item, index) of dataSource' :key="index" @tap="switchTap(index)">
            <div class="left">
                <div class="arc" :class="[{active:item.active}]" v-if="type=='default'" :style="{backgroundColor:item.active ? color : ''}"></div>
                <div class="arc" :class="[{active:item.active}]" v-else-if="type=='number'" :style="{backgroundColor:item.active ? color : ''}">{{index + 1}}</div>
               <div class="arc" :class="[{active:item.active},{'icon-check':item.active}]" v-else-if="type=='check'" :style="{backgroundColor:item.active ? color : ''}"></div>
                <div class="line" :style="{backgroundColor:item.active ? color : ''}" v-if="index !=dataSource.length -1"></div>
            </div>
            <div class="right">
                <div class="title">{{item.text}}</div>
                <div class="desc">{{item.desc}}</div>
            </div>
            </div>
        </div>
     </div>
    </div>
</template>
<script>
export default {
  name: 'wt-step',
  props: {
    dataSource: {
      type: Array
    },
    type: {
      type: String,
      default: () => {
        return 'default';
      }
    },
    direction: {
      type: String,
      default: () => {
        return 'h';
      }
    },
    color: {
      type: String,
      default: () => {
        return '#1BB5F1';
      }
    }
  },
  setup (props, {emit}) {
    const switchTap= (index)=> {
      emit('handle', index);
    }
    return {
      switchTap
    };
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .wt-step {
    .horizontal{
        background: #fff;
        width: 100%;
        overflow: hidden;
        .item-wrapper {
            display: flex;
            height: 3.5rem;
            justify-content: center;
            .item{
                text-align: center;
                align-items: center;
                flex: 1;
                position: relative;
                color: #333;
                display: flex;
                justify-content: space-around;
                &.current {
                    .line {
                        // background-color: #1BB5F1;
                    }
                }
                &:first-child{
                    margin-left: -0.5rem;
                  }
                &:last-child{
                    margin-right: -0.5rem;
                  }
                p {
                    font-size: 0.7rem;
                    margin-bottom: 1.5rem;
                    line-height: 2rem;
                  }
                &.current p{
                    // color: #1BB5F1;
                  }
                .line{
                    height: 0.1rem;
                    background: #ccc;
                    width: 100%;
                    position: absolute;
                    top: 2.25rem;
                    border-radius: 0px;
                    left: 52%;
                    z-index: 1;
                  }
                div {
                    background: #ccc;
                    width: 1rem;
                    height: 1rem;
                    border-radius: 50%;
                    display: inline-block;
                    z-index: 2;
                    position: absolute;
                    top:1.8rem;
                    font-size: 0.7rem;
                    color: #a9a9a9;
                    line-height: 1rem;
                    &.active {
                        // background-color: #1BB5F1;
                        color: #fff;
                      }
                  }
              }
          }
      }
      .vertical{
        background: #fff;
        width: 100%;
        overflow: hidden;
        .item-wrapper {
            .item {
                color: #333;
                display: flex;
                min-height: 3.5rem;
                &:last-child {
                    min-height: 0.5rem;
                }
                .left {
                    position: relative;
                    height: auto;
                    display: flex;
                }
                .right {
                    margin: 0 0.2rem;
                    .title {
                        font-size: 0.7rem;
                        margin-left: 0.2rem;
                        line-height: 1.2rem;
                    }
                    .desc {
                        font-size: 0.7rem;
                        color: #999;
                        margin: 0.3rem;
                    }
                }
                &.current p{
                   // color: #1BB5F1;
                  }
                  .arc {
                    background: #ccc;
                    width: 1rem;
                    height: 1rem;
                    border-radius: 50%;
                    display: inline-block;
                    font-size: 0.7rem;
                    color: #a9a9a9;
                    line-height: 1rem;
                    text-align: center;
                  }
                &.current {
                    .line {
                        // background-color: #1BB5F1;
                    }
                }
                .line{
                    padding: 0.2rem 0;
                    background: #ccc;
                    width: 0.1rem;
                    position: absolute;
                    height: calc(100% - 1.6rem);
                    box-sizing: border-box;
                    margin-top: 1.3rem;
                    left: 0.44rem;
                  }
                div {
                    &.active {
                       // background-color: #1BB5F1;
                        color: #fff;
                      }
                  }
              }
          }
      }
}
</style>
