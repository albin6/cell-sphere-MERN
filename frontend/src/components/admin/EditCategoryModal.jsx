import React, { useState } from "react";
import { Switch } from "@headlessui/react";

function EditCategoryModal({ category, onUpdate, onClose }) {
  const [title, setTitle] = useState(category?.title);
  const [description, setDescription] = useState(category?.description);
  const [status, setStatus] = useState(category?.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...category, title, description, status };
    console.log(data);
    onUpdate({ ...category, title, description, status });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span>Status</span>
            <Switch
              checked={status}
              onChange={() => {
                console.log("previous", status);
                setStatus((prev) => !prev);
                console.log("after", status);
              }}
              className={`${
                status ? "bg-gray-800" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">
                {status ? "Unlist category" : "List category"}
              </span>
              <span
                className={`${
                  status ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCategoryModal;
