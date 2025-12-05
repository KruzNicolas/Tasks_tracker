function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    CONFIG.SHEETS.TASK
  );

  try {
    const jsonString = e.postData.contents;
    const data = JSON.parse(jsonString);

    if (data.event_name === "item:added") {
      const rawTask = data.event_data;
      const cleanTask = Utils.CleanTask(rawTask);

      if (sheet) {
        // We search for the last real row based on column C (Task) which always has text.
        // sheet.getLastRow() returns 1000 because of pre-inserted checkboxes.
        const cValues = sheet.getRange("C1:C").getValues();
        let lastRowIndex = -1;

        // Search from bottom to top for the first cell with content
        for (let i = cValues.length - 1; i >= 0; i--) {
          if (cValues[i][0] !== "") {
            lastRowIndex = i;
            break;
          }
        }

        // Calculate the next row to write to
        const nextRow = lastRowIndex + 2;

        const rowData = [
          [
            "", // Column A (Empty Margin)
            cleanTask.date, // B
            cleanTask.title, // C
            cleanTask.description, // D
            cleanTask.link, // E
            cleanTask.priority, // F
            "Not Assigned", // G
            false, // H
            cleanTask.id, // I (Hidden)
          ],
        ];

        sheet.getRange(nextRow, 1, 1, 9).setValues(rowData);
      }
    }
    return ContentService.createTextOutput("OK");
  } catch (error) {
    return ContentService.createTextOutput("Error");
  }
}

function processEdit(e) {
  Utils.onTaskComplete(e);
}
