// Import the environment variables
import envVariables from './env.js';

// Access the environment variables
const API_KEY = envVariables.API_KEY;

// function to 
function collectUserPreferences() {
  // Collect user preferences from input fields
  const keywordsInput = document.getElementById("keywords");
  return keywordsInput.value;
}

function constructQuery(user_keywords) {
  // Construct the query based on user preferences
  return `Generate HTML that includes the following: ${user_keywords}`;
}

async function callOpenAiApi(query) {
  const response = await fetch(
    "https://api.openai.com/v1/engines/davinci/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        prompt: query,
        max_tokens: 200, // Adjust as needed
        n: 1,
        stop: null,
        temperature: 0.8, // Adjust as needed
      }),
    }
  );

  const data = await response.json();
  return data.choices[0].text; // Extract the generated HTML and CSS code
}

async function onSubmitButtonClick() {
  const keywords = collectUserPreferences();
  const query = constructQuery(keywords);
  const generatedCode = await callOpenAiApi(query);

  // Parse the HTML and CSS code from the API response
  const html = generatedCode; // Adjust this based on the API response structure

  displayGeneratedWebPage(html);
}

function displayGeneratedWebPage(html, css) {
  // Create a style element to hold the generated CSS
  const styleElement = document.createElement("style");
  styleElement.innerHTML = css;

  // Create an iframe to display the generated HTML and CSS
  const iframe = document.createElement("iframe");
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.frameBorder = "0";
  iframe.sandbox = "allow-same-origin";

  // Append the iframe to the output container
  const outputContainer = document.getElementById("output-container");
  outputContainer.innerHTML = "";
  outputContainer.appendChild(iframe);

  // Write the generated HTML and CSS to the iframe
  const iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(
    "<!DOCTYPE html><html><head></head><body></body></html>"
  );
  iframeDocument.head.appendChild(styleElement);
  iframeDocument.body.innerHTML = html;
  iframeDocument.close();
}

document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit-button");
  submitButton.addEventListener("click", onSubmitButtonClick);
});
