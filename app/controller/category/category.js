'use strict';
module.exports = app => {
  return class CategoryController extends app.Controller {
    async index(ctx) {
      const result = 1;// this.service.article.getArtilceList();
      await this.ctx.renderClient('category/category.js', result);
    }
  };
};