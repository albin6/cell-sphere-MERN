import { Link } from "react-router-dom";

import React, { createContext, useContext, useState, useId } from "react";
import { ChevronDown, Star } from "lucide-react";

import { X } from "lucide-react";

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children }) => {
  return <div className="p-6">{children}</div>;
};

export const DialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

export const DialogTitle = ({ children }) => {
  return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>;
};

export const DialogTrigger = ({ children, ...props }) => {
  return (
    <Dialog.Trigger asChild {...props}>
      {children}
    </Dialog.Trigger>
  );
};

export function DialogDescription() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="Pedro Duarte"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="username"
              className="text-right text-sm font-medium"
            >
              Username
            </label>
            <input
              id="username"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="@peduarte"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DialogFooter() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted name:", name);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export const Alert = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyles = "p-4 rounded-lg border";
  const variantStyles = {
    default: "bg-gray-100 border-gray-200 text-gray-800",
    destructive: "bg-red-100 border-red-200 text-red-800",
    success: "bg-green-100 border-green-200 text-green-800",
  };

  return (
    <div
      role="alert"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = "", ...props }) => {
  return (
    <div className={`text-sm mt-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

const SelectContext = createContext(null);

const RadioGroupContext = createContext(null);

export function RadioGroup({
  defaultValue,
  onValueChange,
  className,
  children,
}) {
  const [value, setValue] = React.useState(defaultValue);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <RadioGroupContext.Provider
      value={{ value, onValueChange: handleValueChange }}
    >
      <div className={className} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({ value, id, className, children }) {
  const context = useContext(RadioGroupContext);
  const generatedId = useId();
  const radioId = id || generatedId;

  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup");
  }

  const isChecked = context.value === value;

  const handleChange = () => {
    context.onValueChange(value);
  };

  return (
    <div className={className}>
      <input
        type="radio"
        id={radioId}
        className="sr-only peer"
        checked={isChecked}
        onChange={handleChange}
        value={value}
      />
      <label
        htmlFor={radioId}
        className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          isChecked
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        } cursor-pointer`}
      >
        {children}
      </label>
    </div>
  );
}

export function Select({ children, onValueChange, defaultValue = "" }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const onChange = (newValue) => {
    setValue(newValue);
    onValueChange(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ open, setOpen, value, onChange }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children }) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within a Select");

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className="flex items-center justify-between w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      {children}
      <ChevronDown
        className="w-5 h-5 ml-2 -mr-1 text-gray-400"
        aria-hidden="true"
      />
    </button>
  );
}

export function SelectContent({ children }) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used within a Select");

  if (!context.open) return null;

  return (
    <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
      <ul className="py-1 overflow-auto text-base rounded-md max-h-60 focus:outline-none sm:text-sm">
        {children}
      </ul>
    </div>
  );
}

export function SelectItem({ children, value }) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within a Select");

  return (
    <li
      className={`cursor-default select-none relative py-2 pl-3 pr-9 ${
        context.value === value ? "text-white bg-primary" : "text-gray-900"
      }`}
      onClick={() => context.onChange(value)}
    >
      {children}
    </li>
  );
}

export function SelectValue({ placeholder }) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within a Select");

  return <span>{context.value || placeholder}</span>;
}

export default function Component() {
  const handleValueChange = (value) => {
    console.log("Selected value:", value);
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-8">
      <Select onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// export const SelectTrigger = ({ children }) => <div>{children}</div>;
// export const SelectValue = ({ children }) => <span>{children}</span>;
// export const SelectContent = ({ children }) => <div>{children}</div>;
// export const SelectItem = ({ value, children }) => (
//   <option value={value}>{children}</option>
// );

export const Textarea = React.forwardRef((props, ref) => {
  return (
    <textarea
      ref={ref}
      className="w-full px-3 py-2 text-gray-700 border border-gray-400 rounded-lg focus:outline-none"
      style={{ padding: "10px", border: "1px solid gray", borderRadius: "8px" }}
      {...props}
    />
  );
});

// export const Select = ({ children, ...props }) => (
//   <select
//     className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
//     {...props}
//   >
//     {children}
//   </select>
// );

export const Card = ({ children, className, ...props }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div className={`px-6 py-4 border-b ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = "", children, ...props }) => (
  <div
    className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h2 className={`text-xl font-semibold ${className}`} {...props}>
    {children}
  </h2>
);

export function Button({ children, ...props }) {
  return (
    <button {...props} className={`px-4 py-2 rounded ${props.className || ""}`}>
      {children}
    </button>
  );
}

export function Checkbox({ onCheckedChange, ...props }) {
  return (
    <input
      type="checkbox"
      {...props}
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  );
}

export const IconButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
    aria-label={label}
  >
    {icon}
  </button>
);

export const Input = React.forwardRef((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={`border rounded px-3 py-2 w-full ${props.className || ""}`}
    />
  );
});

export function Label({ children, ...props }) {
  return <label {...props}>{children}</label>;
}

export const Logo = () => (
  <div className="text-2xl font-bold text-gray-800">SmartShop</div>
);

export const NavLink = ({ href, children }) => (
  <Link to={href} className="text-gray-600 hover:text-gray-800">
    {children}
  </Link>
);
