import { Link } from "react-router-dom";
import { BannerDataType } from "../types/pages/banner";

type BannerCardType = {
  image: string | null;
  data: Omit<BannerDataType, "image">;
  link?: boolean;
  className?: string;
  style?: object;
};

export default function BannerCard({
  image = null,
  data,
  link = false,
  className = "",
  style = {},
}: BannerCardType) {
  const { id, name, description, bgColor } = data;

  function getBgContrast(
    bgColor = "#ffffff",
    lightColor = "#ffffff",
    darkColor = "#000000"
  ) {
    var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor;
  }

  const bgContrast = getBgContrast(bgColor);

  return (
    <div
      className={`d-flex flex-column flex-md-row justify-content-center h-100 p-3 px-md-4 py-md-5 rounded-bottom shadow-sm ${className}`}
      style={{ ...style, backgroundColor: bgColor || "gray" }}
    >
      <div className="col-12 col-md-8 align-self-center order-1 order-md-1 px-4 pb-4">
        <p
          className="display-5 fw-bold text-capitalize mb-1"
          style={{ color: bgContrast }}
        >
          {name}
        </p>
        <p className="h2 fw-light" style={{ color: bgContrast }}>
          {description}
        </p>
        {link && (
          <Link to={"/product" + id} className="btn btn-warning mt-3">
            See Product
          </Link>
        )}
      </div>
      <div className="col-6 col-sm-4 col-lg-3 align-self-center order-0 order-md-1 mb-4 mb-md-0">
        {image ? (
          <img className="img-fluid" src={image} alt={name} />
        ) : (
          <img
            className="img-fluid bg-white rounded-5"
            src={"/image.png"}
            alt={name}
          />
        )}
      </div>
    </div>
  );
}
