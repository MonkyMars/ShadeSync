import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let setLightThemeCommand = vscode.commands.registerCommand('shadesync.setLightTheme', async () => {
        const themes = vscode.extensions.all
            .filter(ext => ext.packageJSON?.contributes?.themes)
            .reduce((acc: string[], ext) => {
                const themes = ext.packageJSON.contributes.themes;
                return acc.concat(themes.map((theme: any) => theme.label || theme.id));
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
            .reduce((acc: string[], ext) => {
                const themes = ext.packageJSON.contributes.themes;
                return acc.concat(themes.map((theme: any) => theme.label || theme.id));
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
        } else {
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
        } catch (error) {
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

export function deactivate() {}