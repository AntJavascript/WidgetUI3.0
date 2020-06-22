  
<template>
    <div class='wt-gridView'>
        <ul>
            <li v-for="(item, index) in dataSource" :key="index" @click="handle(index)" :style="{'flex-basis': (100 / columns) + '%'}">
                <div class="cloumn">
                    <i :class="item.icon" v-if="item.icon" :style="{'color': item.color}"></i>
                    <wt-image class="img" v-if="item.image" :src="item.image" fit="fill"></wt-image>
                    <span>{{item.title || item}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import Image from './Image';

export default {
  components: {
    'wt-image': Image
  },
  props: {
    dataSource: {
      type: Array,
      default: ()=> {
        return [];
      }
    },
    columns: {
      type: Number || String,
      default: ()=> {
        return 3;
      }
    }
  },
  setup (props, {emit}) {
    const handle = index => {
       emit('handle', index)
    }
    // 暴露给模板
    return {
      handle
    };
  }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
.wt-gridView {
   height: 100%;
    ul {
        width: 100%;
        background: #fff;
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-wrap:wrap;
        height: 100%;
        li {
            line-height: 2.2rem;
            font-size: 0.8rem;
            text-align: center;
            position: relative;
            list-style: none;
            display: flex;
            align-items: center;
            justify-content: center;
            .cloumn {
              display: flex;
              align-items: center;
              flex-direction: column;
              i {
                font-size: 1.5rem;
                margin-top: 0.5rem;
            }
            .img {
              margin-top: 0.5rem;
              width: 1.5rem;
              height: 1.5rem;
            }
            span {
                font-size: 0.8rem;
            }
            }
            
            &:after {
                position: absolute;
                box-sizing: border-box;
                transform: scale(.5);
                content: '';
                box-sizing: border-box;
                top:-50%;
                bottom:-50%;
                left:-50%;
                right:-50%;
                border: 0px solid #e4e4e4;
                border-width: 0 1px 1px 0;
            }
        }
    }
}
</style>
