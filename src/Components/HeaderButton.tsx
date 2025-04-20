const HeaderButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className="cursor-pointer 
      text-white border-2 p-2 border-white rounded-md h-fit ml-1 mr-1 hover:text-gray-400 hover:border-gray-400"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default HeaderButton;
