<template>
    <div class='wt-search'>
        <div class="placeholder" v-show="!isblur" @click="handle" >
            <i class="icon-search"></i>
            <span>{{placeholder}}</span>
        </div>
        <i class="icon-search"></i>
        <form action="" @submit="submit">
            <input type="search" ref="search" v-model="val"/>
        </form>
        <i class="icon-close-fill" @click="clear"></i>
        <div class="btn" @click="cancel">取消</div>
    </div>
</template>
<script>
import { getCurrentInstance, ref } from 'vue';
export default {
  props: {
    placeholder: {
      type: String,
      default: () => {
        return '搜索';
      }
    },
    disable: {
      type: String,
      default: () => {
        return undefined;
      }
    }
  },
  setup (props, {emit}) {
    const { ctx } = getCurrentInstance()
    const val = ref("")
    const isblur = ref(false)
    const handle =()=> {
      if (props.disable !== undefined) return;
      isblur.value = true;
      ctx.$refs.search.focus();
    }
    const submit =(event) =>{
      event.preventDefault();
      emit('submit', val);
      return false;
    }
    // 清理输入内容
    const clear = () =>{
      val.value = '';
    }
    // 取消
    const cancel =()=> {
      isblur.value = false;
      val.value = '';
      emit('cancel');
    }
    // 暴露给模板
    return {
      val,
      isblur,
      handle,
      submit,
      clear,
      cancel
    };
  }
};
</script>
<style lang='less' rel='stylesheet/less' scoped>
    .wt-search {
        height: 1.5rem;
        position: relative;
        padding: 0.5rem;
        background: #EFEFF4;
        display: flex;
        .icon-search {
            font-size: 0.8rem;
            width: 1rem;
            line-height: 1.5rem;
            color: #999;
            margin-left: 0.2rem;
            padding: 0 0.2rem;
            background: #fff;
            border-top-left-radius: 0.4rem;
            border-bottom-left-radius: 0.4rem;
        }
        .icon-close-fill {
            background: #fff;
            border-top-right-radius: 0.4rem;
            border-bottom-right-radius: 0.4rem;
            width: 1.5rem;
            line-height: 1.5rem;
            color: #cacaca;
            text-align: center;
        }
        .btn {
            font-size: 0.7rem;
            min-width: 2rem;
            line-height: 1.5rem;
            text-align: center;
        }
        form {
            background: #fff;
            border: 0;
            line-height: 1.5rem;
            width: 100%;
            display: block;
        }
        input {
            outline: none;
            -webkit-appearance: none;
            background: #fff;
            border: 0;
            height: 1.5rem;
            width: 100%;
            display: block;
            &::-webkit-search-cancel-button{
                display: none; // 默认边框和删除按钮
            }
        }
        .placeholder {
            position: absolute;
            width: 100%;
            width: calc(100% - 1rem);
            top: 0.5rem;
            font-size: 0.8rem;
            color: #999;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            height: 1.5rem;
            align-items: center;
            background: #fff;
            left: 0.5rem;
            border-radius: 0.4rem;
            i {
                display: inline-block;
                margin-right: 5px;
            }
            span {
                display: inline-block;
                font-size: 0.7rem;
            }
        }
    }
</style>
