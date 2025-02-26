const { Views } = require("../model/productViewModel");

const updateViews = async (req, res) => {
  const { web_id } = req.body;
  if (!web_id) return res.status(400);

  try {
    const [viewRecord, created] = await Views.findOrCreate({ // created is boolean value returned by findOrCreate
      where: { web_id },
      defaults: { views: 1 } 
    });

    if (!created) {
      viewRecord.views += 1;
      await viewRecord.save();
    }
    return res.status(200).json({message: "Views updated"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update views", error: error.message });
  }
};

module.exports = { updateViews };
