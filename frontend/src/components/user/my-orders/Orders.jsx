import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { useAllOrders } from "../../../hooks/CustomHooks";
import { getOrdersUser } from "../../../utils/order/orderCRUD";
import NoOrdersFound from "./NoOrdersFoundUser";

export default function Component() {
  const [orders, setOrders] = useState([]);

  const { data } = useAllOrders(getOrdersUser); // order_data [arr]

  useEffect(() => {
    setOrders(data);
  }, [data]);

  if (data && data.length == 0) {
    return <NoOrdersFound />;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      {orders &&
        orders.map((order, index) => (
          <OrderCard key={order.id} order={order} />
        ))}
    </div>
  );
}
