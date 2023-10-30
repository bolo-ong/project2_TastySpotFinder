export const makeLightenColor = (color: string): string => {
  // 입력된 컬러 코드를 16진수 형식에서 파싱
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  // alpha 0.8로 변경해서 밝은 컬러로 변환
  const alpha = 0.8;

  const lightenColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  return lightenColor;
};

export const makeDarkenColor = (color: string): string => {
  // 입력된 컬러 코드를 16진수 형식에서 파싱
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  // RGB 값을 0.9만큼 곱해 어두운 색상으로 변환
  const darkR = Math.max(0, Math.round(r * 0.9));
  const darkG = Math.max(0, Math.round(g * 0.9));
  const darkB = Math.max(0, Math.round(b * 0.9));

  // 새로운 RGB 값을 16진수로 변환
  const darkenColor = `#${darkR.toString(16).padStart(2, "0")}${darkG
    .toString(16)
    .padStart(2, "0")}${darkB.toString(16).padStart(2, "0")}`;

  return darkenColor;
};
