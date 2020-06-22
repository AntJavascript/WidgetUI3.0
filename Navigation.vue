<template>
        <div class="wt-navigation">
          <div class="box">
            <div v-for="(list, index) in dataSource" 
            :key="index" 
            :class="[{'active':currentIndex == index}, 'item']" 
            :style="{color: currentIndex == index ? selectedColor : ''}"
            @click="handle(index)">
                <i :class="list.icon" v-if="list.icon"></i>
                <img class="image" v-if="list.image" :src="list.image" />
                <p>{{list.title}}</p>
            </div>
          </div>
        </div>
</template>
<script>
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => {
        return [];
      }
    },
    currentIndex: {
      type: Number || String,
      default: () => {
        return 0;
      }
    },
    selectedColor: {
      type: String,
      default: () => {
        return '#1BB5F1';
      }
    }
  },
  setup (props, {emit}) {
    const handle = (index) => {
      emit('change', index);
    }
    // 暴露给模板
    return {
      handle
    };
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
.wt-navigation {
  width: 100%;
  background: #fff;
  padding: 0.4rem 0;
  .box {
    display: flex;
    justify-content: space-between;
    height: 100%;
    .item {
      font-size: 0.7rem;
      flex: 1;
      text-align: center;
      i {
        font-size: 1rem;
      }
      .image {
        width: 1rem;
        height: 1rem;
      }
      p {
        font-size: 0.6rem;
      }
    }
  }
}
</style>
