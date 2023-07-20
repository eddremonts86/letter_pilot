
const getToken = async (user) => {
  try {

    const response = await fetch("https://api.dev.resights.dk/api/v2/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( user ),
    });
    return await response.json();
    } catch (error) {
    console.error("Error:", error);
  }
}
const generatePromptResults = async (payload, token) => {


  try {
    const response = await fetch("https://api.dev.resights.dk/api/v2/ai/letter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
}
export { generatePromptResults, getToken }
