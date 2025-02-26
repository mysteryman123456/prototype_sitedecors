import categories from "../assets/Categories";

const giveCategoryIdSubCategoryId = (category, subcategory = "") => {

    const categoryIndex = categories.findIndex(cat => 
      cat.name.toLowerCase().replace(/ /g, "-") === category
    );
    if (categoryIndex === -1) return { categoryId: -1, subcategoryId: -1 };

    const categoryObj = categories[categoryIndex]; 
    if (!categoryObj.subcategories || !Array.isArray(categoryObj.subcategories)) return { categoryId: categoryIndex + 1, subcategoryId: -1 };

    if (!subcategory) return { categoryId: categoryIndex + 1, subcategoryId: -1 };

    const subcategoryIndex = categoryObj.subcategories
      .map(subcat => subcat.toLowerCase().replace(/ /g, "-"))
      .indexOf(subcategory);
    if (subcategoryIndex === -1) return { categoryId: categoryIndex + 1, subcategoryId: -1 };
    return {
      categoryId: categoryIndex + 1, 
      subcategoryId: subcategoryIndex + 1
    };
};

export default giveCategoryIdSubCategoryId;
