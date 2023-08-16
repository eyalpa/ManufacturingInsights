module.exports = app => {
  const controller = require("../controllers/controller.js");
  const _ = require('lodash');

  const paginateMiddleware = (req, res, next) => {
    let data = res.locals.data;
    if (Array.isArray(data)) {
      const limit = parseInt(req.body.length) || 10;
      const page = parseInt(req.body.start / limit) || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const cols = req.body.order.map(x => req.body.columns[x.column].data);
      const colsOrder = req.body.order.map(x => x.dir);
      data = _.orderBy(data.map(x => _.pick(x, req.body.columns.map(x => x.data))), cols, colsOrder);

      const paginatedResults = {
        data: data.slice(startIndex, endIndex),
        totalPages: Math.ceil(data.length / limit),
        page,
        draw: parseInt(req.body.draw || 1),
        perPage: limit,
        recordsTotal: data.length,
        recordsFiltered: data.length,
        previous: startIndex > 0 ? page - 1 : null,
        next: endIndex < data.length ? page + 1 : null,
        yield: data.map(x => { return { TEST_DATE: x.TEST_DATE, PASS: x.PASS }; }).sort((a, b) => new Date(a.TEST_DATE) - new Date(b.TEST_DATE))
      };

      return res.status(200).json(paginatedResults);
    }
    next();
  };

  var router = require("express").Router();

  router.post("/manufacturing-data", controller.findFilter);

  router.post("/loadData", controller.loadData);
  router.post("/loadDataMock", controller.loadDataMock);
  router.post("/DownloadBson", controller.DownloadBson);
  router.post("/DownloadExcel", controller.DownloadExcel);

  app.use("/api/", router);
  app.use(paginateMiddleware);

};
