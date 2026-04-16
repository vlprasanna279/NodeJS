const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/data", (req, res) => {
  res.json({
    Hyderabad: {
      center: [17.385, 78.4867],
      places: {
        Charminar: [17.3616, 78.4747],
        "Hitech City": [17.4435, 78.3772],
        Gachibowli: [17.4401, 78.3489],
        Kukatpally: [17.4949, 78.3996],
        "LB Nagar": [17.3457, 78.5522],
        Miyapur: [17.4940, 78.3240]
      }
    },

    Warangal: {
      center: [17.9689, 79.5941],
      places: {
        "Warangal Fort": [17.9953, 79.5856],
        Kazipet: [17.9756, 79.5196],
        Hanamkonda: [18.0056, 79.5583]
      }
    },

    Nizamabad: {
      center: [18.6725, 78.0941],
      places: {
        "Nizamabad Fort": [18.6720, 78.0940],
        Armoor: [18.7900, 78.2900],
        Bodhan: [18.6600, 77.8800]
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
