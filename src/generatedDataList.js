import axios from "axios";

export default async function (stock_code) {
  const dataList = [];

  try {
    const response = await axios.get(
      "http://127.0.0.1:5000/stock?stock_code=" + stock_code
    );

    const { open, low, high, close, volume, timestamp } = response.data.data;

    for (let i = 0; i < timestamp.length; i++) {
      const kLineData = {
        open: open[i],
        low: low[i],
        high: high[i],
        close: close[i],
        volume: volume[i],
        timestamp: timestamp[i],
      };
      dataList.unshift(kLineData);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    dataList.reverse();
  }

  return dataList;
}
