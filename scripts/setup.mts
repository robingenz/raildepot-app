import { promises as fs } from "fs";
import inquirer from "inquirer";
import { rimraf } from "rimraf";
import { execute } from "./lib/cli.mjs";
import { joinPath, replaceInFile } from "./lib/file-helper.mjs";
import { loadMobileProject } from "./lib/trapeze-helper.mjs";

execute(async () => {
  const choices = await inquirer.prompt([
    {
      name: "appName",
      type: "input",
      message: "Enter the human-friendly name of your app:",
      default: "Ionstarter Demo",
    },
    {
      name: "appId",
      type: "input",
      message:
        "Enter the unique identifier (reverse domain name notation) of your packaged app:",
      default: "dev.ionstarter.angularsqlite.demo",
    },
  ]);

  // Constants
  const version = "1.0.0";

  // Set version in package.json
  const packageJsonContent = JSON.parse(
    await fs.readFile(joinPath("package.json"), "utf8"),
  );
  packageJsonContent.version = version;
  await fs.writeFile(
    "package.json",
    JSON.stringify(packageJsonContent, null, 2),
  );

  // Remove unnecessary GitHub workflows
  await fs.unlink(".github/workflows/vercel.yml");
  await fs.unlink(".github/workflows/sync-docs.yml");

  // Clean up the environment files
  await replaceInFile(
    joinPath("src", "environments", "environment.prod.ts"),
    /privacyPolicyUrl: '[^']*'/g,
    "privacyPolicyUrl: ''",
  );
  await replaceInFile(
    joinPath("src", "environments", "environment.ts"),
    /privacyPolicyUrl: '[^']*'/g,
    "privacyPolicyUrl: ''",
  );
  await replaceInFile(
    joinPath("src", "environments", "environment.prod.ts"),
    /termsOfServiceUrl: '[^']*'/g,
    "termsOfServiceUrl: ''",
  );
  await replaceInFile(
    joinPath("src", "environments", "environment.ts"),
    /termsOfServiceUrl: '[^']*'/g,
    "termsOfServiceUrl: ''",
  );
  await replaceInFile(
    joinPath("src", "environments", "environment.prod.ts"),
    /feedbackEmailAddress: '[^']*'/g,
    "feedbackEmailAddress: ''",
  );
  await replaceInFile(
    joinPath("src", "environments", "environment.ts"),
    /feedbackEmailAddress: '[^']*'/g,
    "feedbackEmailAddress: ''",
  );
  await replaceInFile(
    joinPath("src", "environments", "environment.prod.ts"),
    /android: '[^']*'/g,
    "android: ''",
  );
  await replaceInFile(
    joinPath("src", "environments", "environment.ts"),
    /android: '[^']*'/g,
    "android: ''",
  );
  await replaceInFile(
    joinPath("src", "environments", "environment.prod.ts"),
    /ios: '[^']*'/g,
    "ios: ''",
  );
  await replaceInFile(
    joinPath("src", "environments", "environment.ts"),
    /ios: '[^']*'/g,
    "ios: ''",
  );

  // Clean up the `capacitor.config.ts` file
  await replaceInFile(
    "capacitor.config.ts",
    /'a89c8f9a-7c7e-4867-9db2-68c5795bd4b4'/g, // /LiveUpdate(.|\n)*\KappId: '[^']*'/g not working
    "''",
  );
  await replaceInFile(
    "capacitor.config.ts",
    /enabled: [^,]*/g, // /LiveUpdate(.|\n)*\Kenabled: [^,]*/g not working
    "enabled: false",
  );

  // Empty the `CHANGELOG.md` file
  await fs.writeFile("CHANGELOG.md", "# Changelog\n\n");

  // Remove the GitHub issue templates directory
  await rimraf(".github/ISSUE_TEMPLATE");

  // Load the mobile project
  const project = await loadMobileProject();

  // Android: Set the app name and app id
  await project.android?.setAppName(choices.appName);
  await project.android?.setPackageName(choices.appId);
  // See https://github.com/ionic-team/trapeze/issues/191
  await project.android
    ?.getResourceXmlFile("values/strings.xml")
    ?.replaceFragment(
      'resources/string[@name="title_activity_main"]',
      `<string name="title_activity_main">${choices.appName}</string>`,
    );

  // iOS: Set the app name and app id
  await project.ios?.setDisplayName(null, null, choices.appName);
  await project.ios?.setBundleId(null, null, choices.appId);

  // iOS: Replace custom url scheme in `Info.plist` with `YOUR_REVERSE_CLIENT_ID`
  await project.ios?.updateInfoPlist(
    null,
    null,
    {
      CFBundleURLTypes: [
        {
          CFBundleTypeRole: "Editor",
          CFBundleURLSchemes: ["YOUR_REVERSE_CLIENT_ID"],
        },
      ],
    },
    {
      replace: true,
    },
  );

  // Update the version in the Android project
  await project.android?.setVersionCode(1);
  await project.android?.setVersionName(version);

  // iOS: Upadte the version
  await project.ios?.setBuild(null, null, 1);
  await project.ios?.setVersion(null, null, version);

  // iOS: Set the development team to an empty string
  project.ios?.setBuildProperty(null, null, "DEVELOPMENT_TEAM", "");

  // Save the changes
  await project.commit();

  // Print the next steps
  console.log(
    "Commit the changes and push them to your repository to complete the setup.",
  );
});
