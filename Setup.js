function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let taskSheet = ss.getSheetByName(CONFIG.SHEETS.TASK);
  if (!taskSheet) taskSheet = ss.insertSheet(CONFIG.SHEETS.TASK);

  taskSheet.clear();

  const headers = [
    [
      "DATE",
      "TASK",
      "DESCRIPTION",
      "LINK",
      "PRIORITY",
      "ASSIGNED_TO",
      "COMPLETED",
      "ID_TODOIST",
    ],
  ];

  // Set Column A width to be narrow (Margin)
  taskSheet.setColumnWidth(1, 15);

  taskSheet
    .getRange("B2:I2")
    .setValues(headers)
    .setFontWeight("bold")
    .setBackground(CONFIG.COLORS.HEADER_BG)
    .setFontColor(CONFIG.COLORS.HEADER_FONT);

  // Hide ID Column (I)
  taskSheet.hideColumns(9);

  const persons = ["Person 1", "Person 2", "Person 3", "Not Assigned"];
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(persons)
    .build();

  // Apply validation to Column G (Assigned To)
  const assignedRange = taskSheet.getRange("G3:G1000");
  assignedRange.setDataValidation(rule);

  // Checkboxes in Column H (Completed)
  taskSheet.getRange("H3:H1000").insertCheckboxes();

  // Apply Borders to the table (B2:I1000)
  taskSheet
    .getRange("B2:I1000")
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "#000000",
      SpreadsheetApp.BorderStyle.SOLID
    );

  // Freeze Header (Rows 1 and 2)
  taskSheet.setFrozenRows(2);

  // Delete extra columns
  const maxColumns = taskSheet.getMaxColumns();
  if (maxColumns > 9) {
    taskSheet.deleteColumns(10, maxColumns - 9);
  }

  let historySheet = ss.getSheetByName(CONFIG.SHEETS.COMPLETED_TASKS);
  if (!historySheet)
    historySheet = ss.insertSheet(CONFIG.SHEETS.COMPLETED_TASKS);

  historySheet.clear();

  // Set Column A width to be narrow (Margin)
  historySheet.setColumnWidth(1, 15);

  // Add COMPLETED_AT to headers for history
  const historyHeaders = [[...headers[0], "COMPLETED_AT"]];

  historySheet
    .getRange("B2:J2")
    .setValues(historyHeaders)
    .setFontWeight("bold")
    .setBackground(CONFIG.COLORS.HEADER_BG)
    .setFontColor(CONFIG.COLORS.HEADER_FONT);

  // Hide ID Column (I)
  historySheet.hideColumns(9);

  // Apply Borders to History Sheet (B2:J1000)
  historySheet
    .getRange("B2:J1000")
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "#000000",
      SpreadsheetApp.BorderStyle.SOLID
    );

  // Freeze Header (Rows 1 and 2)
  historySheet.setFrozenRows(2);

  // Delete extra columns
  const maxColumnsHistory = historySheet.getMaxColumns();
  if (maxColumnsHistory > 10) {
    historySheet.deleteColumns(11, maxColumnsHistory - 10);
  }
}
