
const getToken = async () => {
  try {
    const {
      VUE_APP_API_USER: email,
      VUE_APP_API_PASSWORD: password,
      VUE_APP_API_REMEMBER_ME: rememberMe } = process.env
      console.log('process.env: ', process.env);

    const response = await fetch("https://api.dev.resights.dk/api/v2/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          email ,
          password,
          remember_me: rememberMe
        }
      ),
    });
    return await response.json();
    } catch (error) {
    console.error("Error:", error);
  }
}
const generatePromptResults = async (payload) => {
  const { data } = await getToken()
  try {
    const response = await fetch("https://api.dev.resights.dk/api/v2/ai/letter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: data.token
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}
export { generatePromptResults }
