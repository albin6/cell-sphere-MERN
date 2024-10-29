import React, { useState, useEffect } from "react";
import { PlusCircle, X, Upload, Crop, ShoppingBag } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import "react-image-crop/dist/ReactCrop.css";
import CropperModal from "../imageCropper/CropperModal";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
  Label,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/ui-components";
import {
  useProductsData,
  useProductsDataMutation,
} from "../../hooks/CustomHooks";
import {
  addNewProduct,
  fetchProductsData,
} from "../../utils/products/adminProductListing";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductForm() {
  const navigate = useNavigate();
  const { data, isError, isLoading } = useProductsData(fetchProductsData);
  const { mutate: addProduct } = useProductsDataMutation(addNewProduct);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      name: "",
      brand: "",
      description: "",
      category: "",
      price: "",
      discount: "",
      variants: [
        {
          color: "",
          ram: "",
          storage: "",
          price: 0,
          stock: 0,
          images: [],
          sku: "",
        },
      ],
      specifications: {
        processor: "",
        battery: "",
        camera: { front: "", rear: "" },
        display: { size: "", resolution: "", type: "" },
        os: "",
      },
      tags: [],
      releaseDate: "",
      isFeatured: false,
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  useEffect(() => {
    if (data) {
      setCategories(data.categories || []);
      setBrands(data.brands || []);
    }
  }, [data]);

  const handleImageUpload = (event, variantIndex) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updatedVariants = [...variantFields];
    updatedVariants[variantIndex].images = [
      ...updatedVariants[variantIndex].images,
      ...newImages,
    ];

    if (updatedVariants[variantIndex].images.length >= 3) {
      clearErrors(`variants.${variantIndex}.images`);
    } else {
      setError(`variants.${variantIndex}.images`, {
        type: "manual",
        message: "At least 3 images are required",
      });
    }

    reset({
      ...control._formValues,
      variants: updatedVariants,
    });
  };

  const removeImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...variantFields];
    updatedVariants[variantIndex].images.splice(imageIndex, 1);

    reset({
      ...control._formValues,
      variants: updatedVariants,
    });
  };

  const startCropping = (variantIndex, imageIndex) => {
    setCurrentVariantIndex(variantIndex);
    setCurrentImageIndex(imageIndex);
    setCurrentImage(variantFields[variantIndex].images[imageIndex].preview);
    setCropModalOpen(true);
  };

  const updateAvatar = (croppedImageBase64, croppedImageUrl) => {
    const updatedVariants = [...variantFields];
    updatedVariants[currentVariantIndex].images[currentImageIndex] = {
      file: dataURLtoFile(croppedImageBase64, "cropped_image.jpg"),
      preview: croppedImageUrl,
    };

    reset({
      ...control._formValues,
      variants: updatedVariants,
    });

    setCropModalOpen(false);
    setCurrentImage(null);
    setCurrentVariantIndex(null);
    setCurrentImageIndex(null);
  };

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const onSubmit = (data) => {
    const isValid = data.variants.every(
      (variant) => variant.images.length >= 3
    );
    if (!isValid) {
      data.variants.forEach((variant, index) => {
        if (variant.images.length < 3) {
          setError(`variants.${index}.images`, {
            type: "manual",
            message: "At least 3 images are required",
          });
        }
      });
      return;
    }
    console.log(data);
    addProduct(data, {
      onSuccess: () =>
        toast.success("Product Added Successfully", { position: "top-center" }),
    });
    navigate("/admin/products");
  };

  if (isLoading) {
    return <h3>Loading....</h3>;
  }

  if (isError) {
    return <h3>Error loading product data. Please try again later.</h3>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2" />
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="w-full">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  {...register("name", {
                    required: "Product name is required",
                    minLength: {
                      value: 3,
                      message: "Minimum length is 3 characters",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Controller
                  name="brand"
                  control={control}
                  rules={{ required: "Brand is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand._id} value={brand.name}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.brand && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.brand.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category.title}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  {...register("discount", {
                    required: "Discount is required",
                    min: {
                      value: 0,
                      message: "Discount must be between 0 and 100",
                    },
                    max: {
                      value: 100,
                      message: "Discount must be between 0 and 100",
                    },
                  })}
                />
                {errors.discount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.discount.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Minimum length is 10 characters",
                  },
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label>Variants</Label>
              {variantFields.map((field, variantIndex) => (
                <Card key={field.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`variants.${variantIndex}.color`}>
                          Color
                        </Label>
                        <Input
                          {...register(`variants.${variantIndex}.color`, {
                            required: "Color is required",
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variants.${variantIndex}.ram`}>
                          RAM
                        </Label>
                        <Input
                          {...register(`variants.${variantIndex}.ram`, {
                            required: "RAM is required",
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variants.${variantIndex}.storage`}>
                          Storage
                        </Label>
                        <Input
                          {...register(`variants.${variantIndex}.storage`, {
                            required: "Storage is required",
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variants.${variantIndex}.price`}>
                          Price
                        </Label>
                        <Input
                          type="number"
                          {...register(`variants.${variantIndex}.price`, {
                            required: "Price is required",
                            min: {
                              value: 0,
                              message: "Price must be positive",
                            },
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variants.${variantIndex}.stock`}>
                          Stock
                        </Label>
                        <Input
                          type="number"
                          {...register(`variants.${variantIndex}.stock`, {
                            required: "Stock is required",
                            min: {
                              value: 0,
                              message: "Stock must be positive",
                            },
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variants.${variantIndex}.sku`}>
                          SKU
                        </Label>
                        <Input
                          {...register(`variants.${variantIndex}.sku`, {
                            required: "SKU is required",
                          })}
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label>Images</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.images.map((image, imageIndex) => (
                          <div key={imageIndex} className="relative">
                            <img
                              src={image.preview}
                              alt={`Variant ${variantIndex + 1} Image ${
                                imageIndex + 1
                              }`}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeImage(variantIndex, imageIndex)
                              }
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                startCropping(variantIndex, imageIndex)
                              }
                              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1"
                            >
                              <Crop className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <Input
                        type="file"
                        onChange={(e) => handleImageUpload(e, variantIndex)}
                        multiple
                        accept="image/*"
                        className="mt-2"
                      />
                      {errors.variants?.[variantIndex]?.images && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.variants[variantIndex].images.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeVariant(variantIndex)}
                      className="mt-2 bg-red-600 text-white"
                      variant="destructive"
                    >
                      Remove Variant
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                className="bg-gray-800 hover:bg-gray-600 text-white"
                onClick={() =>
                  appendVariant({
                    color: "",
                    ram: "",
                    storage: "",
                    price: 0,
                    stock: 0,
                    images: [],
                    sku: "",
                  })
                }
              >
                Add Variant
              </Button>
            </div>

            <div>
              <Label className="font-semibold">Specifications</Label>
              <br />
              <hr />
              <br />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specifications.processor">Processor</Label>
                  <Input
                    {...register("specifications.processor", {
                      required: "Processor is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.battery">Battery</Label>
                  <Input
                    {...register("specifications.battery", {
                      required: "Battery is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.camera.front">
                    Front Camera
                  </Label>
                  <Input
                    {...register("specifications.camera.front", {
                      required: "Front camera is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.camera.rear">
                    Rear Camera
                  </Label>
                  <Input
                    {...register("specifications.camera.rear", {
                      required: "Rear camera is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.display.size">
                    Display Size
                  </Label>
                  <Input
                    {...register("specifications.display.size", {
                      required: "Display size is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.display.resolution">
                    Display Resolution
                  </Label>
                  <Input
                    {...register("specifications.display.resolution", {
                      required: "Display resolution is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.display.type">
                    Display Type
                  </Label>
                  <Input
                    {...register("specifications.display.type", {
                      required: "Display type is required",
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="specifications.os">Operating System</Label>
                  <Input
                    {...register("specifications.os", {
                      required: "Operating system is required",
                    })}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input {...register("tags")} />
            </div>

            <div>
              <Label htmlFor="releaseDate">Release Date</Label>
              <Input
                type="date"
                {...register("releaseDate", {
                  required: "Release date is required",
                })}
              />
              {errors.releaseDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.releaseDate.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                {...register("isFeatured")}
                className="mr-2"
              />
              <Label htmlFor="isFeatured">Featured Product</Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-600 text-white"
            >
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>

      {cropModalOpen && (
        <CropperModal
          updateAvatar={updateAvatar}
          closeModal={() => setCropModalOpen(false)}
          imageSrc={currentImage}
        />
      )}
    </div>
  );
}
