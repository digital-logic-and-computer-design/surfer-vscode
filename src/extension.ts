// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "surfer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('surfer.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from surfer!');
	});

	context.subscriptions.push(disposable);

	// start
	context.subscriptions.push(
		vscode.commands.registerCommand('surfer.start', async () => {

		  	// Create and show panel
		  	const panel = vscode.window.createWebviewPanel(
				'surferPanel',
				'Surfer Waveform Viewer',
				vscode.ViewColumn.One,
				{
					// Enable scripts in the webview
					enableScripts: true,

					// Only allow the webview to access resources in our extension's media directory
					localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'surfer')]
				}
			);

			// Get path to resource on disk
			const indexPath = vscode.Uri.joinPath(context.extensionUri, 'surfer', 'index.html');
			const contents = await vscode.workspace.fs.readFile(indexPath)

			// Replace local paths with paths derived from WebView URIs
			let html = new TextDecoder().decode(contents);
			html = replaceAll(html, "./manifest.json", pathToURIString(context, panel, "surfer", "manifest.json"));
			html = replaceAll(html, "./surfer_bg.wasm", pathToURIString(context, panel, "surfer", "surfer_bg.wasm"));
			html = replaceAll(html, "./surfer.js", pathToURIString(context, panel, "surfer", "surfer.js"));
			html = replaceAll(html, "./sw.js", pathToURIString(context, panel, "surfer", "sw.js"));

			panel.webview.html = html;
		})
	  );
}

function replaceAll(input: string, search: string, replacement: string): string {
    return input.replace(new RegExp(search, 'g'), replacement);
}

function pathToURIString(context:vscode.ExtensionContext, panel: vscode.WebviewPanel, ...pathSegments: string[]): string {
	let path = vscode.Uri.joinPath(context.extensionUri, ...pathSegments)
	return panel.webview.asWebviewUri(path).toString()
}

// This method is called when your extension is deactivated
export function deactivate() {}