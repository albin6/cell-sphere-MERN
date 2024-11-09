import { Ticket } from "lucide-react";
export default function NoCouponFound() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-background rounded-lg shadow-sm border">
      <Ticket className="w-16 h-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        No Coupons Found
      </h2>
      <p className="text-muted-foreground text-center mb-6 max-w-sm">
        Sorry, it looks like there are no active coupons at the moment. Check
        back later for new offers!
      </p>
    </div>
  );
}
