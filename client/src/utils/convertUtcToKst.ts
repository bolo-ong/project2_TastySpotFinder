/**
 * UTC 시간을 KST (한국 시간)으로 변환하는 함수
 * @param {string} utcDateStr - 변환할 UTC 시간 (ISO 형식의 문자열)
 * @returns {string} - 한국 시간대 (KST)로 변환된 날짜와 시간
 */

export const convertUtcToKst = (utcDateStr: string): string => {
  const utcDate = new Date(utcDateStr);
  const koreaTimeOffset = 9 * 60; // KST는 UTC+9이므로 분 단위로 변환
  const koreaTime = new Date(utcDate.getTime() + koreaTimeOffset * 60 * 1000);

  // 한국 시간대로 포맷된 날짜와 시간 문자열 반환
  return koreaTime.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
};
