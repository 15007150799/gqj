<template>
    <div>
        <div class="menu-nav-wrap-full" v-bind:class="{ 'menu-nav-wrap-full-h2' : menuShow}">
                    <div class="menu-nav-wrap">
                        <div class="menu-single-wrap" v-bind:class="{ 'menu-single-wrap-active' : dataRes.lbId==item.lb_id}" @click="menuToLoad(item.lb_id,index,$event)" v-for="(item,index) in dataRes.labelList.list">
                        {{item.lb_name}}
                        </div>
                    </div>
                </div>
                <div class="content-wrap">
                    <div class="search-con">
                        <input type="text" class="search-text" v-model="keyword">
                        <div @click="search" class="search-sub">搜索</div>
                    </div>
                    <div class="content-single-wrap">
                        <div class="content-single" v-for="(item,index) in articleList" v-on:mouseenter="dataMiddle($event)" v-on:mouseleave="hiddenMiddle($event)">
                        <a :href="item.atc_id | addHref">
                            <img :src="item.atc_content | imgUrlFun" class="content-single-preview" :alt="item.atc_title">
                            <div class="content-single-middle">
                            <span class="content-single-middle-span"><i class="el-icon-view">{{item.atc_preview}}</i></span>
                            <span class="content-single-middle-span content-single-middle-span-mobile-like"><i class="el-icon-star-on">{{item.atc_like}}</i></span>
                            <span class="content-single-middle-span"><i class="el-icon-download">{{item.atc_download}}</i></span>
                            <span class="content-single-middle-span content-single-middle-span-mobile"><i class="el-icon-date">{{item.atc_publish_time | formatData}}</i></span>
                            <a class="content-single-middle-a" v-if="item.atc_fileUrl != null" target="blanck" :href="item.atc_fileUrl | preview"><span @click="onPreview(item.atc_id)" class="content-single-middle-preview">预览</span></a>
                            </div>
                            <div class="content-single-footer">
                            {{item.atc_title}}
                            </div>
                        </a>
                        </div>
                    </div>
                    <div class="not-content-wrap" v-if="pagination.total==0">
                        <img class="not-content-img" src="../../../../asset/images/head-pic.png" alt="">
                        <h2>暂无内容</h2>
                    </div>
                </div>
              <div class="pagination_wrap" v-if="pagination.total>0">
                <PaginationPage @current-change="changePaginationIndex" :total="pagination.total" :pageSize="pagination.pagesize"></PaginationPage>
              </div>
    </div>
</template>
<style scoped lang="scss">
    @import '../../../../asset/css/mixin.scss';
    @import "./document.scss";
</style>
<script type="babel">
  import $ from "jquery";
  import '../../../../asset/js/rem.js';
  import format from 'date-fns/format'
  import request from 'framework/network/request';
  import PaginationPage from '../pagination/pagination';
  export default {
    components: {
      PaginationPage
    },
    props:['dataRes'],
    data(){
      return {
        pagination:{
          index:1,
          pagesize:12,
          total:this.dataRes.articleList.total || 0,
        },
        hrefFileUrl:'',
        articleList:this.dataRes.articleList.temp || [],
        labelList:[],
        menuShow:false,
        keyword:null,
        footerPosition:true,
        document:'document',
      }
    },
    watch:{
    },
    mounted() {
      const _this = this;
      document.onkeydown = function (e) { // 回车提交表单
      // 兼容FF和IE和Opera
          var theEvent = window.event || e;
          var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
          if (code == 13) {
              _this.search();
          }
      }
    },
    methods: {
      changePaginationIndex(currentIndex){
        this.loadData(1,currentIndex);
      },
      onPreview(atcid){
          request.get(`/detail/api/article/countPreview?atcid=${atcid}`).then(response => {
          });
      },
      menuToLoad(lbId,index,event){
        this.defaultIndex=index;
        this.loadData(lbId,1);
        $(event.currentTarget).siblings().removeClass('menu-single-wrap-active');
        $(event.currentTarget).addClass('menu-single-wrap-active');
        
      },
      search(){
        request.get(`/document/api/article/search?keyword=${this.keyword}`).then(response => {
          this.articleList = response.data.temp;
          this.$emit('totalC',this.articleList.length);
          this.pagination.total = response.data.total;
        });
      },
      loadData(lbId,index) {
        request.get(`/document/api/article/list?id=${lbId}&index=${index}`).then(response => {
          this.articleList = response.data.temp;
          this.pagination.total = response.data.total;
          this.$emit('totalC',this.articleList.length);
        });
      },
      dataMiddle(event){
        $(event.currentTarget).find('.content-single-middle').fadeIn("slow");
      },
      hiddenMiddle(event){
        $(event.currentTarget).find('.content-single-middle').fadeOut("slow");
      },
    },
    filters: {
      formatData(data){
        return format(parseInt(data),'YYYY-MM-DD');
      },
      addHref(data){
        return '/detail?id=' + data;
      },
      preview(data){
        if(data){
          return data.split('.')[0] + '/index.html';
        }
      },
      imgUrlFun(str){
        let data = '';
            str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
                  data =  capture;
            });
            if(data==null || data==''){
              data = '/public/img/default.jpeg'
            }
        return data
      }
    },
  }
</script>
