module.exports = (err, statusCode, req, res) => {
  // handle Cast Error in DB
  if(err.name === 'CastError') {
    err.message = `Invalid ${err.path}: ${err.values}`;
    statusCode = 400;
  }
  // handle Duplicate fields Error in DB
  if(err.code === 11000) {
    const key = Object.keys(err.keyValue)[0];
    const value = err.keyValue[key];
    if(key === 'email') {
      err.message = {[key]: `This email "${value}" is already used by another user. Please provide another value.`};
    } else if(key === 'accountName') {
      err.message = {[key]: `This account name "${value}" is already used. Please provide another value.`};
    }
    statusCode = 400;
  }
  // handle Validation Error DB
  if(err.name === 'ValidationError') {
    let error = {};
    let key;
    for(key in err.errors) {
      error[key] = err.errors[key].message;
    }
    err.message = error;
    statusCode = 400;
  }
  // handle JWTError
  if(err.name === 'JsonWebTokenError') {
    err.message = 'Invalid token. Please log in again';
    statusCode = 401;
  }
  // handle JWTExpireError
  if(err.name === 'TokenExpiredError') {
    err.message = {token: 'Your token has expired! Please log in again.'};
    statusCode = 401;
  }
  // console.log(req.originalURl);
  if(req.originalUrl.startsWith('/api')) {
    // Fro API
    res.status(statusCode).json({
      status: 'fail',
      // error: err,
      message: err.message
    });
  } 
};