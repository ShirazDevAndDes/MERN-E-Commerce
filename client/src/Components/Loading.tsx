import LoadingIcons from "react-loading-icons";

type LoadingType = {
  type?: "card" | "screen";
  height?: string;
  width?: string;
};

export default function Loading({
  type = "card",
  height = "",
  width = "",
}: LoadingType) {
  const stroke = "#212529";
  const fill = "#212529";

  if (type === "screen") {
    return (
      <div className="position-fixed d-flex top-0 start-0 end-0 bottom-0 text-center text-dark min-vh-100">
        <div className="m-auto">
          <LoadingIcons.Bars
            className="mb-3"
            stroke={stroke}
            fill={fill}
            height={"80px"}
            width={"100%"}
          />

          <p className="d-inline fs-4 m-0">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-dark w-100"
      style={{ height: height, width: width }}
    >
      <LoadingIcons.Audio
        stroke={stroke}
        fill={fill}
        height={"75px"}
        width={"100%"}
      />
      <p className="fs-4 m-0">Loading</p>
    </div>
  );
}
