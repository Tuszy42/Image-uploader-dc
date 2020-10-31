function gotoStep(stepNumber) {
  for (let step of document.getElementsByClassName("step")) {
    step.classList.add("d-none");
    step.classList.remove("d-flex");
  }
  document.getElementById(`step_${stepNumber}`).classList.add("d-flex");
}

function handleImgFile({ files }) {
  gotoStep(2);
  const [file] = files;

  const storageRef = firebase.storage().ref();
  const uploadTask = storageRef
    .child(`image-uploader-dc/${file.name}`)
    .put(file);
  uploadTask.on(
    "state_changed",
    function (snapshot) {},
    function (error) {
      /* error handler */
      handleErrorsAndWarnings([error], []);
      gotoStep(1);
    },
    function () {
      /* success handler */
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadUrl) {
        document.getElementById(
          "image-container"
        ).style.backgroundImage = `url(${downloadUrl})`;
        document.getElementById("link__content").innerHTML = downloadUrl;
      });
      gotoStep(3);
    }
  );
}

/**
 * Register dragndrop eventlistener for imagedrop area
 */
let dropArea = document.getElementById("drop_zone");
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}
["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});
["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  dropArea.classList.add("highlight");
}

function unhighlight(e) {
  dropArea.classList.remove("highlight");
}

dropArea.addEventListener("drop", handleDrop, false);

const messages = document.getElementById("messages");

function createMessageOfType(content) {
  const errorMessage = document.createElement("div");
  errorMessage.className = `message message--${this.type}`;
  errorMessage.innerHTML = content;
  messages.appendChild(errorMessage);
}

function handleErrorsAndWarnings(errors, warnings) {
  messages.innerHTML = "";
  errors.forEach(createMessageOfType, { type: "error" });
  warnings.forEach(createMessageOfType, { type: "warning" });
}

function handleDrop(e) {
  let dt = e.dataTransfer;
  let [file] = dt.files;
  const errors = [];
  const warnings = [];
  if (dt.files.length === 0) {
    errors.push("No files dropped!");
  }
  if (dt.files.length > 1) {
    warnings.push(
      "Only one file can be uploaded at a time! First file used from list."
    );
  }
  if (!file.type.match(/image.*/)) {
    errors.push("Only images are accepted!");
  }
  handleErrorsAndWarnings(errors, warnings);
  if (errors.length === 0) {
    handleImgFile({ files: [file] });
  }
}

document.getElementById("link__copy").addEventListener("click", function () {
  navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
    if (result.state == "granted" || result.state == "prompt") {
      const link = document.getElementById("link__content");
      navigator.clipboard.writeText(link.innerText).then(
        function () {
          console.log("successful copy");
        },
        function () {
          console.error("ohno copy");
        }
      );
    }
  });
});

document.getElementById("restart").addEventListener("click", function () {
  gotoStep(1);
  document.getElementById("image-container").style.backgroundImage = "";
  document.getElementById("link__content").innerHTML = "";
});
