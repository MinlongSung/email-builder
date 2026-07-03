
export function PropertyPanel() {

  return (
    <div
      className={[
        "absolute right-0 top-0 bottom-0 w-72 bg-white border-l border-gray-200 shadow-xl z-20",
        "flex flex-col",
        "transition-transform duration-300 ease-in-out",
        false ? "translate-x-0" : "translate-x-full",
      ].join(" ")}
    >
 
    </div>
  );
}
