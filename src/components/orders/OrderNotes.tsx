
type OrderNotesProps = {
  notes: string | null;
};

export const OrderNotes = ({ notes }: OrderNotesProps) => {
  if (!notes) return null;
  
  return (
    <div className="silai-card">
      <h3 className="font-medium text-gray-700 mb-2">Notes</h3>
      <p className="text-gray-600">{notes}</p>
    </div>
  );
};
