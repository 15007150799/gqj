'use strict';
const egg = require('egg');
module.exports = class DocumentchController extends egg.Controller {
  async index(ctx) {
    const keyword = [];
    // 获取文档标签
    const labelList = await ctx.service.label.getLabelListForend(2);
    // 获取文档列表
    const docList = await ctx.service.document.getDocList();
    if (typeof labelList.list !== 'undefined' && labelList.list.length > 0 && typeof docList.list !== 'undefined' && docList.list.length > 0) {
      labelList.list.forEach(labelItem => {
        const arr = [];
        docList.list.forEach(docItem => {
          if (labelItem.lb_id.toString() === docItem.doc_label) {
            arr.push(docItem);
            keyword.push(docItem.doc_title);
          }
        });
        labelItem.docList = arr;
      });
    }
    // seo信息
    let keywords = keyword.join(',');
    keywords = keywords.substr(0, 60);
    const description = '凌晨零点半，前端中文文档，前端中文api，前端中文开发文档汇总，前端中文编程';
    const seo = {
      title: '凌晨零点半-前端中文文档大全',
      keywords,
      description,
    };
    const dataRes = { labelList, docList, seo };
    await this.ctx.render('documentch/documentch.js', { dataRes });
  }
};