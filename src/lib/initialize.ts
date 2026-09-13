import { initializeFeatureFlags } from "./feature-flags";
import { initializeDefaultSettings } from "./settings";
import { initializeRBAC } from "./rbac";
import { initializeFacets } from "./facets";
import { initializeTypologyTemplates } from "./templates";
import { initializeModelPrices } from "./cost";

export async function initializeDatabase() {
  console.log("Initialising database...");

  await initializeFeatureFlags();
  console.log("✓ Feature flags initialised");

  await initializeDefaultSettings();
  console.log("✓ Default settings initialised");

  await initializeRBAC();
  console.log("✓ RBAC initialised (roles, permissions, default admin user)");

  await initializeFacets();
  console.log("✓ Facets initialised");

  await initializeTypologyTemplates();
  console.log("✓ Typology templates initialised");

  await initializeModelPrices();
  console.log("✓ Model prices initialised");

  console.log("Database initialisation complete.");
}

if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
