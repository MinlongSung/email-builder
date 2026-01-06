import { useState, useEffect } from "react";

interface BorderRadiusValue {
  topLeft: string;
  topRight: string;
  bottomRight: string;
  bottomLeft: string;
}

interface BorderRadiusControlProps {
  value: string | undefined;
  onChange: (value: string) => void;
  label?: string;
}

const parseBorderRadius = (value: string | undefined): BorderRadiusValue => {
  if (!value) {
    return {
      topLeft: "0",
      topRight: "0",
      bottomRight: "0",
      bottomLeft: "0",
    };
  }

  const parts = value.trim().split(/\s+/);

  switch (parts.length) {
    case 1:
      return {
        topLeft: parts[0],
        topRight: parts[0],
        bottomRight: parts[0],
        bottomLeft: parts[0],
      };
    case 2:
      return {
        topLeft: parts[0],
        topRight: parts[1],
        bottomRight: parts[0],
        bottomLeft: parts[1],
      };
    case 3:
      return {
        topLeft: parts[0],
        topRight: parts[1],
        bottomRight: parts[2],
        bottomLeft: parts[1],
      };
    case 4:
      return {
        topLeft: parts[0],
        topRight: parts[1],
        bottomRight: parts[2],
        bottomLeft: parts[3],
      };
    default:
      return {
        topLeft: "0",
        topRight: "0",
        bottomRight: "0",
        bottomLeft: "0",
      };
  }
};

const formatBorderRadius = (radius: BorderRadiusValue): string => {
  const { topLeft, topRight, bottomRight, bottomLeft } = radius;

  // Simplify if all corners are equal
  if (
    topLeft === topRight &&
    topRight === bottomRight &&
    bottomRight === bottomLeft
  ) {
    return topLeft;
  }

  // Simplify if opposite corners are equal
  if (topLeft === bottomRight && topRight === bottomLeft) {
    return `${topLeft} ${topRight}`;
  }

  return `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
};

const stripUnit = (value: string): number => {
  return parseInt(value) || 0;
};

const addUnit = (value: number, unit: string = "px"): string => {
  return `${value}${unit}`;
};

export const BorderRadiusControl = ({
  value,
  onChange,
  label = "Border Radius",
}: BorderRadiusControlProps) => {
  const [radius, setRadius] = useState<BorderRadiusValue>(
    parseBorderRadius(value)
  );
  const [linkAll, setLinkAll] = useState(false);
  const [unit, setUnit] = useState("px");

  useEffect(() => {
    setRadius(parseBorderRadius(value));
    // Detect unit from value
    if (value) {
      const match = value.match(/(px|em|rem|%)/);
      if (match) setUnit(match[1]);
    }
  }, [value]);

  const handleChange = (corner: keyof BorderRadiusValue, delta: number) => {
    const currentValue = stripUnit(radius[corner]);
    const newValue = Math.max(0, currentValue + delta);
    const newValueWithUnit = addUnit(newValue, unit);

    let newRadius: BorderRadiusValue;

    if (linkAll) {
      newRadius = {
        topLeft: newValueWithUnit,
        topRight: newValueWithUnit,
        bottomRight: newValueWithUnit,
        bottomLeft: newValueWithUnit,
      };
    } else {
      newRadius = {
        ...radius,
        [corner]: newValueWithUnit,
      };
    }

    setRadius(newRadius);
    onChange(formatBorderRadius(newRadius));
  };

  const handleInputChange = (
    corner: keyof BorderRadiusValue,
    inputValue: string
  ) => {
    const numValue = parseInt(inputValue) || 0;
    const newValueWithUnit = addUnit(Math.max(0, numValue), unit);

    let newRadius: BorderRadiusValue;

    if (linkAll) {
      newRadius = {
        topLeft: newValueWithUnit,
        topRight: newValueWithUnit,
        bottomRight: newValueWithUnit,
        bottomLeft: newValueWithUnit,
      };
    } else {
      newRadius = {
        ...radius,
        [corner]: newValueWithUnit,
      };
    }

    setRadius(newRadius);
    onChange(formatBorderRadius(newRadius));
  };

  const corners = [
    { key: "topLeft" as const, label: "Top Left" },
    { key: "topRight" as const, label: "Top Right" },
    { key: "bottomRight" as const, label: "Bottom Right" },
    { key: "bottomLeft" as const, label: "Bottom Left" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: "bold" }}>{label}</span>
        <label
          style={{
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={linkAll}
            onChange={(e) => setLinkAll(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          Link all
        </label>
      </div>

      {corners.map(({ key, label: cornerLabel }) => (
        <div
          key={key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span style={{ fontSize: "11px", minWidth: "80px" }}>
            {cornerLabel}:
          </span>

          <button
            onClick={() => handleChange(key, -1)}
            style={{
              padding: "2px 6px",
              cursor: "pointer",
              fontSize: "11px",
            }}
          >
            -
          </button>

          <input
            type="number"
            value={stripUnit(radius[key])}
            onChange={(e) => handleInputChange(key, e.target.value)}
            min={0}
            style={{
              width: "50px",
              padding: "2px 4px",
              textAlign: "center",
              fontSize: "11px",
            }}
          />

          <span style={{ fontSize: "11px" }}>{unit}</span>

          <button
            onClick={() => handleChange(key, 1)}
            style={{
              padding: "2px 6px",
              cursor: "pointer",
              fontSize: "11px",
            }}
          >
            +
          </button>
        </div>
      ))}
    </div>
  );
};
