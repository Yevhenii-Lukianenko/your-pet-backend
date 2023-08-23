const { News } = require("../models/news");

const { ctrlWrapper } = require("../helpers");

const getNews = async (req, res) => {
  const { search = null } = req.query;
  const { page = 1, limit = 6 } = req.query;
  const skip = (page - 1) * limit;
  let result;
  let totalCount;

  if (search) {
    result = await News.find(
      { title: { $regex: search, $options: "i" } },
      "-__v",
      { skip, limit }
    );
    totalCount = await News.countDocuments({
      title: { $regex: search, $options: "i" },
    });
  } else {
    result = await News.find({}, "-__v", { skip, limit });
    totalCount = await News.countDocuments({});
  }

  const totalPages = Math.ceil(totalCount / limit);

  res.json({
    totalPages,
    news: result,
  });
};

module.exports = {
  getNews: ctrlWrapper(getNews),
};
