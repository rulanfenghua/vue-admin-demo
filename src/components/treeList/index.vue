<template>
  <div class="tree">
    <el-tree :data="roleList" node-key="id" ref="tree" accordion check-strictly highlight-current :props="defaultProps" :default-expanded-keys="defaultExpanded" @node-click="nodeclicked" default-expand-all>
    </el-tree>
  </div>
</template>

<script>
import {treeList} from '@/api/systemSetting'

export default {
  name: 'tree',
  data() {
    return {
      roleList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultExpanded: []
    }
  },
  methods: {
    initTreeList() {
      treeList().then(response => {
        console.log('树形结构————————tree')
        console.log(response)
        this.roleList = this._transTreeData(response.data)
      }).catch(error => {
        console.log(error)
      }).then(() => {

      })
    },
    nodeclicked(data) {
      // let expectedArray = []
      // this.stationOptions.forEach(obj => {
      //   expectedArray.push(obj.value)
      // })
      // if (expectedArray.indexOf(data.id) !== -1) {
      //   console.log(data.id)
      //   this.station = data.id
      // } else {
      //   this.station = null
      // }
      // this.init()
      this.$emit('clicked', data)
      console.log('树形结构返回————————tree')
      console.log(data)
    },
    _transTreeData(items) {
      if (items.length > 0) {
        var curPid = null // 默认最上层节点id为null
        var parent = this._findChild(curPid, items)
        console.log('parent——————————tree')
        console.log(parent)
        return parent
      } else {
        return []
      }
    },
    _findChild(curPid, items) {
      var _arr = []
      var length = items.length

      for (var i = 0; i < length; i++) {
        if (items[i].parentId === curPid) {
          var _obj = {
            id: '',
            label: ''
          }
          _obj.id = items[i].id
          _obj.label = items[i].stationName || items[i].userName
          _obj.children = this._findChild(_obj.id, items)
          if (items[i].type === 1) {
            return
          }
          _arr.push(_obj)
        }
      }
      return _arr
    }
  }
}
</script>

<style lang="scss">
  .tree {
    .el-tree {
      background-color: transparent;
      margin-top: 10px;
      height: 100%;

      &::after {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        content: '';
        width: 1px;
        background: no-repeat center url('./xian.png');
        background-size: auto 100%;
        height: 100%;
        opacity: 0.7;
      }
    }

    .el-tree-node__expand-icon+span::before {
      display: inline-block;
      vertical-align: bottom;
      margin-bottom: 10px;
      width: 20px;
      height: 20px;
    }

    .el-tree-node__content .el-tree-node__expand-icon+span::before {
      content: url(./7.png);
    }

    .el-tree-node__children .el-tree-node__expand-icon+span::before {
      content: url(./8.png);
    }

    .el-tree-node__children .el-tree-node__children .el-tree-node__expand-icon+span::before {
      content: url(./8.png);
    }

    .el-tree-node__children .el-tree-node__children .el-tree-node__children .el-tree-node__expand-icon+span::before {
      content: url(./1.png);
    }

    .el-tree-node__content {
      height: 35px;
      line-height: 35px;
    }
  }
</style>
