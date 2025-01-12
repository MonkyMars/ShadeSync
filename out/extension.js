"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    let setLightThemeCommand = vscode.commands.registerCommand('shadesync.setLightTheme', async () => {
        const themes = vscode.extensions.all
            .filter(ext => ext.packageJSON?.contributes?.themes)
            .reduce((acc, ext) => {
            const themes = ext.packageJSON.contributes.themes;
            return acc.concat(themes.map((theme) => theme.label || theme.id));
        }, []);
        const selected = await vscode.window.showQuickPick(themes, {
            placeHolder: 'Select your light theme'
        });
        if (selected) {
            const config = vscode.workspace.getConfiguration('ShadeSync');
            await config.update('lightTheme', selected, true);
            vscode.window.showInformationMessage(`Light theme set to ${selected}`);
        }
    });
    let setDarkThemeCommand = vscode.commands.registerCommand('shadesync.setDarkTheme', async () => {
        const themes = vscode.extensions.all
            .filter(ext => ext.packageJSON?.contributes?.themes)
            .reduce((acc, ext) => {
            const themes = ext.packageJSON.contributes.themes;
            return acc.concat(themes.map((theme) => theme.label || theme.id));
        }, []);
        const selected = await vscode.window.showQuickPick(themes, {
            placeHolder: 'Select your dark theme'
        });
        if (selected) {
            const config = vscode.workspace.getConfiguration('ShadeSync');
            await config.update('darkTheme', selected, true);
            vscode.window.showInformationMessage(`Dark theme set to ${selected}`);
        }
    });
    let switchThemeCommand = vscode.commands.registerCommand('shadesync.switch', () => {
        const hour = new Date().getHours();
        const isDaytime = hour >= 7 && hour < 19;
        console.log(`Current hour: ${hour}, isDaytime: ${isDaytime}`);
        const config = vscode.workspace.getConfiguration('ShadeSync');
        const darkTheme = config.get('darkTheme', 'Default Dark+');
        const lightTheme = config.get('lightTheme', 'Default Light+');
        const currentTheme = vscode.workspace.getConfiguration().get('workbench.colorTheme');
        const newTheme = isDaytime ? lightTheme : darkTheme;
        vscode.window.showInformationMessage(`Switching theme to ${newTheme}`);
        if (currentTheme !== newTheme) {
            vscode.workspace.getConfiguration().update('workbench.colorTheme', newTheme, true)
                .then(() => {
                vscode.window.showInformationMessage(`Theme switched to ${newTheme}`);
            }, (error) => {
                console.error(`Failed to switch theme: ${error}`);
                vscode.window.showErrorMessage(`Failed to switch theme: ${error}`);
            });
        }
        else {
            vscode.window.showInformationMessage(`Theme already set to ${newTheme}!`);
        }
    });
    let switchThemeCommandManual = vscode.commands.registerCommand('shadesync.switchManual', async () => {
        const config = vscode.workspace.getConfiguration('ShadeSync');
        const darkTheme = config.get('darkTheme', 'Default Dark+');
        const lightTheme = config.get('lightTheme', 'Default Light+');
        const currentTheme = vscode.workspace.getConfiguration().get('workbench.colorTheme');
        const newTheme = currentTheme === lightTheme ? darkTheme : lightTheme;
        console.log(`Current theme: ${currentTheme}, New theme: ${newTheme}`);
        try {
            await vscode.workspace.getConfiguration().update('workbench.colorTheme', newTheme, true);
            vscode.window.showInformationMessage(`Theme switched to ${newTheme}`);
        }
        catch (error) {
            console.error(`Failed to switch theme: ${error}`);
            vscode.window.showErrorMessage(`Failed to switch theme: ${error}`);
        }
    });
    setInterval(() => {
        vscode.commands.executeCommand('shadesync.switch');
    }, 3600000);
    // Initial theme check
    vscode.commands.executeCommand('shadesync.switch');
    // Add commands to subscriptions
    context.subscriptions.push(setLightThemeCommand);
    context.subscriptions.push(setDarkThemeCommand);
    context.subscriptions.push(switchThemeCommand);
    context.subscriptions.push(switchThemeCommandManual);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map