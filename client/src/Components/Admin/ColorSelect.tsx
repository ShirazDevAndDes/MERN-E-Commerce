import { useEffect, useRef, useState } from "react";

import colorsNames from "../../assets/colorNames.json";

type ColorSelectType = {
  name: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
};

export default function ColorSelect({
  name,
  value,
  onChange,
}: ColorSelectType) {
  const [colorList, setColorList] = useState<
    {
      name: string;
      hex: string;
      active?: boolean;
    }[]
  >([]);
  // console.log(value);

  const [timeoutID, setTimeoutID] = useState(null);
  const [colorValue, setColorValue] = useState(value || "");

  function setColor(selectedIndex: number) {
    setColorValue(selectedIndex > -1 ? colorList[selectedIndex].hex : "");
    setColorList(
      colorsNames.map((color, index: number) => {
        if (selectedIndex === index) {
          return { name: color.name, hex: color.hex, active: true };
        }
        return { name: color.name, hex: color.hex, active: false };
      })
    );
    onChange({
      target: {
        name,
        value: selectedIndex > -1 ? colorList[selectedIndex].hex : "",
      },
    });
  }

  const inputElement = useRef(null);

  useEffect(() => {
    const list = colorsNames.map((color) => {
      if (value && value === color.hex) {
        return { name: color.name, hex: color.hex, active: true };
      }
      return { name: color.name, hex: color.hex, active: false };
    });

    setColorList(list);

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const colorIndex = colorList.findIndex((color) => color.hex === value);
    setColor(colorIndex);

    //eslint-disable-next-line
  }, [value]);

  return (
    <>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          defaultValue={colorValue}
          ref={inputElement}
        />
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          id="colorBtnDropdown"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        ></button>
        <ul className="dropdown-menu dropdown-menu-end colorDropdown pt-0">
          <nav className="navbar bg-light">
            <div className="container-fluid">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Search"
                onChange={(e) => {
                  clearTimeout(timeoutID);
                  const timeout = setTimeout(() => {
                    setColorList(
                      colorsNames.filter((color) => {
                        const colorFound = color.name
                          .toLowerCase()
                          .match(e.target.value);
                        if (colorFound) {
                          return {
                            name: colorsNames[colorFound.index].name,
                            hex: colorsNames[colorFound.index].hex,
                            active: false,
                          };
                        }
                        return false;
                      }) || []
                    );
                  }, 4000);

                  setTimeoutID(timeout);
                }}
              />
            </div>
          </nav>
          <div style={{ maxHeight: "202px", overflowX: "hidden" }}>
            {colorList.map((color, index) => {
              if (color.active) {
                return (
                  <li
                    key={index}
                    className="dropdown-item d-flex active"
                    onClick={() => setColor(index)}
                    tabIndex={-1}
                  >
                    <span
                      className="w-25 me-3"
                      style={{ backgroundColor: color.hex }}
                    ></span>{" "}
                    {color.name}
                  </li>
                );
              } else {
                return (
                  <li
                    key={index}
                    className="dropdown-item d-flex"
                    onClick={() => setColor(index)}
                    tabIndex={-1}
                  >
                    <span
                      className="w-25 me-3"
                      style={{ backgroundColor: color.hex }}
                    ></span>{" "}
                    {color.name}
                  </li>
                );
              }
            })}
          </div>
        </ul>
      </div>
    </>
  );
}
