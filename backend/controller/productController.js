const { WebsiteDetails } = require("../model/mainProductModel");
const { DescriptiveDetails } = require("../model/descriptiveProductModel");
const { ProductImage } = require("../model/imageProductModel");
const { Users } = require("../model/userModel");
const { Views } = require("../model/productViewModel");
const { Token } = require("../model/tokenModel");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { Reviews } = require("../model/reviewModel");
const { sequelize } = require("../database/db");
// for verifying posted website url
const verifyUrl = require("../middleware/verifyUrl");
const addWesbite = async (req, res) => {
  function UUID() {
    const uuid = crypto.randomUUID();
    const alphanumericPart = uuid.replace(/-/g, "");
    return alphanumericPart.slice(0, 20);
  }
  const web_id = UUID();

  const {
    category_id,
    title,
    subcategory_id,
    price,
    negotiable,
    undisclosed,
    description,
    technical_description,
    assets,
    website_url,
    video_url,
    co_founder,
    funds,
    seller_email,
  } = req.body;

  if (price <= 0 || price >= 20000) return res.status(400).json({ message: "Invalid price" });
  if (title.length < 1 || title.length > 50) return res.status(400).json({ message: "Invalid field data" });
  if (description.length < 100 || description.length > 300) return res.status(400).json({ message: "Invalid field data" });
  if (technical_description.length < 100 || technical_description.length > 300) return res.status(400).json({ message: "Invalid field data" });
  if (!/^https:\/\/(www\.)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(:[0-9]{1,5})?(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/.test(website_url)) 
    return res.status(400).json({ message: "Invalid website URL" });
  if (!Array.isArray(assets) || assets.length < 3) return res.status(400).json({ message: "Add more assets" })

  try {
    const userExist = await Users.findOne({ where: { email: seller_email } });
    if (!userExist) return res.status(404).json({ message: "User not found" });
    const listing_exist = await WebsiteDetails.findOne({ where: { web_id } });
    if (listing_exist)
      return res.status(401).json({ message: "Listing already exists" });

    let verified = false;
    try {
      verified = await verifyUrl(website_url);
      if (!verified) return res.json({ message: "Website verification failed" });
      verified = true;
    } catch (error) {
      return res.status(400).json({ message: "Website verification failed" });
    }

    await WebsiteDetails.create({
      web_id,
      negotiable,
      undisclosed,
      price,
      co_founder,
      funds,
      category_id,
      subcategory_id,
      seller_email,
      verified,
    });
    await DescriptiveDetails.create({
      web_id,
      title,
      description,
      technical_description,
      assets,
      website_url,
      video_url: video_url || null,
    });

    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(async (file) => {
        await ProductImage.create({
          web_id,
          image_url: file.path,
          public_id: file.filename,
        });
      });

      await Promise.all(uploadedImages);
    }
    return res.status(201).json({ message: "Listing successfully added" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error", SERR: err.message });
  }
};

const getWebsiteForUpdate = async (req, res) => {
  const { seller_email } = req.params;
  try {
    const website_data = await WebsiteDetails.findAll({
      where: { seller_email },
      attributes: [
        "web_id",
        "undisclosed",
        "price",
        "funds",
        "co_founder",
        "negotiable",
      ],
      include: [
        {
          model: DescriptiveDetails,
          attributes: ["technical_description", "title", "video_url"],
          required: false,
        },
        {
          model: ProductImage,
          attributes: ["image_url"],
          required: false,
        },
      ],
    });

    if (!website_data.length)
      return res.status(404).json({ message: "No website listings found" });

    const structuredData = website_data.map((website) => ({
      web_id: website.web_id,
      title: website.DescriptiveDetail?.title || "",
      technical_description:
        website.DescriptiveDetail?.technical_description || "",
      image_url:
        website.ProductImages.length > 0 ? website.ProductImages[0] : "",
      video_url: website.DescriptiveDetail?.video_url || "",
      price: website.price,
      funds: website.funds,
      undisclosed: website.undisclosed,
      co_founder: website.co_founder,
      negotiable: website.negotiable,
    }));

    return res.status(200).json(structuredData);
  } catch (err) {
    return res.status(500).json({ message: "Server error!" });
  }
};

const updateWebsite = async (req, res) => {
  try {
    const {
      seller_email,
      web_id,
      technical_description,
      funds,
      co_founder,
      negotiable,
      undisclosed,
      title,
      video_url,
    } = req.body;

    if (title.length < 1 || title.length > 50) return res.status(400).json({ message: "Invalid field data" });
    if (technical_description.length < 1 || technical_description.length > 300) return res.status(400).json({ message: "Invalid field data" });
    if (!seller_email || !web_id) return res.status(404).json({message : "Missing required fields!"});

    await WebsiteDetails.update(
      { co_founder, negotiable, undisclosed, funds },
      { where: { seller_email, web_id } }
    );
    await DescriptiveDetails.update(
      { technical_description, title, video_url },
      { where: { web_id } }
    );
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteWebsite = async (req, res) => {
  const { seller_email, web_id } = req.body;
  if (!seller_email || !web_id) {
    return res.status(400).json({ message: "Missing required field" });
  }
  try {
    const userExist = await Users.findOne({ where: { email: seller_email } });
    if (!userExist) return res.status(404).json({ message: "User not found!" });
    const deleted = await WebsiteDetails.destroy({
      where: { seller_email, web_id },
    });
    if (!deleted) return res.status(404).json({ message: "Listing not found!" });
    return res.status(204).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getWebsiteForHome = async (req, res) => {
  try {
    const {
      categoryId,
      subcategoryId,
      co_founder,
      createdAt,
      funds,
      min_price,
      max_price,
      negotiable,
      undisclosed,
      verified,
      video_url,
      price,
      domain,
      design_files,
      location,
      searchQuery,
      most_viewed,
    } = req.body;

    let whereClause = {};

    if (location !== "/" && categoryId === -1)
      return res.status(404).json({ message: [] });
    if (negotiable) whereClause.negotiable = true;
    if (categoryId >= 0) whereClause.category_id = categoryId;
    if (subcategoryId >= 0) whereClause.subcategory_id = subcategoryId;
    if (undisclosed) whereClause.undisclosed = true;
    if (co_founder) whereClause.co_founder = true;
    if (funds) whereClause.funds = true;
    if (verified) whereClause.verified = true;
    if (min_price) {
      !undisclosed && (whereClause.undisclosed = false);
      whereClause.price = { [Op.gte]: min_price };
    }
    if (max_price) {
      !undisclosed && (whereClause.undisclosed = false);
      whereClause.price = { ...whereClause.price, [Op.lte]: max_price };
    }

    let descriptiveWhereClause = {};
    if (searchQuery) {
      const formattedSearch = `%${searchQuery.split(" ").join("%")}%`;
      descriptiveWhereClause = {
        [Op.or]: [{ title: { [Op.iLike]: formattedSearch } }],
      };
    }

    let orderBy = [["createdAt", "DESC"]];
    if (createdAt === "recent") orderBy = [["createdAt", "DESC"]];
    if (createdAt === "oldest") orderBy = [["createdAt", "ASC"]];
    if (most_viewed) orderBy = [[sequelize.literal("views"), "DESC"]];

    const website_data = await WebsiteDetails.findAll({
      where: whereClause,
      attributes: [
        "web_id",
        "category_id",
        "subcategory_id",
        "negotiable",
        "price",
        "undisclosed",
        "createdAt",
        "verified",
        "seller_email",
      ],
      include: [
        {
          model: DescriptiveDetails,
          required: true,
          attributes: ["title", "description", "website_url", "assets"],
          where: {
            ...(video_url && { video_url: { [Op.ne]: null } }),
            ...(domain && { assets: { [Op.contains]: ["Domain"] } }),
            ...(design_files && {
              assets: { [Op.contains]: ["Design Files"] },
            }),
            ...descriptiveWhereClause,
          },
        },
        {
          model: ProductImage,
          attributes: ["image_url"],
          required: false,
        },
        {
          model: Users,
          attributes: ["email", "username"],
          required: true,
        },
        {
          model: Reviews,
          attributes: ["rating"],
        },
        {
          model: Views,
          attributes: ["views"],
          required: false,
          as: "View",
        },
      ],
      order: orderBy,
    });

    if (website_data.length === 0) {
      return res.status(404).json({ message: [] });
    }

    let response = website_data.map((site) => ({
      web_id: site.web_id,
      category_id: site.category_id,
      subcategory_id: site.subcategory_id,
      negotiable: site.negotiable,
      price: site.price,
      undisclosed: site.undisclosed,
      createdAt: site.createdAt,
      verified: site.verified,
      username: site.User?.username || "",
      image_url: site.ProductImages[0].image_url,
      title: site.DescriptiveDetail?.title || "",
      description: site.DescriptiveDetail?.description?.slice(0, 70) || "",
      assets: site.DescriptiveDetail?.assets || [],
      website_url: site.DescriptiveDetail?.website_url || "",
      rating: site.Reviews
        ? site.Reviews.map((r) => r.rating).reduce((acc, val) => acc + val, 0) /
          site.Reviews.length
        : 0,
      views: site.View?.views || 0,
    }));

    if (price === "l_h") {
      response.sort((a, b) => a.price - b.price);
    } else if (price === "h_l") {
      response.sort((a, b) => b.price - a.price);
    }

    return res.status(200).json({ message: response });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const fetchProductPage = async (req, res) => {
  const { web_id } = req.query;

  try {
    const productData = await WebsiteDetails.findOne({
      where: { web_id },
      attributes: [
        "price",
        "category_id",
        "subcategory_id",
        "negotiable",
        "co_founder",
        "seller_email",
        "funds",
        "undisclosed",
        "verified",
      ],
      include: [
        {
          model: DescriptiveDetails,
          attributes: [
            "assets",
            "technical_description",
            "description",
            "website_url",
            "title",
            "video_url",
          ],
        },
        {
          model: Users,
          attributes: ["username", "profileImage", "createdAt", "email"],
        },
        {
          model: ProductImage,
          attributes: ["image_url"],
        },
      ],
    });

    if (!productData)
      return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({ message: productData });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Failed to fetch !" });
  }
};

module.exports = {
  addWesbite,
  getWebsiteForUpdate,
  updateWebsite,
  deleteWebsite,
  getWebsiteForHome,
  fetchProductPage,
};
