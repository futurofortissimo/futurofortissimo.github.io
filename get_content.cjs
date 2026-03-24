var fs = require("fs");
var raw = fs.readFileSync("data.js","utf8");
var jsonStr = raw.replace(/^[^\[{]*/, "").replace(/;\s*$/, "");
var data = JSON.parse(jsonStr);
var targets = ["ff.5.1","ff.61.1","ff.143.1","ff.4.1","ff.71.2","ff.126.4","ff.13.1","ff.72.4","ff.132.4"];
data.forEach(function(issue) {
  if (issue.subchapters) {
    issue.subchapters.forEach(function(sub) {
      var m = sub.title ? sub.title.match(/ff\.\d+\.\d+/) : null;
      if (m && targets.indexOf(m[0]) >= 0) {
        console.log("=== " + m[0] + " ===");
        console.log("TITLE: " + sub.title);
        console.log("CONTENT: " + (sub.content || "").substring(0, 2000));
        console.log("---END---\n");
      }
    });
  }
});
