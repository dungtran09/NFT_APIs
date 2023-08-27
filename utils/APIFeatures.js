class APIFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  // Filter
  filter() {
    const queryStr = JSON.stringify(this.queryObj);
    const queryObj = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`),
    );
    const excluded = ["page", "sort", "limit", "fields"];
    Object.keys(queryObj).filter((key) =>
      excluded.includes(key) ? delete queryObj[key] : {},
    );

    this.query = this.query.find(queryObj);
    return this;
  }

  // Sort
  sort() {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createAt");
    }
    return this;
  }

  // Limit fields
  limit() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-_v");
    }

    return this;
  }

  // Paginations
  pagination() {
    const page = parseInt(this.queryObj.page) || 1;
    const limit = parseInt(this.queryObj.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
