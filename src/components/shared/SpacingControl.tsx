import { useState, useEffect } from "react";

interface SpacingValue {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

interface SpacingControlProps {
  value: string | undefined;
  onChange: (value: string) => void;
  label: string;
  type: "padding" | "margin";
}

const parseSpacing = (value: string | undefined): SpacingValue => {
  if (!value) {
    return { top: "0", right: "0", bottom: "0", left: "0" };
  }

  const parts = value.trim().split(/\s+/);

  switch (parts.length) {
    case 1:
      return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    case 2:
      return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    case 3:
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    case 4:
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
    default:
      return { top: "0", right: "0", bottom: "0", left: "0" };
  }
};

const formatSpacing = (spacing: SpacingValue): string => {
  const { top, right, bottom, left } = spacing;

  // Simplify if all sides are equal
  if (top === right && right === bottom && bottom === left) {
    return top;
  }

  // Simplify if vertical and horizontal are equal
  if (top === bottom && right === left) {
    return `${top} ${right}`;
  }

  return `${top} ${right} ${bottom} ${left}`;
};

const stripUnit = (value: string): number => {
  return parseInt(value) || 0;
};

const addUnit = (value: number, unit: string = "px"): string => {
  return `${value}${unit}`;
};

export const SpacingControl = ({
  value,
  onChange,
  label,
  type,
}: SpacingControlProps) => {
  const [spacing, setSpacing] = useState<SpacingValue>(parseSpacing(value));
  const [linkAll, setLinkAll] = useState(false);
  const [unit, setUnit] = useState("px");

  useEffect(() => {
    setSpacing(parseSpacing(value));
    // Detect unit from value
    if (value) {
      const match = value.match(/(px|em|rem|%)/);
      if (match) setUnit(match[1]);
    }
  }, [value]);

  const handleChange = (side: keyof SpacingValue, delta: number) => {
    const currentValue = stripUnit(spacing[side]);
    const newValue = Math.max(0, currentValue + delta);
    const newValueWithUnit = addUnit(newValue, unit);

    let newSpacing: SpacingValue;

    if (linkAll) {
      newSpacing = {
        top: newValueWithUnit,
        right: newValueWithUnit,
        bottom: newValueWithUnit,
        left: newValueWithUnit,
      };
    } else {
      newSpacing = {
        ...spacing,
        [side]: newValueWithUnit,
      };
    }

    setSpacing(newSpacing);
    onChange(formatSpacing(newSpacing));
  };

  const handleInputChange = (side: keyof SpacingValue, inputValue: string) => {
    const numValue = parseInt(inputValue) || 0;
    const newValueWithUnit = addUnit(Math.max(0, numValue), unit);

    let newSpacing: SpacingValue;

    if (linkAll) {
      newSpacing = {
        top: newValueWithUnit,
        right: newValueWithUnit,
        bottom: newValueWithUnit,
        left: newValueWithUnit,
      };
    } else {
      newSpacing = {
        ...spacing,
        [side]: newValueWithUnit,
      };
    }

    setSpacing(newSpacing);
    onChange(formatSpacing(newSpacing));
  };

  const sides = [
    { key: "top" as const, label: "Top" },
    { key: "right" as const, label: "Right" },
    { key: "bottom" as const, label: "Bottom" },
    { key: "left" as const, label: "Left" },
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

      {sides.map(({ key, label: sideLabel }) => (
        <div
          key={key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span style={{ fontSize: "11px", minWidth: "50px" }}>
            {sideLabel}:
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
            value={stripUnit(spacing[key])}
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
