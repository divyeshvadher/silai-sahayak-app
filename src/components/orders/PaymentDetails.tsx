
type PaymentDetailsProps = {
  order: {
    price: number;
    advance_paid: number | null;
  };
  calculateBalance: () => number;
};

export const PaymentDetails = ({ order, calculateBalance }: PaymentDetailsProps) => {
  return (
    <div className="silai-card">
      <h3 className="font-medium text-gray-700 mb-3">Payment Details</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm text-gray-500">Total Price</p>
          <p className="font-medium">₹{order.price}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Advance Paid</p>
          <p className="font-medium">₹{order.advance_paid || 0}</p>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">Balance Due</p>
        <p className="font-medium text-lg text-silai-700">₹{calculateBalance()}</p>
      </div>
    </div>
  );
};
