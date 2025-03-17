import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { MenuItem } from "types";
import { Ripple } from "components";

export interface Props {
  items: MenuItem[];
  selectedMenu?: string;
  onClick?: (menu: MenuItem) => void;
}

export const Menu = ({ items, selectedMenu, onClick, ...rest }: Props) => {
  return (
    <ul>
      {items.map((item) => (
        <StyledMenuItem
          key={item.title}
          onClick={() => onClick?.(item)}
          selected={selectedMenu === item.title}
          size={item.size || "lg"}
        >
          {item.title}
          <Ripple />
        </StyledMenuItem>
      ))}
    </ul>
  );
};

const StyledMenuItem = styled.li<{
  selected: boolean;
  size: `lg` | "md" | "sm";
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  font-size: ${({ size }) => size && sizes[size].fontSize};
  padding: ${({ size }) => size && sizes[size].padding};

  border-radius: 0.5rem;

  ${({ selected }) =>
    selected &&
    `
    color:  ${theme.colors.main[5]};
    `}

  &:hover {
    background-color: ${theme.colors.main};
  }
`;

const sizes = {
  lg: {
    fontSize: "1rem",
    padding: `0.5rem 1rem`,
  },
  md: {
    fontSize: "0.875rem",
    padding: `0.375rem 0.875rem`,
  },
  sm: {
    fontSize: "0.75rem",
    padding: `0.25rem 0.75rem`,
  },
};
