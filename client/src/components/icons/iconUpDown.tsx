interface Props {
  type?: "up" | "down" | "left" | "right";
}

const IconUpDown = ({ type }: Props) => {
  switch (type) {
    case "up":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-caret-up"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M18 14l-6 -6l-6 6h12" />
        </svg>
      );
    case "down":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-caret-down"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M6 10l6 6l6 -6h-12" />
        </svg>
      );
    case "left":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-caret-left"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M14 6l-6 6l6 6v-12" />
        </svg>
      );
    case "right":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-caret-right"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M10 18l6 -6l-6 -6v12" />
        </svg>
      );
  }
};

export default IconUpDown;
