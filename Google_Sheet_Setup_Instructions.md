# How to Save Registrations Directly to Google Sheets (For GitHub / Vercel)

Since you are hosting on Vercel, you don't have a backend to run the Node server file (`server.js`). Vercel is just for your frontend code (HTML)!
To securely accept forms right into a spreadsheet online forever without needing your terminal, **Google Apps Script** is the best, easiest, and free solution.

Follow these exactly. It takes 2 minutes:

## Step 1: Create your Database
1. Go to [https://sheets.new](https://sheets.new) or open Google Sheets.
2. In the very first row (Row 1), write exactly these exact column names across A, B, C, D, E, F:
   * **Name** (in A1)
   * **Email** (in B1)
   * **Mobile** (in C1)
   * **Business** (in D1)
   * **UTR** (in E1)
   * **Date** (in F1)

## Step 2: Attach the Script
1. At the top menu of your Google Sheet, click **Extensions > Apps Script**.
2. A new code editor will open. Delete any code there.
3. **Copy and Paste** this exact block of code:

    ```javascript
    function doPost(e) {
      try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        
        // Extract parameters sent from your website
        var name = e.parameter.name;
        var email = e.parameter.email;
        var mobile = e.parameter.mobile;
        var business = e.parameter.business;
        var utr = e.parameter.utr;
        var date = e.parameter.date || new Date().toLocaleString();
        
        // Add them to the next empty row!
        sheet.appendRow([name, email, mobile, business, utr, date]);
        
        return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
      } catch(error) {
        return ContentService.createTextOutput("Error: " + error.message).setMimeType(ContentService.MimeType.TEXT);
      }
    }
    ```

## Step 3: Get your Web App URL
1. In the top-right corner of the Apps Script editor, click the blue **"Deploy"** button, then select **"New deployment"**.
2. Click the gear icon ⚙️ next to "Select type" and choose **"Web app"**.
3. Fill it out like this:
   * **Description**: `Payment Registration API`
   * **Execute as**: `Me (your email)`
   * **Who has access**: `Anyone`   *(<- CRITICAL: Make sure it's "Anyone")*
4. Click **Deploy**. (Google will ask you to authorize access to your Google Account. Click Allow/Advanced -> Go to script).
5. Copy the long **Web app URL** it provides you at the end.

## Step 4: Add URL to your Website
1. Go into `index1.html`, scroll to the very bottom to around **Line 1094**.
2. Find the line that looks like this:
   ```javascript
   const scriptURL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Highlight `YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE` and paste your copied Web App URL inside the quotes.

> Note: You can now safely delete the `server.js` file, as your website is natively wired to your Google Sheets exactly as if it were an enterprise backend. When you deploy `index1.html` to Vercel/GitHub, forms will flawlessly flow into your new Google Sheet!
