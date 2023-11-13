export const validateLink = (value: string) => {
  const regex1 = /^https:\/\/naver\.me\/[a-zA-Z0-9]/;
  const regex2 = /^https:\/\/map\.naver\.com\/p\/[a-zA-Z0-9]/;

  if (
    !regex1.test(value.trim()) &&
    !regex2.test(value.trim()) &&
    value.trim()
  ) {
    return "올바른 양식이 아닙니다.";
  }

  return "";
};

export const validateTitle = (value: string) => {
  return value.trim() ? "" : "필수 입력값 입니다.";
};
