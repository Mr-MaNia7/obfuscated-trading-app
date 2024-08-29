module.exports = async (model, queryString) => {
  // BUILD QUERY
  // 1A) FILTERING
  const queryObj = { ...queryString };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);
  // console.log(queryString, queryObj);
  // http://localhost:5000/api/v1/tours?duration[$gte]=25&difficulty=easy
  // {difficutly: 'easy', duration: {$gte: 25}}

  // !B) ADVANCED FILTERING
  let query = model.find(queryObj);

  // 2) Sorting
  if(queryString.sort) {
    // console.log(queryString.sort);
    // http://localhost:5000/api/v1/tours?duration[$gte]=25&price[$gte]=400&sort=-price,duration
    const sort = queryString.sort.split(',').join(' ');
    query = query.sort(sort);
  } else {
    query = query.sort('-createdAt');
  }

  // 3) Field limiting
  if(queryString.fields) {
    // http://localhost:5000/api/v1/tours?price[$gte]=500&fields=name,duration,price
    const fields = queryString.fields.split(',').join(' ');
    // console.log(fields);
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // 4) Pagination
  const page = parseInt(queryString.page) || 1;
  const limit = queryString.limit !== 'all'? parseInt(queryString.limit) || 10: 'all';
  const skip = (page - 1) * limit;

  query = limit === 'all'? query: query.skip(skip).limit(limit);
  if(queryString.page) {
    const numDocs = await model.find().count();
    if(skip > numDocs) throw new Error('page_not_exist');
  }

  return query;
};