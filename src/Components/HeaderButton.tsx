const HeaderButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className="cursor-pointer text-white border-2 p-2 border-white rounded-md h-fit"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default HeaderButton;
