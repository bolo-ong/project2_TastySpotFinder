export interface MenuItem {
  title: string;
  path?: string;
  size?: `lg` | "md" | "sm";
  onClick?: () => void;
}
