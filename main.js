document.addEventListener("pjax:end", function () {
  var buttons = document.getElementsByClassName(
    "btn btn-outline BtnGroup-item"
  );
  if (buttons.length < 1) {
    return;
  }

  var olderButton = buttons[buttons.length - 1];

  var href = olderButton.getAttribute("href");
  if (!href) {
    return;
  }

  var totalCommits = getTotalCommits();
  if (totalCommits < 1) {
    return;
  }

  var lastPage = totalCommits - 35;
  var lastPageHref = href.replace(/(after=\w+)\+\d+/, "$1+" + lastPage);
  var firstCommitButton =
    `<a rel="nofollow" class="btn btn-danger btn-outline BtnGroup-item" href="{{LAST_COMMIT}}">First Commit</a>`.replace(
      "{{LAST_COMMIT}}",
      lastPageHref
    );

  olderButton.insertAdjacentHTML("afterend", firstCommitButton);
});

function getTotalCommits() {
  var links = document.getElementsByTagName("a");
  var repoLink = "";

  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute("data-pjax")) {
      repoLink = links[i].getAttribute("href");
      break;
    }
  }

  if (!repoLink) {
    return -1;
  }

  var repoPage = getPage("https://github.com" + repoLink);
  var doc = new DOMParser().parseFromString(repoPage, "text/html");
  var totalCommits = doc
    .querySelector(".Link--primary > span > strong")
    .innerHTML.replace(",", "");

  return parseInt(totalCommits);
}

function getPage(uri) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", uri, false);
  xmlHttp.send(null);

  return xmlHttp.responseText;
}
