import React from "react";
import ImageCropper from "./ImageCropper";

export default function ProductForm({
  product,
  croppedImages,
  setCroppedImages,
  handleChange,
  handleSpecChange,
  handleVariantChange,
  handleSubmit,
}) {
  const addVariant = () => {
    const newVariant = {
      color: "",
      ram: "",
      storage: "",
      price: "",
      stock: "",
      images: [],
      sku: "",
    };
    handleVariantChange(product.variants.length, "newVariant", newVariant);
  };

  const removeVariant = (index) => {
    const newVariants = product.variants.filter((_, i) => i !== index);
    handleChange({ target: { name: "variants", value: newVariants } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-700"
          >
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={product.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Variants</h3>
        {product.variants.map((variant, index) => (
          <div key={index} className="mt-4 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Color"
                value={variant.color}
                onChange={(e) =>
                  handleVariantChange(index, "color", e.target.value)
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="RAM"
                value={variant.ram}
                onChange={(e) =>
                  handleVariantChange(index, "ram", e.target.value)
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Storage"
                value={variant.storage}
                onChange={(e) =>
                  handleVariantChange(index, "storage", e.target.value)
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={(e) =>
                  handleVariantChange(index, "price", e.target.value)
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Stock"
                value={variant.stock}
                onChange={(e) =>
                  handleVariantChange(index, "stock", e.target.value)
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="SKU"
                value={variant.sku}
                onChange={(e) =>
                  handleVariantChange(index, "sku", e.target.value)
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <ImageCropper
              onCrop={(croppedImage) => {
                const newCroppedImages = [...croppedImages];
                if (!newCroppedImages[index]) {
                  newCroppedImages[index] = [];
                }
                newCroppedImages[index].push(croppedImage);
                setCroppedImages(newCroppedImages);
              }}
            />
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Remove Variant
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addVariant}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add Variant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="processor"
            className="block text-sm font-medium text-gray-700"
          >
            Processor
          </label>
          <input
            type="text"
            id="processor"
            name="specifications.processor"
            value={product.specifications.processor}
            onChange={handleSpecChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="battery"
            className="block text-sm font-medium text-gray-700"
          >
            Battery
          </label>
          <input
            type="text"
            id="battery"
            name="specifications.battery"
            value={product.specifications.battery}
            onChange={handleSpecChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="frontCamera"
            className="block text-sm font-medium text-gray-700"
          >
            Front Camera
          </label>
          <input
            type="text"
            id="frontCamera"
            name="specifications.camera.front"
            value={product.specifications.camera.front}
            onChange={handleSpecChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="rearCamera"
            className="block text-sm font-medium text-gray-700"
          >
            Rear Camera
          </label>
          <input
            type="text"
            id="rearCamera"
            name="specifications.camera.rear"
            value={product.specifications.camera.rear}
            onChange={handleSpecChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="displaySize"
            className="block text-sm font-medium text-gray-700"
          >
            Display Size
          </label>
          <input
            type="text"
            id="displaySize"
            name="specifications.display.size"
            value={product.specifications.display.size}
            onChange={handleSpecChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="displayResolution"
            className="block text-sm font-medium text-gray-700"
          >
            Display Resolution
          </label>
          <input
            type="text"
            id="displayResolution"
            name="specifications.display.resolution"
            value={product.specifications.display.resolution}
            onChange={handleSpecChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="displayType"
            className="block text-sm font-medium text-gray-700"
          >
            Display Type
          </label>
          <input
            type="text"
            id="displayType"
            name="specifications.display.type"
            value={product.specifications.display.type}
            onChange={handleSpecChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="os"
            className="block text-sm font-medium text-gray-700"
          >
            Operating System
          </label>
          <input
            type="text"
            id="os"
            name="specifications.os"
            value={product.specifications.os}
            onChange={handleSpecChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700"
        >
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={product.tags.join(", ")}
          onChange={(e) =>
            handleChange({
              target: {
                name: "tags",
                value: e.target.value.split(",").map((tag) => tag.trim()),
              },
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="releaseDate"
          className="block text-sm font-medium text-gray-700"
        >
          Release Date
        </label>
        <input
          type="date"
          id="releaseDate"
          name="releaseDate"
          value={product.releaseDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isFeatured"
          name="isFeatured"
          checked={product.isFeatured}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label
          htmlFor="isFeatured"
          className="ml-2 block text-sm text-gray-900"
        >
          Featured Product
        </label>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {product._id ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
}
