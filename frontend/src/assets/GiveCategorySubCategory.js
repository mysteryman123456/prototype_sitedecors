import categories from "../assets/Categories";

const giveCategoryAndSubcategory = (categoryId, subcategoryId = -1) => {
  if (categoryId <= 0 || categoryId > categories.length) {
    return { category: null, subcategory: null };
  }

  const categoryObj = categories[categoryId - 1]; 
  const categoryName = categoryObj.name;

  if (subcategoryId === -1 || !categoryObj.subcategories || !Array.isArray(categoryObj.subcategories) || subcategoryId <= 0 || subcategoryId > categoryObj.subcategories.length) {
    return { category: categoryName, subcategory: null };
  }

  const subcategoryName = categoryObj.subcategories[subcategoryId - 1];

  return { category: categoryName, subcategory: subcategoryName };
};

export default giveCategoryAndSubcategory;
