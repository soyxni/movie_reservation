const fetchWithToken = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    alert("인증이 필요합니다. 다시 로그인해주세요.");
    window.location.href = "/login"; // 로그인 페이지로 이동
  }

  return response;
};

export default fetchWithToken;
