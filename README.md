# Tasks Tracker (Todoist ↔ Google Sheets Sync)

A robust Google Apps Script integration that synchronizes your Todoist tasks into a Google Sheet in real-time. It provides a custom "Table" view for your tasks and allows you to complete them directly from the spreadsheet, syncing the status back to Todoist.

## 🚀 Features

- **Real-time Synchronization**: Automatically adds new Todoist tasks to the Google Sheet via Webhooks (`item:added`).
- **Two-way Interaction**: completing a task in the Sheet (via checkbox) closes it in Todoist.
- **Custom UI**: Generates a clean, table-styled layout with specific borders, margins, and Todoist-brand colors.
- **Priority Support**: Visualizes task priority levels.
- **History Tracking**: Automatically moves completed tasks to a "Completed Tasks" sheet with a timestamp.
- **Smart Validation**: Prevents errors with data validation for assignments and protected columns.

## 🛠️ Project Structure

The project is modularized into four main files:

- **`Code.js`**: Entry point for Webhooks (`doPost`) and Triggers (`processEdit`).
- **`Utils.js`**: Contains business logic, API handling (`closeTaskAPI`), and data transformation (`CleanTask`).
- **`Setup.js`**: Handles the initialization of the Spreadsheet UI (headers, validations, styles).
- **`Config.js`**: Centralized configuration for Sheet names, Colors, and Constants.

## ⚙️ Setup & Installation

### 1. Google Apps Script Setup

1.  Create a new Google Sheet.
2.  Open **Extensions > Apps Script**.
3.  Copy the source files (`Code.js`, `Utils.js`, `Setup.js`, `Config.js`) into the project.

### 2. Environment Variables

1.  Go to **Project Settings** (Gear icon).
2.  Scroll to **Script Properties**.
3.  Add a new property:
    - **Property**: `TODOIST_TOKEN`
    - **Value**: Your Todoist API Token (found in Todoist Settings > Integrations).

### 3. Initialize UI

1.  Select the `setupSheets` function in the editor.
2.  Run it once. This will create the "Task" and "Completed Tasks" sheets with the correct formatting.

### 4. Webhook Configuration

1.  Deploy the script as a **Web App** (`Deploy > New Deployment`).
    - **Execute as**: Me.
    - **Who has access**: Anyone.
2.  Copy the **Web App URL**.
3.  Go to the [Todoist App Management Console](https://developer.todoist.com/appconsole.html).
4.  Create a new App and configure the **Webhook URL** with the link from step 2.
5.  Enable the `item:added` event.

### 5. Triggers Configuration

To enable task completion sync (Sheet -> Todoist), you must set up an **Installable Trigger** (Simple triggers like `onEdit` cannot access external APIs).

1.  Go to **Triggers** (Clock icon) in Apps Script.
2.  Add a new trigger:
    - **Function**: `processEdit`
    - **Event Source**: From spreadsheet
    - **Event Type**: On edit
3.  Save and authorize permissions.

## 📝 Usage

1.  **Create a Task**: Add a task in Todoist. It will appear in your "Task" sheet automatically.
2.  **Complete a Task**: Check the box in the "COMPLETED" column.
    - The script will call the Todoist API to close the task.
    - The row will be moved to the "Completed Tasks" sheet.
    - A toast notification will confirm the action.

## 🤝 Contributing

Commits follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

- `feat`: New features.
- `fix`: Bug fixes.
- `refactor`: Code improvements without logic changes.
- `docs`: Documentation updates.
