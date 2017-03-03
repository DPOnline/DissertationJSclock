# DissertationJSclock

JS for page display on dissertation pages. Accounts for Bank Holidays (most of the code is to account for Bank Holidays, they are a pain).

To include Christmas as that is also a major factor in delivery times.


Files are for the testing page. To alter JS files for live uStore application you will need to:
  Comment out/delete Metrialize initialization at top of file
  Uncomment AJAX call to server in pullRequest()
  Comment out/delete 'serverTime = new Date();' in pullRequest()
  Delete the anon function that listens for #dateInput change
