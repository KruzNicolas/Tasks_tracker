const Utils = {
  // Function to clean and structure task data
  CleanTask(task) {
    const rawDate = task.created_at || task.added_at;
    let formattedDate = rawDate;

    if (rawDate) {
      try {
        const dateObj = new Date(rawDate);
        formattedDate = Utilities.formatDate(
          dateObj,
          Session.getScriptTimeZone(),
          "yyyy-MM-dd HH:mm"
        );
      } catch (e) {
        // Keep rawDate if parsing fails
      }
    }

    return {
      id: task.id,
      title: task.content,
      description: task.description,
      link: task.url || "https://todoist.com/showTask?id=" + task.id,
      date: formattedDate,
      priority: task.priority,
    };
  },

  // Function to parse and clean API response from array of tasks
  ClearAnswer(rawJson) {
    let toDoList = typeof rawJson === "string" ? JSON.parse(rawJson) : rawJson;

    if (!Array.isArray(toDoList)) return [];
    return toDoList.map((task) => this.CleanTask(task));
  },

  // Function to close task in Todoist
  closeTaskAPI(taskId) {
    const token =
      PropertiesService.getScriptProperties().getProperty("TODOIST_TOKEN");

    if (!taskId) {
      return false;
    }

    // Use REST API v2 to close the task
    const url = `https://api.todoist.com/rest/v2/tasks/${taskId}/close`;

    try {
      const response = UrlFetchApp.fetch(url, {
        method: "post",
        headers: { Authorization: "Bearer " + token },
        muteHttpExceptions: true,
      });

      const responseCode = response.getResponseCode();

      // 204 No Content means success in REST API
      if (responseCode === 204) {
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  },

  // Main Trigger Function
  onTaskComplete(e) {
    const range = e.range;
    const sheet = range.getSheet();

    // 1. Validations: That it is the Task sheet, Column 8 (H), and value TRUE
    if (
      sheet.getName() !== CONFIG.SHEETS.TASK ||
      range.getColumn() !== 8 ||
      range.getValue() !== true
    ) {
      return;
    }

    const row = range.getRow();
    if (row < 3) return; // Ignore headers (Rows 1 and 2)

    // 2. Get row data
    // getRange(row, column 1, 1 row, 9 columns) -> Gets all A:I
    const dataRange = sheet.getRange(row, 1, 1, 9);
    const values = dataRange.getValues()[0];

    const taskId = values[8]; // Column I is the ID (Index 8)
    const taskName = values[2]; // Column C is the Task Name (Index 2)

    // 3. Call Todoist API
    const closed = this.closeTaskAPI(taskId);

    if (closed) {
      // 4. Move to History
      const historySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
        CONFIG.SHEETS.COMPLETED_TASKS
      );

      // Add closing date at the end
      const historyRow = [...values, new Date()];
      historySheet.appendRow(historyRow);

      // 5. Delete from Task
      sheet.deleteRow(row);

      SpreadsheetApp.getActive().toast(
        `Task: "${taskName}" completed and archived.`
      );
    } else {
      // If the API call failed, uncheck the checkbox and alert
      range.setValue(false);
      SpreadsheetApp.getUi().alert(
        "Error: Could not close the task in Todoist. Check the ID or Token."
      );
    }
  },
};
