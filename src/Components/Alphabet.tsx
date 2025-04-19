import DraggableResizeable from "./DraggableResizeable";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const Alphabet = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <DraggableResizeable
      isOpen={isOpen}
      corner={"bottom-right"}
      disableResize={true}
    >
      <div
        className={`bg-jet text-bg w-full h-full
        border-2 border-bg rounded-2 p-[10px] 
        grid grid-cols-[repeat(10,5ch)]`}
      >
        {alphabet.split("").map((letter, i) => {
          return (
            <span
              className={`${i < 10 ? "pl-[1ch]" : ""} text-lg`}
              key={letter}
            >{`${i}:${letter}`}</span>
          );
        })}
      </div>
    </DraggableResizeable>
  );
};

export default Alphabet;
