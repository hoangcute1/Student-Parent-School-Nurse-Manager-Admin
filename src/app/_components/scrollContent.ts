const scrollContent = (
  direction: "left" | "right",
  ref: React.RefObject<HTMLDivElement | null>
) => {
  if (!ref.current) return;

  const container = ref.current;
  const scrollAmount = 400;

  const newScrollLeft =
    container.scrollLeft +
    (direction === "left" ? scrollAmount : -scrollAmount);

  container.scrollTo({
    left: newScrollLeft,
    behavior: "smooth",
  });
};

export default scrollContent;
