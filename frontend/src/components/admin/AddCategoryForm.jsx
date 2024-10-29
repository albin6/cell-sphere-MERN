import React, { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { useCategoryListMutation } from "../../hooks/CustomHooks";
import { submitCategoryForm } from "../../utils/category/categoryCRUD";
import { toast } from "react-toastify";

function AddCategoryForm() {
  const mutation = useCategoryListMutation(submitCategoryForm);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(
      { title, status, description },
      {
        onSuccess: () =>
          toast.success("Category Added Successfully!", {
            position: "top-center",
          }),
        onError: () =>
          toast.error("Category Already Exists!", {
            position: "top-center",
          }),
      }
    );
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 py-4 bg-gray-100 rounded">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-2">Add New Category</h2>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Category Title"
          className="flex-grow p-2 border rounded"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Category Description"
          className="flex-grow p-2 border rounded"
          required
        />
        <Switch
          checked={status}
          onChange={setStatus}
          className={`${
            status ? "bg-gray-800" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Enable category</span>
          <span
            className={`${
              status ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <button
          type="submit"
          className="text-white px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Add Category
        </button>
      </div>
    </form>
  );
}

export default AddCategoryForm;
