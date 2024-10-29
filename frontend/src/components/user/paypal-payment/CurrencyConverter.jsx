export async function inrToUsd(inrAmount) {
  const apiKey = "2aa4287de92f65aef179208d"; // Replace with your actual API key
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/INR/USD`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.result === "success") {
      const exchangeRate = data.conversion_rate;
      const usdAmount = inrAmount * exchangeRate;
      return usdAmount.toFixed(2); // Returns USD amount rounded to 2 decimals
    } else {
      throw new Error("Failed to fetch exchange rate");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example usage:
// const inrAmount = 1000;
// inrToUsd(inrAmount).then(usdAmount => {
//     console.log(`INR ${inrAmount} is approximately USD ${usdAmount}`);
// });
