const HeaderButton = ({
  text,
  underlineFirst,
  onClick,
}: {
  text: string;
  underlineFirst: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      className="cursor-pointer 
      text-white border-2 p-2 border-white rounded-md h-fit hover:text-gray-400 hover:border-gray-400"
      onClick={onClick}
    >
      <span className={`${underlineFirst ? "underline" : ""}`}>
        {text.slice(0, 1)}
      </span>
      {text.slice(1)}
    </button>
  );
};

export default HeaderButton;
