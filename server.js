const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

// List connected Arduino ports
app.get("/list-ports", (req, res) => {
  exec("arduino-cli board list", (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr });
    }
    res.json({ output: stdout });
  });
});

// Compile and flash .ino file
app.post("/flash", (req, res) => {
  const { sketchPath, fqbn, port } = req.body;

  const compileCmd = `arduino-cli compile --fqbn ${fqbn} ${sketchPath}`;
  const uploadCmd = `arduino-cli upload -p ${port} --fqbn ${fqbn} ${sketchPath}`;

  exec(compileCmd, (compileErr, compileOut, compileErrOut) => {
    if (compileErr) {
      return res.status(500).json({ error: compileErrOut });
    }

    exec(uploadCmd, (uploadErr, uploadOut, uploadErrOut) => {
      if (uploadErr) {
        return res.status(500).json({ error: uploadErrOut });
      }
      res.json({ message: "Flashed successfully!", uploadOut });
    });
  });
});

app.listen(3000, () => {
  console.log("Backend server running on http://localhost:3000");
});
const cors = require('cors');
app.use(cors());
