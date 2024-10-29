import React from "react";
import { Button } from "../../ui/ui-components";
import { Pencil, Trash2 } from "lucide-react";

function AddressCard({ address, handleAddressDelete, handleAddressEdit }) {
  return (
    <div className="border rounded-lg p-4 relative">
      <h3 className="font-semibold">{address.name}</h3>
      <p>
        {address.firstName} {address.lastName}
      </p>
      <p>{address.address}</p>
      <p>{`${address.district}, ${address.state} ${address.pinCode}`}</p>
      <p>{address.phone}</p>
      <div className="absolute top-2 right-2 space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleAddressEdit(address)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleAddressDelete(address._id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default AddressCard;
