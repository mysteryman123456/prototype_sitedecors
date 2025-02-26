// const { Category } = require("../model/categoryModel");
// const { SubCategory } = require("../model/subCategoryModel");
// const {sequelize} = require("../database/db")

// const slugify = (name) => name.toLowerCase().replace(/ /g, "-");

// const Categories = [
//     {
//       name: "Ecommerce",
//       id : 1,
//       subcategories: [
//         "Clothing" , 
//         "Cosmetics" , 
//         "Electronics" , 
//         "Food" , 
//         "Footwears" , 
//         "Furnitures" , 
//         "Retail Stores", 
//         "Online Marketplace",
//         "Product Showcase"
//       ],
//     },
//     {
//       name : "Services",
//       id : 2,
//       subcategories : [
//         "Freelance Applications" , 
//         "Job Portals" , 
//         "Coaching and Consulting" , 
//         "Service Showcase",
//       ]
//     },
//     {
//       name: "Media and Content",
//       id : 3,
//       subcategories: [
//         "News Portals", 
//         "Blogs", 
//         "Video Platforms", 
//         "Social Media",
//         "Media Showcase"
//       ],
//     },
//     {
//       name: "Education",
//       id : 4,
//       subcategories: [
//         "E-learning Platforms" , 
//         "Course Portals" , 
//         "Skill Development",
//         "Academic Showcase"
//       ],
//     },
//     {
//       name: "Health",
//       id : 5,
//       subcategories: [
//         "Hospital Website" , 
//         "Health Blogs" , 
//         "Wellness & Fitness Apps" , 
//         "Medical Appointment Booking" , 
//         "Diet Tracking",
//         "Healthcare Showcase"
//       ]
//     },
//     {
//       name: "SaaS",
//       id : 6,
//       subcategories: [
//         "Messaging Apps",
//         "Billing Application" , 
//         "CRM" , 
//         "Marketing Application" , 
//         "Management Tools"],
//     },
//     {
//       name : "Others",
//       id : 7,
//       subcategories: [
//         "Ticket Management", 
//         "Gym Booking", 
//         "Hotel Booking", 
//         "Portfolio",
//         "Ride Booking", 
//         "Real Estate Platforms", 
//         "Matrimonial Platforms", 
//         "Vehicle Rentals", 
//         "Online Auctions", 
//         "Finance Management",
//         "Showcases"
//       ]
//     }
//   ];

// const seedDatabase = async () => {
//   try {
//     await sequelize.sync({ force: true }); 
//     for (const category of Categories) {
//       const createdCategory = await Category.create({
//         name: slugify(category.name),
//       });

//       for (const subcategory of category.subcategories) {
//         await SubCategory.create({
//           name: slugify(subcategory),
//           category_id: createdCategory.id,
//         });
//       }
//     }
//   } catch (error) {
//     console.log(error)
//   } finally {
//     await sequelize.close();
//   }
// };

// seedDatabase();
