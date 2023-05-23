import { faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CategoryData } from "../types/pages/category";
import { PriceType } from "../types/pages/product";

async function getCategories() {
  return await axios
    .get("/categories")
    .then((response) => response.data.result as CategoryData[]);
}

export default function ProductsFilter({
  filterProducts,
}: {
  filterProducts: () => void;
}) {
  const [params, setParams] = useSearchParams();

  const [filterCategory, setFilterCategory] = useState<string>(
    params.get("cat") || ""
  );
  const [filterPrice, setFilterPrice] = useState<PriceType>({
    min: parseInt(params.get("pMin")) || 0,
    max: parseInt(params.get("pMax")) || 0,
  });

  const categories = useQuery("categories", getCategories);

  function setParameter(name: string, value = "") {
    // console.log("set ", value);
    if (params.has(name)) {
      params.set(name, value);
    } else {
      params.append(name, value);
    }
    setParams(params);
  }

  function deleteParameter(name: string) {
    params.delete(name);
    setParams(params);
  }

  function checkPriceAmount() {
    let checkResult = false;
    if (filterPrice.min > filterPrice.max) {
      toast.error("Minimum price is greater then maximum price");
    } else {
      checkResult = true;
    }
    return checkResult;
  }

  function submitFilters() {
    const checkPrice = checkPriceAmount();

    if (checkPrice) {
      setParameter("page", "1");
      filterProducts();
    }
  }

  useEffect(() => {
    submitFilters();

    //eslint-disable-next-line
  }, []);

  return (
    <>
      <label className="form-label">Category</label>
      {filterCategory && (
        <button
          className="btn text-success w-100 text-capitalize text-start border-0 d-flex align-items-center"
          onClick={(e) => {
            deleteParameter("cat");
            setFilterCategory("");
          }}
        >
          <FontAwesomeIcon icon={faRemove} className="text-danger" />
          <span className="vr mx-2 bg-dark"></span>
          {filterCategory}
        </button>
      )}

      <div className="list-group rounded-0">
        {!filterCategory &&
          categories.isSuccess &&
          categories.data.map((category, index) => (
            <button
              key={index}
              type="button"
              className="list-group-item list-group-item-action border-0 text-capitalize"
              value={category.name}
              onClick={(e) => {
                const target = e.target as HTMLInputElement;
                setParameter("cat", target.value || "");
                setFilterCategory(target.value);
              }}
            >
              {category.name}
            </button>
          ))}
      </div>
      <hr />

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          min={0}
          max={9999}
          className="form-control mb-1 rounded-0 shadow-none"
          value={filterPrice.min}
          placeholder="Min"
          onChange={(e) => {
            setParameter("pMin", e.target.value);
            setFilterPrice({
              ...filterPrice,
              min: parseInt(e.target.value) || 0,
            });
          }}
        />
        <input
          type="number"
          min={0}
          max={9999}
          className="form-control mb-1 rounded-0 shadow-none"
          value={filterPrice.max}
          placeholder="Max"
          onChange={(e) => {
            setParameter("pMax", e.target.value);
            setFilterPrice({
              ...filterPrice,
              max: parseInt(e.target.value) || 0,
            });
          }}
        />
      </div>
      <button
        className="btn btn-outline-dark w-100 rounded-0"
        onClick={submitFilters}
      >
        Filter Results
      </button>
    </>
  );
}
