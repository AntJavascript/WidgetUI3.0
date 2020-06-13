<template>
  <div class="wt-menu">
    <wt-model v-if = "showModel != undefined">
       <ul>
      <li v-for="(item, index) in dataSource" :key="index" @click="handle(item, index)">{{item.title}}</li>
    </ul>
    </wt-model>
    <ul v-else>
      <li v-for="(item, index) in dataSource" :key="index" @click="handle(item, index)">{{item.title}}</li>
    </ul>
  </div>
</template>
<script>
import Model from './Model';

export default {
  components: {
    "wt-model": Model
  },
  props: {
    dataSource: {
      type: Array,
      default: function() {
        return [];
      }
    },
    showModel: {
      type: String,
      default: function() {
        return undefined;
      }
    }
  },
  setup(props, {emit}) {
    const handle = (item, index) => {
      event.stopPropagation();
      emit("handle", {item, index});
    }
    return {
      handle
    }
  }
};
</script>
<style lang='less' scoped>
.wt-menu {
  ul {
    width: 70%;
    background: #fff;
    z-index: 101;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 5px 0px #ccc;
    box-sizing: border-box;
    li {
      line-height: 2.2rem;
      font-size: 0.8rem;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:after {
        transform: scaleY(0.5);
        height: 1px;
        content: "";
        border-bottom: 1px solid #ccc;
        display: block;
      }
      &:last-child:after {
        border-bottom: none;
        height: 0;
      }
    }
  }
}
</style>