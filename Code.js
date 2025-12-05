function testTodoist() {
  const SelfToken =
    PropertiesService.getScriptProperties().getProperty("TODOIST_TOKEN");

  const Url = "https://api.todoist.com/rest/v2/tasks";

  let options = {
    method: "get",
    headers: {
      Authorization: "Bearer " + SelfToken,
    },
  };

  let response = UrlFetchApp.fetch(Url, options);
  let jsonString = response.getContentText();
  let parsedAnswer = Utils.ClearAnswer(jsonString);
  Logger.log(parsedAnswer);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Task");
  try {
    const jsonString = e.postData.contents;
    const data = JSON.parse(jsonString);

    if (data.event_name === "item:added") {
      const rawTask = data.event_data;
      const cleanTask = Utils.CleanTask(rawTask);

      if (sheet) {
        sheet.appendRow([
          cleanTask.id,
          cleanTask.title,
          cleanTask.description,
          cleanTask.link,
          cleanTask.date,
          "",
          false,
        ]);
      }
    }
    return ContentService.createTextOutput("OK").setMimeType(
      ContentService.MimeType.TEXT
    );
  } catch (error) {
    if (sheet) {
      sheet.appendRow(["❌ ERROR JS", error.toString(), new Date()]);
    }
    return ContentService.createTextOutput("Error").setMimeType(
      ContentService.MimeType.TEXT
    );
  }
}
