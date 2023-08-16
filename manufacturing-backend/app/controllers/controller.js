const db = require("../models");
const BSON = require('bson'); //ON mac bson-ext
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const bsonFilePath = path.resolve(__dirname, '../nvidiaDB/mnf_data.bson');
const defaultBson = fs.readFileSync(bsonFilePath);
const mockData = require('../mock/mockData');
const manufacturingModel = db.manufacturingModel;

// API Endpoint to fetch manufacturing data based on filters
exports.findFilter = async (req, res, next) => {
  const { TEST_DATE: { start = 0, end = Date.now() }, PN, TEST_TYPE, PASS } = req.body.filters;
  try {
    const filters = {
      TEST_DATE: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    };

    if (PN) filters.PN = PN;
    if (TEST_TYPE) filters.TEST_TYPE = TEST_TYPE;
    if (PASS) filters.PASS = PASS;


    const data = await manufacturingModel.find(filters);
    res.locals.data = data;
    next && next();

  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}


exports.loadData = async (req, res) => {
  try {
    const bsonData = defaultBson;
    const jsonData = BSON.deserialize(bsonData);

    await manufacturingModel.insertMany([jsonData]);
    res.status(200).send({ message: 'Data successfully loaded' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to load data' });
  }
}
exports.loadDataMock = async (req, res) => {
  try {
    const mock = mockData.generateMockData();
    await manufacturingModel.insertMany(mock);
    res.status(200).send({ message: 'Data successfully loaded' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to load data' });
  }
}

exports.DownloadBson = async (req, res, next) => {
  const { TEST_DATE: { start = 0, end = Date.now() }, PN, TEST_TYPE, PASS } = req.body.filters;
  try {
    const filters = {
      TEST_DATE: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    };

    if (PN) filters.PN = PN;
    if (TEST_TYPE) filters.TEST_TYPE = TEST_TYPE;
    if (PASS) filters.PASS = PASS;


    const data = await manufacturingModel.find(filters);

    const bsonData = BSON.serialize(data);

    // Set the appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');

    // Send the BSON data
    res.send(bsonData);

  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

exports.DownloadExcel = async (req, res, next) => {
  const { TEST_DATE: { start = 0, end = Date.now() }, PN, TEST_TYPE, PASS } = req.body.filters;
  try {
    const filters = {
      TEST_DATE: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    };

    if (PN) filters.PN = PN;
    if (TEST_TYPE) filters.TEST_TYPE = TEST_TYPE;
    if (PASS) filters.PASS = PASS;


    const data = await manufacturingModel.find(filters);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    data.forEach(row => {
      worksheet.addRow(row);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}