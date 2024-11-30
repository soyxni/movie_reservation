const fetchWithToken = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  // 토큰이 없으면 기본 fetch 호출
  if (!token) {
    return await fetch(url, options);
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });

  // 401 상태 처리
  if (response.status === 401) {
    localStorage.removeItem("token"); // 토큰 삭제
    alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
    window.location.href = "/login"; // 로그인 페이지로 이동
  }

  return response;
};

export default fetchWithToken;
