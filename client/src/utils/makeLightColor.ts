export const makeLightColor = (color: string): string => {
  // 입력된 컬러 코드를 16진수 형식에서 파싱합니다.
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const alpha = 0.8;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
