# Configuration Templates

## Create new Templates

1. Set up your complete desired data point configuration, which is to be included in the template, as usual via the user interface on your IOT2050

   - The network, proxy and ntp configuration should correspond to the default value. If this is changed, it will also be transferred to the new template.
   - The general information from the "General" tab is also transferred. Make sure that these have the correct value or are empty.

2. Download the configuration via the "Backup Configuration" button, inside the general tab
3. Give your template a name by editing the downloaded configuration file. The name is set under "quick-start.currentTemplateName". This will then be displayed accordingly in the UI.
4. Rename the configuration file to a appropriate name.
5. Copy the template into the template folder of you IOT2050 ("/etc/MDClight/config/templates/")
6. After restarting, the template should be available inside the configuration wizard of the UI.
