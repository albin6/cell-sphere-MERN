import React, { useEffect, useState } from "react";
import { Button } from "../../ui/ui-components";
import { PlusCircle } from "lucide-react";
import AddEditAddressModal from "./AddEditAddressModal";
import AddressCard from "./AddressCard";
import {
  useProfileAddress,
  useProfileAddressMutation,
} from "../../../hooks/CustomHooks";
import {
  addNewAddress,
  deleteUserAddress,
  updateUserAddress,
} from "../../../utils/address/addressCRUD";
import Error from "../../Error";

const AddressBookTab = () => {
  const [addresses, setAddresses] = useState([]);

  const { data, isError, isLoading } = useProfileAddress();
  const { mutate: addAddress } = useProfileAddressMutation(addNewAddress);
  const { mutate: updateAddress } =
    useProfileAddressMutation(updateUserAddress);
  const { mutate: removeAddress } =
    useProfileAddressMutation(deleteUserAddress);

  useEffect(() => {
    console.log(data);
    setAddresses(data?.addresses);
  }, [data]);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleAddressEdit = (address) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleAddressDelete = (id) => {
    removeAddress(id);
    console.log(id);
    setAddresses(addresses.filter((address) => address.id !== id));
  };

  const handleAddressSave = (addressData) => {
    if (editingAddress) {
      console.log("data for update address =>>", addressData);
      updateAddress(addressData);
    } else {
      console.log(addressData);
      addAddress(addressData);
    }
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  if (isError) {
    return <Error error={isError} />;
  }

  return (
    <div>
      <Button
        onClick={() => setIsAddressModalOpen(true)}
        className="mb-4 flex items-center bg-gray-800 text-white"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses &&
          addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              handleAddressEdit={handleAddressEdit}
              handleAddressDelete={handleAddressDelete}
            />
          ))}
      </div>
      {isAddressModalOpen && (
        <AddEditAddressModal
          address={editingAddress}
          onClose={() => {
            setIsAddressModalOpen(false);
            setEditingAddress(null);
          }}
          onSave={handleAddressSave}
        />
      )}
    </div>
  );
};

export default AddressBookTab;
