const sendError = require('./errorController');
const APIFeatures = require('../../utils/apiFeatures');

exports.deleteOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc) {
      throw new Error('No document found with that ID');
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch(err) {
    sendError(err, 404, req, res);
  }
};

exports.updateOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true
    });
    if(!doc) {
      throw new Error('No document found with that ID');
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  } catch(err) {
    sendError(err, 404, req, res);
  }
};

exports.createOne = (Model) => async (req, res) => {
  try {
    req.body.createdAt = new Date().toISOString();
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc
      }
    });
  } catch(err) {
    sendError(err, 400, req, res);
  }
};  

exports.getOne = (Model, ...populateQuery) => async (req, res) => {
  try {
    let query = Model.findById(req.params.id);
    if(populateQuery.length > 0) {
      populateQuery.map(el => query.populate(el));
    }
    const doc = await query;

    if(!doc) {
      throw new Error('No docuemtn found with that ID');
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  } catch(err) {
    sendError(err, 404, req, res);
  }
};

exports.getAll = (Model) => async (req, res) => {
  try {
    const docs = await APIFeatures(Model, req.query);
    const totalNum = await Model.count();
    
    res.status(200).json({
      status: 'success',      
      data: {
        totalNum,
        results: docs.length,
        docs
      }
    });
  } catch(err) {
    sendError(err, 404, req, res);
  }
};
