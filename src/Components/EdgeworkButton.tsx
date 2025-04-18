const EdgeworkButton = ({
  children,
  setEdgeworkModalIsOpen,
}: {
  children: string;
  setEdgeworkModalIsOpen: (newVal: boolean) => void;
}) => {
  return (
    <button
      onClick={() => setEdgeworkModalIsOpen(true)}
      className="cursor-pointer text-white border-2 p-2 border-white rounded-md h-fit"
    >
      {children}
    </button>
  );
};
export default EdgeworkButton;
