import { Minus, Plus } from "lucide-react";

import { useContext, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { stockContext } from "../../../pages/user/CartPage";

const CartItem = ({ product, onRemove, onUpdateQuantity }) => {
  const { handleStockChange } = useContext(stockContext);
  const currentVariant = useMemo(
    () =>
      product.product.variants.filter(
        (variant) => variant.sku === product.variant
      ),
    [product]
  );

  useEffect(
    () => handleStockChange(currentVariant.filter((item) => item.stock === 0)),
    [currentVariant]
  );
  console.log(currentVariant.map((item) => item.stock)[0]);
  console.log(product.quantity);
  return (
    <div className="flex flex-col sm:flex-row items-center border rounded-lg p-4 mb-4">
      <img
        src={`${import.meta.env.VITE_API_BASE_URL}/products/${
          product.product.variants.filter(
            (variant) => variant.sku === product.variant
          )[0].images[0]
        }`}
        alt={product.product.name}
        className="w-20 h-20 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4"
      />
      <div className="flex-grow">
        <h3 className="font-semibold text-lg mb-1">{product.product.name}</h3>
        {currentVariant.map((item) => (
          <p className="text-sm text-gray-600 mb-2">
            ({item.ram} RAM, {item.storage} Storage, {item.color})
          </p>
        ))}

        {currentVariant.map((item) => (
          <p
            className={`${
              item.stock > 10 ? "text-green-600" : "text-red-600"
            } text-sm mb-2`}
          >
            {item.stock} left!!
          </p>
        ))}

        <p className="text-green-600 text-sm mb-2"></p>
        <div className="flex items-center">
          <span className="mr-2">Quantity:</span>
          <button
            onClick={() =>
              onUpdateQuantity(product.variant, product.quantity - 1)
            }
            className="border rounded-l px-2 py-1"
            disabled={product.quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="border-t border-b w-12 text-center">
            {product.quantity}
          </span>
          <button
            onClick={() =>
              currentVariant.map((item) => item.stock)[0] > product.quantity
                ? onUpdateQuantity(product.variant, product.quantity + 1)
                : toast.warn("Limit exceeded - No stock left", {
                    position: "top-center",
                  })
            }
            className="border rounded-r px-2 py-1"
            disabled={product.quantity >= 5}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end mt-4 sm:mt-0">
        <span className="font-semibold text-lg mb-2">
          ₹{product.totalPrice.toFixed(2)}
        </span>
        <button
          onClick={() => onRemove(product.variant)}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
