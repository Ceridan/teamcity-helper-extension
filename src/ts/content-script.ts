import { TriggerPageHandler } from "./page-handlers/trigger-page-handler";

if (TriggerPageHandler.isValidTriggersPage()) {
  const triggerPageHandler = new TriggerPageHandler();
  triggerPageHandler.generateCopyLinks();
}
