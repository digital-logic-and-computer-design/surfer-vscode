import * as vscode from 'vscode';
import { SurferWaveformViewerEditorProvider } from './surferWaveformViewer';

export function activate(context: vscode.ExtensionContext) {

	// Display message when activated
	console.log('Congratulations, your extension "surfer" is now active!');

	// Register Custom Editor
	context.subscriptions.push(SurferWaveformViewerEditorProvider.register(context))

	// Add Webview with Surfer inside
	context.subscriptions.push(
		vscode.commands.registerCommand('surfer.start', async () => {

		  	// Create and show panel
		  	const panel = vscode.window.createWebviewPanel(
				'surferPanel',
				'Surfer Waveform Viewer',
				vscode.ViewColumn.One,
				{
					// Enable scripts in the webview
					enableScripts: true

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

export function deactivate() {}