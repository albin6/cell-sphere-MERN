import AsyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";
import Product from "../models/productModel.js";

// desc => for listing products
// GET /api/admin/products
export const get_products_details = AsyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  const { sort, filter } = req.query;
  console.log(req.query);
  console.log(filter);
  const category_id =
    filter == "All"
      ? await Category.find({})
      : await Category.findOne({ _id: filter });

  const total_product_count =
    filter == "All"
      ? await Product.countDocuments()
      : await Product.countDocuments({
          category: category_id?._id,
        });

  const totalPages = Math.ceil(total_product_count / limit);

  const sort_option = {};
  switch (sort) {
    case "name":
      sort_option.name = 1;
      break;
    case "price":
      sort_option.price = 1;
      break;
    default:
      break;
  }

  // Fetch all products with populated category and brand details
  const products =
    filter == "All"
      ? await Product.find()
          .populate("category")
          .populate("brand")
          .sort(sort_option)
          .skip(skip)
          .limit(limit)
      : await Product.find({ category: category_id._id })
          .populate("category")
          .populate("brand")
          .sort(sort_option)
          .skip(skip)
          .limit(limit);

  // Fetch all categories
  const categories = await Category.find({ status: true });
  if (!categories) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch categories" });
  }

  // Fetch all brands
  const brands = await Brand.find({ status: true });
  if (!brands) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch brands" });
  }

  // If everything is successful, return the data
  res
    .status(200)
    .json({ success: true, page, totalPages, products, brands, categories });
});

// desc => data for add product form in admin
// GET /api/admin/get-product-data-for-addproduct
export const get_product_data_for_product_crud = AsyncHandler(
  async (req, res) => {
    const categories = await Category.find({ status: true });
    if (!categories) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch categories" });
    }

    // Fetch all brands
    const brands = await Brand.find({ status: true });
    if (!brands) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch brands" });
    }
    res.status(200).json({ success: true, brands, categories });
  }
);

// desc => for users home page
// GET /api/users/products
export const get_all_products_details = AsyncHandler(async (req, res) => {
  try {
    // Fetch all products with populated category and brand details
    const products_data = await Product.find({ is_active: true })
      .populate("offer")
      .populate("category")
      .populate("brand");

    const products = products_data.filter((product) => product.category.status);

    // Fetch all categories
    const categories = await Category.find({ status: true });
    if (!categories) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch categories" });
    }

    // Fetch all brands
    const brands = await Brand.find({ status: true });
    if (!brands) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch brands" });
    }

    // Check if products exist
    if (!products.length) {
      return res.status(200).json({
        success: true,
        message: "No products found",
        products,
        brands,
        categories,
      });
    }

    // If everything is successful, return the data
    res.status(200).json({ success: true, products, brands, categories });
  } catch (error) {
    // Catch any other errors and return a 500 status code
    console.error("Error fetching product details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product details",
      error: error.message,
    });
  }
});

// GET /api/users/get_product/:id
// GET /api/admin/products/:id
export const get_product = AsyncHandler(async (req, res) => {
  console.log("in get product admin");
  const productId = req.params.productId;

  const product = await Product.findOne({ _id: productId })
    .populate("offer")
    .populate("category")
    .populate("brand");

  // Fetch all categories
  const categories = await Category.find({ status: true });
  if (!categories) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch categories" });
  }

  // Fetch all brands
  const brands = await Brand.find({ status: true });
  if (!brands) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch brands" });
  }

  if (product) {
    return res.status(200).json({
      success: true,
      message: "No products found",
      product,
      brands,
      categories,
    });
  }
});

// POST /api/admin/products
export const add_new_product = AsyncHandler(async (req, res) => {
  const {
    name,
    brand,
    description,
    category,
    price,
    discount,
    specifications,
    tags,
    releaseDate,
    isFeatured,
    variants,
  } = req.body;

  // Create an object to map images to their respective variants
  const imagesByVariant = {};

  // Handle file uploads
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      const variantId = file.fieldname.split("[")[1].split("]")[0];
      if (!imagesByVariant[variantId]) {
        imagesByVariant[variantId] = [];
      }
      imagesByVariant[variantId].push(file.filename);
    });
  }

  try {
    // Fetch brand and category information from the database
    const brand_data = await Brand.findOne({ name: brand });
    if (!brand_data) {
      return res
        .status(400)
        .json({ success: false, message: "Brand not found" });
    }

    const category_data = await Category.findOne({ title: category });
    if (!category_data) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }

    // Create a new product instance, mapping images to their respective variants
    const newProduct = new Product({
      name,
      brand: brand_data._id,
      description,
      category: category_data._id,
      price: Number(price),
      discount: Number(discount),
      specifications,
      tags: tags.split(",").map((tag) => tag.trim()),
      releaseDate,
      isFeatured,
      variants: variants.map((variant, index) => ({
        color: variant.color,
        ram: variant.ram,
        storage: variant.storage,
        price: Number(variant.price),
        stock: Number(variant.stock),
        sku: variant.sku,
        images: imagesByVariant[index] || [], // Attach images to their respective variant
      })),
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();

    // Send a success response
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
});

// PUT /api/admin/products/:producId
export const update_product_details = AsyncHandler(async (req, res) => {
  console.log("in update product details controller");
  // console.log(req.body);
  const productId = req.params.productId;
  // console.log(productId);

  const {
    name,
    brand,
    description,
    category,
    price,
    discount,
    specifications,
    tags,
    releaseDate,
    isFeatured,
    variants,
  } = req.body.data;

  // console.log("Brand =>", brand, "category =>", category);

  // Create an object to map images to their respective variants

  const imagesByVariant = {};

  // Handle file uploads
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      // Remove "data" from the beginning of each fieldname

      const variantId = file.fieldname.split("[")[2].split("]")[0];
      if (!imagesByVariant[variantId]) {
        imagesByVariant[variantId] = [];
      }
      imagesByVariant[variantId].push(file.path.split("/").pop());
    });
  }

  // console.log("req.files==>", req.files);

  // console.log(imagesByVariant);

  // console.log("onee");

  try {
    const product_to_update = await Product.findById(productId);
    console.log("two");
    if (!product_to_update) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }

    // Fetch brand and category information from the database
    const brand_data = await Brand.findOne({ name: brand });
    console.log("brand data =>", brand_data);
    if (!brand_data) {
      return res
        .status(400)
        .json({ success: false, message: "Brand not found" });
    }

    const category_data = await Category.findOne({ title: category });
    if (!category_data) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }

    let is_updated = false;

    if (product_to_update.name !== name) {
      product_to_update.name = name;
      is_updated = true;
    }

    if (product_to_update.brand !== brand_data._id) {
      product_to_update.brand = brand_data._id;
      is_updated = brand_data._id;
    }

    if (product_to_update.description !== description) {
      product_to_update.description = description;
      is_updated = true;
    }

    if (product_to_update.category !== category_data._id) {
      product_to_update.category = category_data._id;
      is_updated = true;
    }

    if (product_to_update.price !== Number(price)) {
      product_to_update.price = Number(price);
      is_updated = true;
    }

    if (product_to_update.discount !== Number(discount)) {
      product_to_update.discount = Number(discount);
      is_updated = true;
    }

    product_to_update.specifications = specifications;
    product_to_update.tags = tags.split(",").map((tag) => tag.trim());
    product_to_update.releaseDate = releaseDate;
    if (product_to_update.isFeatured !== isFeatured) {
      product_to_update.isFeatured = isFeatured;
    }

    const newImages = req.files.map((file) => file.filename); // or file.originalname if you want the original name

    // console.log("new images from multer =>", newImages);

    // If variants is an array, loop through and merge images
    product_to_update.variants = product_to_update.variants = variants.map(
      (variant, index) => {
        // Extract existing images from the variant's images
        let existingImages = (variant.images || []).map((img) => {
          // Extract the image name from the 'preview' URL
          const urlParts = img.preview.split("/"); // Split the URL by "/"
          return urlParts[urlParts.length - 1]; // Get the last part of the URL (image name)
        });

        existingImages = existingImages.filter(
          (img) => img.startsWith("v") || img.startsWith("data")
        );
        console.log("existing images =>", existingImages);

        // Combine existing images with new images for the current variant
        const newImagesForVariant = imagesByVariant[index] || []; // Get new images for the specific variant
        console.log("new image by variant", index, "==>", newImagesForVariant);

        return {
          color: variant.color,
          ram: variant.ram,
          storage: variant.storage,
          price: Number(variant.price),
          stock: Number(variant.stock),
          sku: variant.sku,
          images: [...existingImages, ...newImagesForVariant], // Combine existing and new image names
        };
      }
    );

    // Save the new product to the database
    await product_to_update.save();
    console.log("updated product ==>", product_to_update);

    // If everything is successful, return the data
    res.status(200).json({ success: true, product_to_update, brand, category });
  } catch (error) {
    // Catch any other errors and return a 500 status code
    console.error("Error fetching product details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product details",
      error: error.message,
    });
  }
});

// PATCH /api/admin/products/:productId
export const update_product_status = AsyncHandler(async (req, res) => {
  const productId = req.params.productId;

  try {
    const product_to_update = await Product.findById(productId);
    if (!product_to_update) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }

    product_to_update.is_active = !product_to_update.is_active;
    await product_to_update.save();

    res.status(200).json({ success: true, product_to_update });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating product status",
      error: error.message,
    });
  }
});

export const variant_details_of_product = AsyncHandler(async (req, res) => {
  console.log("in variant_details_of_product");
  const { productId, variant } = req.query;

  console.log(req.query);

  if (!productId || !variant) {
    return res.status(400).json({
      success: false,
      message: "Product ID and variant are required.",
    });
  }

  // Find the product by ID
  const product = await Product.findById(productId)
    .populate("offer")
    .populate("brand") // Assuming you want the name of the brand to be populated
    .populate("category") // Assuming you want the name of the category to be populated
    .exec();

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found." });
  }

  // Find the specific variant inside the product
  const selectedVariant = product.variants.find((v) => v.sku === variant);

  if (!selectedVariant) {
    return res
      .status(404)
      .json({ success: false, message: "Variant not found." });
  }

  // Format the response
  const cartData = {
    items: [
      {
        product: {
          specifications: product.specifications,
          _id: product._id,
          name: product.name,
          brand: product.brand._id, // Assuming brand is populated
          is_active: product.is_active,
          description: product.description,
          category: product.category._id, // Assuming category is populated
          price: product.price,
          discount: product.discount,
          variants: [selectedVariant],
          tags: product.tags,
          releaseDate: product.releaseDate,
          isFeatured: product.isFeatured,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          reviews: product.reviews,
        },
        variant: selectedVariant.sku,
        quantity: 1, // Adjust the quantity as needed or get it from the request body
        price: selectedVariant.price,
        discount: product.discount,
        totalPrice:
          selectedVariant.price -
          selectedVariant.price * (product.discount / 100),
        _id: "itemIdPlaceholder", // Replace with actual item ID if available
      },
    ],
    totalAmount:
      selectedVariant.price -
      selectedVariant.price *
        ((product.discount +
          (product.offer?.offer_value ? product.offer?.offer_value : 0)) /
          100),
  };

  // Return the response
  res.status(200).json({
    success: true,
    cart_data: cartData,
  });
});

// @desc getting product data for offers
// GET /api/admin/products/products-data
export const get_products_for_offers = AsyncHandler(async (req, res) => {
  console.log("in get_products_for_offers");
  const { searchTerm } = req.query;

  // Fetch all products from the database
  const products = await Product.find(
    { name: { $regex: new RegExp(searchTerm, "i") }, is_active: true },
    { name: true }
  );
  console.log(products);

  res.status(200).json(products);
});
