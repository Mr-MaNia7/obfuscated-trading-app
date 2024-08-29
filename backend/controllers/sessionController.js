const multer = require('multer');
// const fs = require('fs');
const Session = require('./../models/sessionModel');
const factory = require('./assets/handlerFactory');
const sendError = require('./assets/errorController');
const APIFeatures = require('./../utils/apiFeatures');

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'client/public/image/sessions/');
  },
  filename: function (req, file, cb) {
    const filename = `session-${req.user.id}-${Date.now()}.jpeg`;
    cb(null, filename);
  }
})
const multerFilter = (req, file, callback) => {
  if(file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new Error('Not an image. Please upload only images'), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadSessionImage = upload.single('image');

exports.createSession = async (req, res, next) => {
  try {
    if(req.file) req.body.image = req.file.filename;
    req.body.createdAt = new Date().toISOString();
    req.body.user = req.user.id;
    req.body.questions = JSON.parse(req.body.questions);
    // console.log(req.body);
    if(req.body.questions.length <= 0) {
      return next(
        sendError({message: {questions: 'Questions are required'}}, 400, req, res)
      );
    }

    const newSession = await Session.create(req.body);
    
    res.status(200).json({
      status: 'success',
      data: {
        newSession
      }
    });
  } catch(err) {
    sendError(err, 400, req, res);
  }
};

exports.getAllSessions = async (req, res, next) => {
  try {
    if(!req.query.title) {
      delete req.query.title;
    } else {      
      req.query['$text'] = {'$search': req.query.title};
      delete req.query.title;
    }
    // console.log(req.query);
    const docs = await APIFeatures(Session, req.query);
    delete req.query.page;
    delete req.query.limit;
    // the total number of the searched data; remove the page and limit information.
    const totalNum = await Session.find(req.query).count();
    
    res.status(200).json({
      status: 'success',      
      data: {
        totalNum,
        results: docs.length,
        docs
      }
    });
  } catch(err) {
    sendError(err, 400, req, res);
  }
};

exports.getSession = factory.getOne(Session, {path: 'user'}, {path: 'answers'});
exports.deleteSession = factory.deleteOne(Session);