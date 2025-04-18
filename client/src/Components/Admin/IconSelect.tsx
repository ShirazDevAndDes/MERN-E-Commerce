import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useRef, useState } from "react";
import fontAwesomeIconsList from "../../assets/FontAwesomeIconList.json";

export default function IconSelect({ name, value, onChange }) {
  const [iconList, setIconList] = useState(() => {
    return fontAwesomeIconsList.map((icon) => {
      return { name: icon.iconName, active: false };
    });
  });

  const [timeoutID, setTimeoutID] = useState(null);
  const [iconValue, setIconValue] = useState(value || "");

  function setIcon(selectedIndex: number) {
    setIconValue(iconList[selectedIndex].name || "");
    setIconList(
      fontAwesomeIconsList.map((icon, index: number) => {
        if (selectedIndex === index) {
          return { name: icon.iconName, active: true };
        }
        return { name: icon.iconName, active: false };
      })
    );
    onChange({
      target: { name, value: iconList[selectedIndex].name || "" },
    });
  }

  const inputElement = useRef();

  useEffect(() => {
    library.add(...(fontAwesomeIconsList as any[]));
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (value) {
      const iconIndex = iconList.findIndex((icon) => icon.name === value);
      setIcon(iconIndex);
    }

    //eslint-disable-next-line
  }, [value]);

  return (
    <>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          defaultValue={iconValue}
          ref={inputElement}
          aria-label="Text input with dropdown button"
        />
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          id="iconBtnDropdown"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        ></button>
        <ul className="dropdown-menu dropdown-menu-end iconDropdown pt-0">
          <nav className="navbar bg-light">
            <div className="container-fluid">
              <input
                type="text"
                className="form-control w-100"
                placeholder="Search"
                onChange={(e) => {
                  clearTimeout(timeoutID);
                  const timeout = setTimeout(() => {
                    setIconList(
                      fontAwesomeIconsList
                        .filter((icon) => {
                          const iconFound = icon.iconName.match(e.target.value);
                          return iconFound ? true : false;
                        })
                        .map((icon) => ({
                          name: icon.iconName,
                          active: false,
                        })) || []
                    );
                  }, 2000);
                  setTimeoutID(timeout);
                }}
              />
            </div>
          </nav>
          <div style={{ maxHeight: "202px", overflowX: "hidden" }}>
            {iconList.length > 0 &&
              iconList.map((icon, index) => {
                if (icon.active) {
                  return (
                    <li
                      key={index}
                      className="dropdown-item active d-flex align-items-center text-capitalize"
                      onClick={() => setIcon(index)}
                      tabIndex={-1}
                    >
                      <FontAwesomeIcon
                        icon={icon.name as IconProp}
                        className="me-2"
                      />
                      {icon.name.replace("-", " ")}
                    </li>
                  );
                } else {
                  return (
                    <li
                      key={index}
                      className="dropdown-item btn d-flex align-items-center text-capitalize"
                      onClick={() => setIcon(index)}
                      tabIndex={-1}
                    >
                      <FontAwesomeIcon
                        icon={icon.name as IconProp}
                        className="me-2"
                      />
                      {icon.name.replace("-", " ")}
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
