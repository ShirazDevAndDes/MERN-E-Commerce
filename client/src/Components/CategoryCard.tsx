import { Link } from "react-router-dom";
import { CategoryData } from "../types/pages/category";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CategoryCard({ category }: { category: CategoryData }) {
  const { name, bgColor, iconName } = category;

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
    <Link
      to={"/products?cat=" + name}
      className="btn btn-lg d-flex justify-content-center align-items-center text-capitalize shadow-sm h-100"
      style={{ backgroundColor: bgColor, color: bgContrast }}
    >
      <FontAwesomeIcon icon={["fas", iconName]} className="fs-5 me-2" />
      <p className="m-0 p-0">{name}</p>
    </Link>
  );
}
